/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IVerifyEmail, verifyEmailZodSchema } from "@/Zod/auth.validation";
import { redirect } from "next/navigation";

export type ActionResponse = {
  success: boolean;
  message: string;
};

export const verifyEmailAction = async (
  payload: IVerifyEmail,
): Promise<ActionResponse | void> => {
  const parsePayload = verifyEmailZodSchema.safeParse(payload);

  if (!parsePayload.success) {
    const firstError = parsePayload.error.issues[0].message;
    return {
      success: false,
      message: firstError,
    };
  }

  let isSuccess = false;

  try {
    await httpClient.post("/auth/verify-email", parsePayload.data);
    isSuccess = true;
  } catch (error: any) {
    console.log("Verify Email Error:", error.message);

    return {
      success: false,
      message: `Verify Email Error: ${error.message}`,
    };
  }

  if (isSuccess) {
    redirect("/login");
  }
};
