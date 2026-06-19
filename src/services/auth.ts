import { getApiBase } from "@/lib/api/getApiBase";
import type { LoginPayload, LogoutPayload, RefreshPayload } from "@/types/auth";

export async function loginUser(payload: LoginPayload) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/Authentication/login-initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function logoutUser(payload: LogoutPayload) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/Authentication/signout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function refreshUser(payload: RefreshPayload) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/Authentication/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function registerUser(payload: any) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/Authentication/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function initializeSmsVerification(payload: { userRegisterNotification: string }) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/Authentication/initialize-sms-verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function completeEmailRegister(payload: { userRegisterNotification: string }) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/Authentication/complete-email-register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en-US",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function verifyTfa(payload: { flowId: string, tfaType: "Sms" | "Email" | "Google", code: string }) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/tfa/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function setPasswordUser(payload: { registerNotificationId: string, password: string }) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/Authentication/set-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function sendTfaCode(payload: { flowId: string, mfaType: string }) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/tfa/send-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en-US",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function loginComplete(payload: { flowId: string }) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/Authentication/login-complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en-US",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function sendVerificationCode(flowId: string, mfaType: "Email" | "Sms") {
  return fetch(`/api/auth/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flowId, mfaType }),
  });
}

export async function resendEmailRegister(payload: { userRegisterNotification: string }) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/Authentication/resend-email-register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en-US",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function sendForgotPasswordEmail(payload: { email: string }) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/account/send-forgot-password-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en-US",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function forgotPasswordInit(payload: { flowId: string }) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/account/forgot-password-init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en-US",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}

export async function forgotPasswordComplete(payload: { flowId: string, newPassword: string, confirmPassword: string }) {
  const base = getApiBase();
  const serviceToken = process.env.API_AUTH_TOKEN;
  return fetch(`${base}/v3/account/forgot-password-complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en-US",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify(payload)
  });
}
