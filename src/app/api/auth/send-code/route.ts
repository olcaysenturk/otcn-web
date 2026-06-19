import { NextResponse } from "next/server";
import { sendTfaCode } from "@/services/auth";

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const { flowId, mfaType } = body;

    if (!flowId || !mfaType) {
        return NextResponse.json(
            { ok: false, error: "flowId and mfaType are required." },
            { status: 400 },
        );
    }

    try {
        const res = await sendTfaCode({ flowId, mfaType });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Sending code failed.",
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
                error: "Sending code failed.",
                upstreamStatus: 502,
                upstreamBody: error instanceof Error ? error.message : String(error),
            },
            { status: 502 },
        );
    }
}
