"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const registerSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
    email: z.string().email("Por favor, insira um e-mail válido."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string(),
    phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { customerRegister } = useCustomerAuth();
    const { toast } = useToast();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await customerRegister({
                name: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone,
            });
        } catch (error) {
            // Error is already handled/toasted in context
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
            <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-fit mb-2">
                        <Image
                            src="/darkstore-logo.png"
                            alt="DarkStore Logo"
                            width={180}
                            height={44}
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div>
                        <CardTitle className="font-headline text-2xl font-bold tracking-tight">Crie sua conta</CardTitle>
                        <CardDescription className="text-base mt-2">Preencha os dados abaixo para se cadastrar.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                placeholder="Seu nome"
                                {...form.register("name")}
                                className={`bg-background/50 ${form.formState.errors.name ? "border-destructive" : "focus:border-primary"}`}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive font-medium">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                {...form.register("email")}
                                className={`bg-background/50 ${form.formState.errors.email ? "border-destructive" : "focus:border-primary"}`}
                            />
                            {form.formState.errors.email && (
                                <p className="text-sm text-destructive font-medium">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone (Opcional)</Label>
                            <Input
                                id="phone"
                                placeholder="(00) 00000-0000"
                                {...form.register("phone")}
                                className="bg-background/50 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="•••••••"
                                {...form.register("password")}
                                className={`bg-background/50 ${form.formState.errors.password ? "border-destructive" : "focus:border-primary"}`}
                            />
                            {form.formState.errors.password && (
                                <p className="text-sm text-destructive font-medium">{form.formState.errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="•••••••"
                                {...form.register("confirmPassword")}
                                className={`bg-background/50 ${form.formState.errors.confirmPassword ? "border-destructive" : "focus:border-primary"}`}
                            />
                            {form.formState.errors.confirmPassword && (
                                <p className="text-sm text-destructive font-medium">{form.formState.errors.confirmPassword.message}</p>
                            )}
                        </div>

                    </div>

                    <Button
                        type="button"
                        className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all mt-4"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Cadastrando..." : "Criar Conta"}
                    </Button>

                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-center text-sm text-muted-foreground">
                        Já tem uma conta?{' '}
                        <Link href="/account/login" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                            Fazer Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
