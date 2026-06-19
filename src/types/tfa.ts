export type SendTfaCodePayload = {
    flowId: string;
    mfaType: TfaType;
}

export type VerifyTfaPayload = {
    flowId: string;
    tfaType: TfaType;
    code: string;
}

export type SendTfaResponse = {
    otpCounterInSeconds: number;
}

export type TfaType = "Sms" | "Email" | "Authenticator";
