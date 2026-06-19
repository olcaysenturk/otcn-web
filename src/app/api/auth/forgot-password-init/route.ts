import { NextResponse } from "next/server";
import { forgotPasswordInit } from "@/services/auth";

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    if (!body?.flowId) {
        return NextResponse.json(
            { ok: false, error: "Flow ID is required." },
            { status: 400 },
        );
    }

    try {
        const res = await forgotPasswordInit({ flowId: body.flowId });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Forgot password init failed.",
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
                error: "Forgot password init failed.",
                upstreamStatus: 502,
                upstreamBody: error instanceof Error ? error.message : String(error),
            },
            { status: 502 },
        );
    }
}
