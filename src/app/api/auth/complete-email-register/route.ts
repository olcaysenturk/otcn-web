import { NextResponse } from "next/server";
import { completeEmailRegister } from "@/services/auth";

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    if (!body?.userRegisterNotification) {
        return NextResponse.json(
            { ok: false, error: "userRegisterNotification is required." },
            { status: 400 },
        );
    }

    try {
        const res = await completeEmailRegister({ userRegisterNotification: body.userRegisterNotification });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Email Register completion failed.",
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
                error: "Email Register completion failed.",
                upstreamStatus: 502,
                upstreamBody: error instanceof Error ? error.message : String(error),
            },
            { status: 502 },
        );
    }
}
