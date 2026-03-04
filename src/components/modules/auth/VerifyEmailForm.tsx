/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { verifyEmailAction } from "@/app/(commonLayout)/(auth)/verify-email/_actions";
import { IVerifyEmail, verifyEmailZodSchema } from "@/Zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import AppField from "@/components/shared/form/AppField";

const VerifyEmailForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email") || "";

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IVerifyEmail) => verifyEmailAction(payload),
  });

  const form = useForm({
    defaultValues: {
      email: urlEmail,
      otp: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;

        if (!result?.success) {
          setServerError(result?.message || "Verification failed");
          return;
        }
      } catch (error: any) {
        setServerError(`Email Verify failed: ${error.message}`);
      }
    },
  });

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            We sent a code to{" "}
            <span className="font-medium text-foreground">{urlEmail}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-6"
          >
            {/* Email Field */}
            <form.Field name="email">
              {(field) => (
                <AppField
                  field={field}
                  type="email"
                  className="bg-muted text-muted-foreground"
                ></AppField>
              )}
            </form.Field>

            {/* OTP Field */}
            <form.Field
              name="otp"
              validators={{ onChange: verifyEmailZodSchema.shape.otp }}
            >
              {(field) => (
                <div className="space-y-2 flex flex-col items-center">
                  <Label htmlFor="otp" className="self-start">
                    One-Time Password (OTP)
                  </Label>
                  <InputOTP
                    maxLength={8}
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                    disabled={isPending}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              )}
            </form.Field>

            {/* Server Error Alert */}
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={!canSubmit || isPending || isSubmitting}
                >
                  {isPending || isSubmitting ? "Verifying..." : "Verify Email"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailForm;
