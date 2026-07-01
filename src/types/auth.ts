export type LoginPayload = {
  username: string;
  password: string;
};

export type LogoutPayload = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshPayload = {
  refreshToken: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresInAsMinutes?: number;
  accountIds?: number[];
  flowId?: string;
  email?: string;
  phone?: string;
  isPhoneRequired?: boolean;
  isEmailRequired?: boolean;
  isAuthenticatorRequired?: boolean;
};

export type TfaOptions = {
  phone: boolean;
  email: boolean;
  authenticator: boolean;
};

export type TfaInitiateResponse = {
  flowId: string;
  email: string;
  phone: string;
  isPhoneRequired: boolean;
  isEmailRequired: boolean;
  isAuthenticatorRequired: boolean;
};
