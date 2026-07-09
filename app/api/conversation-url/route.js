/**
 * Server-only: fetches a signed ElevenLabs conversation URL.
 * Never put ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID in NEXT_PUBLIC_* vars.
 */
export async function GET() {
    // Prefer server-only names; fall back to existing Netlify NEXT_PUBLIC_* vars
    const apiKey =
        process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_API_KEY;
    const agentId =
        process.env.ELEVENLABS_AGENT_ID || process.env.NEXT_PUBLIC_AGENT_ID;

    if (!apiKey || !agentId) {
        return Response.json(
            { error: "Voice service is not configured." },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${encodeURIComponent(agentId)}`,
            {
                method: "GET",
                headers: {
                    "xi-api-key": apiKey,
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            console.error("ElevenLabs signed URL error:", response.status);
            return Response.json(
                { error: "Failed to start voice session." },
                { status: 502 }
            );
        }

        const body = await response.json();
        if (!body.signed_url) {
            return Response.json(
                { error: "Invalid response from voice provider." },
                { status: 502 }
            );
        }

        return Response.json({ signed_url: body.signed_url });
    } catch (error) {
        console.error("ElevenLabs request failed:", error);
        return Response.json(
            { error: "Failed to start voice session." },
            { status: 500 }
        );
    }
}
