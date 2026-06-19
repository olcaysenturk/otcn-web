import { NextResponse } from "next/server";
import { forgotPasswordInit, sendForgotPasswordEmail } from "@/services/auth";

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    if (!body?.email) {
        return NextResponse.json(
            { ok: false, error: "Email is required." },
            { status: 400 },
        );
    }

    try {
        // Step 1: Send Email
        const resEmail = await sendForgotPasswordEmail({ email: body.email });
        const dataEmail = await resEmail.json().catch(() => null);

        if (!resEmail.ok) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Send forgot password email failed.",
                    upstreamStatus: resEmail.status,
                    upstreamBody: dataEmail,
                },
                { status: resEmail.status },
            );
        }

        return NextResponse.json(dataEmail);
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error: "Forgot password process failed.",
                upstreamStatus: 502,
                upstreamBody: error instanceof Error ? error.message : String(error),
            },
            { status: 502 },
        );
    }
}
