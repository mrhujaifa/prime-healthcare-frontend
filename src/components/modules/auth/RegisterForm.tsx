"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerAction } from "@/app/(commonLayout)/(auth)/register/_actions";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IRegisterPayload, registerZodSchema } from "@/Zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const result = (await mutateAsync(value)) as any;
        if (!result.success) {
          setServerError(result.message || "Login failed");
          return;
        }
      } catch (error: any) {
        console.log("registation failed", error.message);
        setServerError(`Registation failed: ${error.message}`);
      }
    },
  });

  return (
    <div>
      <Card className="w-full max-w-md mx-auto shadow-lg border-muted">
        <CardHeader className="text-center space-y-1 pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            method="POST"
            action=""
            noValidate
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="name"
              validators={{ onChange: registerZodSchema.shape.name }}
            >
              {(field) => (
                <AppField
                  field={field}
                  placeholder="Enter your name"
                  type="text"
                  label="Name"
                />
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{ onChange: registerZodSchema.shape.email }}
            >
              {(field) => (
                <AppField
                  field={field}
                  placeholder="name@example.com"
                  type="email"
                  label="Email"
                />
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{ onChange: registerZodSchema.shape.password }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="cursor-pointer"
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            {serverError && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <div className="pt-2">
                  <AppSubmitButton
                    isPending={isSubmitting || isPending}
                    pendingLabel="Signing Up..."
                    disabled={!canSubmit}
                    className="w-full"
                  >
                    Create Account
                  </AppSubmitButton>
                </div>
              )}
            </form.Subscribe>
          </form>
        </CardContent>

        {/* Added a standard Sign-in redirect link commonly found in Sign-up UIs */}
        <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-primary hover:text-primary/90 hover:underline underline-offset-4 transition-colors"
          >
            Log in
          </a>
        </div>
      </Card>
    </div>
  );
};

export default RegisterForm;
