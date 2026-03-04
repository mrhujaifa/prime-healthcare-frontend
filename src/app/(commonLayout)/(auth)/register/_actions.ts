/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";

import { IRegisterPayload, registerZodSchema } from "@/Zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (payload: IRegisterPayload) => {
  const parsedPayload = registerZodSchema.safeParse(payload);
  console.log(parsedPayload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  let isSuccess = false;

  try {
    await httpClient.post("/auth/register", parsedPayload.data);

    isSuccess = true;
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    return {
      success: false,
      message: `Login failed: ${error.message}`,
    };
  }

  if (isSuccess) {
    redirect(`/verify-email?email=${parsedPayload.data.email}`);
  }
};
