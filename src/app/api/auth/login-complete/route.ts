import { NextResponse } from "next/server";
import { loginComplete } from "@/services/auth";
import { setSessionCookies } from "@/lib/auth/sessionCookies";

export async function POST(request: Request) {
    const body = (await request.json().catch(() => null)) as
        | { flowId?: string; remember?: boolean }
        | null;

    if (!body?.flowId) {
        return NextResponse.json(
            { ok: false, error: "flowId is required." },
            { status: 400 },
        );
    }

    try {
        const res = await loginComplete({ flowId: body.flowId });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Login complete failed.",
                    upstreamStatus: res.status,
                    upstreamBody: data,
                },
                { status: res.status },
            );
        }

        const response = NextResponse.json({ ok: true, data });
        return setSessionCookies(response, data, { remember: body.remember === true });
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error: "Login complete failed.",
                upstreamStatus: 502,
                upstreamBody: error instanceof Error ? error.message : String(error),
            },
            { status: 502 },
        );
    }
}
