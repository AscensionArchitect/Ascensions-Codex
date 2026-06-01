// Secure MailerLite subscribe endpoint (Next.js App Router)
// Repo location: src/app/api/subscribe/route.js
// Your API key is NOT in this file. It lives only as an environment
// variable in Vercel: MAILERLITE_API_KEY (and optional MAILERLITE_GROUP_ID).

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return Response.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const payload = { email };
    if (process.env.MAILERLITE_GROUP_ID) {
      payload.groups = [process.env.MAILERLITE_GROUP_ID];
    }

    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.text();
      return Response.json({ ok: false, error: detail }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
