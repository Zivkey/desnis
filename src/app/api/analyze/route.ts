import { Resend } from "resend";

// Where the form lands, and who it's from. Override via env if needed.
const TO = process.env.CONTACT_TO_EMAIL || "veljko@desnis.com";
// Until the domain is verified in Resend, this must stay onboarding@resend.dev.
const FROM = process.env.CONTACT_FROM_EMAIL || "DES/NIS Website <onboarding@resend.dev>";

const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Email is not configured yet." }, { status: 500 });
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { url, industry, goals, email, phone } = data;
  if (!url || !email) {
    return Response.json({ error: "Website and email are required." }, { status: 400 });
  }

  const goalList = Array.isArray(goals) ? goals.filter(Boolean).join(", ") : esc(goals);

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    replyTo: String(email),
    subject: `New site analysis request — ${esc(url)}`,
    html: `
      <h2>New site analysis request</h2>
      <p><strong>Website:</strong> ${esc(url)}</p>
      <p><strong>Industry:</strong> ${esc(industry) || "—"}</p>
      <p><strong>Needs:</strong> ${goalList || "—"}</p>
      <p><strong>Email:</strong> ${esc(email)}</p>
      <p><strong>Phone:</strong> ${esc(phone) || "—"}</p>
    `,
  });

  if (error) {
    return Response.json({ error: "Could not send your request." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
