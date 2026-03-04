import { cookies } from "next/headers";

// set cookie in the browser
export const setCookie = async (
  name: string,
  value: string,
  maxAgeInSec: number,
) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeInSec,
  });
};

// get cookie identify user authentication
export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};

// deleted cookie token expire, logout, etc
export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.delete(name);
};
