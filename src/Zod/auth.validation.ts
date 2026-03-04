import z from "zod";

export const loginZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is require")
    .min(8, "Password must be at least 8 characters long"),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export const registerZodSchema = z.object({
  name: z
    .string("Name is require")
    .min(5, "Name must be at least 5 characters long"),
  email: z.email("Invalid email address"),
  password: z
    .string("")
    .min(1, "Password is require")
    .min(6, "Password must be at least 8 characters long"),
});

export type IRegisterPayload = z.infer<typeof registerZodSchema>;

export const verifyEmailZodSchema = z.object({
  email: z.email(),
  otp: z.string("OTP must be at least 8 characters"),
});

export type IVerifyEmail = z.infer<typeof verifyEmailZodSchema>;
