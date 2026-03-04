import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const getTokenSecondsRemaining = (token: string): number => {
  if (!token) {
    return 0;
  }

  try {
    const tokenPayload = JWT_ACCESS_SECRET
      ? (jwt.verify(token, JWT_ACCESS_SECRET as string) as JwtPayload)
      : (jwt.decode(token) as JwtPayload);

    if (tokenPayload && !tokenPayload.exp) {
      return 0;
    }

    const remaimingSec =
      (tokenPayload.exp as number) - Math.floor(Date.now() / 1000);

    return remaimingSec > 0 ? remaimingSec : 0;
  } catch (error) {
    console.log("Error Decoding Token Error:>>>", error);
    return 0;
  }
};

// setToken in cookie like accessToken RefreshToken, better auth token
export const setTokenInCookies = async (
  name: string,
  token: string,
  fallackMaxAgeInSec = 60 * 60 * 24,
) => {
  const maxAgeSec = getTokenSecondsRemaining(token);

  await setCookie(name, token, maxAgeSec || fallackMaxAgeInSec);
};
