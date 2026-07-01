import { NextResponse } from "next/server";
import { verifyTfa } from "@/services/auth";

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    if (!body?.flowId || !body?.code || !body?.tfaType) {
        return NextResponse.json(
            { ok: false, error: "Missing required fields." },
            { status: 400 },
        );
    }

    try {
        const res = await verifyTfa({
            flowId: body.flowId,
            tfaType: body.tfaType,
            code: body.code,
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Verification failed.",
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
                error: "Verification failed.",
                upstreamStatus: 502,
                upstreamBody: error instanceof Error ? error.message : String(error),
            },
            { status: 502 },
        );
    }
}
