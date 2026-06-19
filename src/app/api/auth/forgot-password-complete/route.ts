import { NextResponse } from "next/server";
import { forgotPasswordComplete } from "@/services/auth";

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    if (!body?.flowId || !body?.newPassword || !body?.confirmPassword) {
        return NextResponse.json(
            { ok: false, error: "Flow ID, new password and confirm password are required." },
            { status: 400 },
        );
    }

    try {
        const res = await forgotPasswordComplete({
            flowId: body.flowId,
            newPassword: body.newPassword,
            confirmPassword: body.confirmPassword
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Forgot password complete failed.",
                    upstreamStatus: res.status,
                    upstreamBody: data,
                },
                { status: res.status },
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error: "Forgot password complete failed.",
                upstreamStatus: 502,
                upstreamBody: error instanceof Error ? error.message : String(error),
            },
            { status: 502 },
        );
    }
}
