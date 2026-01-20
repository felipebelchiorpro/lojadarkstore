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

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface CustomerLoginFormProps {
  onSuccess?: () => void;
}

export default function CustomerLoginForm({ onSuccess }: CustomerLoginFormProps) {
  const { customerLogin } = useCustomerAuth();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await customerLogin(data.email, data.password);
    if (onSuccess) onSuccess();
  };

  return (
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
          <CardTitle className="font-headline text-2xl font-bold tracking-tight">Bem-vindo de volta!</CardTitle>
          <CardDescription className="text-base mt-2">Digite suas credenciais para acessar sua conta.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-customer">Email</Label>
            <Input
              id="email-customer"
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password-customer">Senha</Label>
              <Link href="/account/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password-customer"
              type="password"
              placeholder="•••••••"
              {...form.register("password")}
              className={`bg-background/50 ${form.formState.errors.password ? "border-destructive" : "focus:border-primary"}`}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive font-medium">{form.formState.errors.password.message}</p>
            )}
          </div>
        </div>

        <Button
          type="button"
          className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all"
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>


      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link href="/account/register" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
            Cadastre-se grátis
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
