export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
    role: string;
    image: string;
    needPasswordChange: boolean;
    emailVerified: boolean;
    status: string;
    isDeleted: boolean;
  };
}
export interface IResigterResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
    role: string;
    image: string;
    needPasswordChange: boolean;
    emailVerified: boolean;
    status: string;
    isDeleted: boolean;
  };
}
