'use server';

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { triggerOrderCreatedWebhook } from '@/services/webhookTriggerService';
import { incrementCouponUsage } from '@/actions/coupons';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export async function processCheckout(cartItems: any[], total: number, phone?: string) {
    console.log("Processing checkout for", cartItems.length, "items", "Phone:", phone);

    if (!process.env.MP_ACCESS_TOKEN) {
        console.error("MP_ACCESS_TOKEN not found");
        return { success: false, message: "Erro de configuração de pagamento." };
    }

    try {
        const preference = new Preference(client);

        const items = cartItems.map(item => ({
            id: item.id,
            title: item.name,
            quantity: item.quantity,
            unit_price: Number(item.price)
        }));

        const result = await preference.create({
            body: {
                items: items,
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/checkout/success`,
                    failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/checkout/failure`,
                    pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/checkout/pending`,
                },
                auto_return: 'approved',
                external_reference: `ORD-${Date.now()}-${phone}`, // Pass phone in ref for basic tracking
                metadata: {
                    phone: phone
                }
            }
        });

        if (result.init_point) {
            // Track Coupon Usage (Optimistic)
            const usedCoupons = new Set<string>();
            cartItems.forEach(item => {
                if (item.couponCode) {
                    usedCoupons.add(item.couponCode);
                }
            });

            for (const code of Array.from(usedCoupons)) {
                await incrementCouponUsage(code);
            }

            return { success: true, url: result.init_point };
        } else {
            return { success: false, message: "Falha ao criar preferência de pagamento." };
        }

    } catch (error) {
        console.error("Error creating preference:", error);
        return { success: false, message: "Erro ao processar pagamento." };
    }
}
