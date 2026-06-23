import { Resend } from "resend";
import { PLANS } from "@/lib/plans";

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

  const { firstName, lastName, email, company, website, plan, message } = data;
  if (!firstName || !email) {
    return Response.json({ error: "Name and email are required." }, { status: 400 });
  }

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const planLabel = PLANS.find((p) => p.slug === plan)?.label ?? "—";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    replyTo: String(email),
    subject: `New inquiry from ${fullName}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${esc(fullName)}</p>
      <p><strong>Email:</strong> ${esc(email)}</p>
      <p><strong>Company:</strong> ${esc(company) || "—"}</p>
      <p><strong>Website:</strong> ${esc(website) || "—"}</p>
      <p><strong>Interested in:</strong> ${esc(planLabel)}</p>
      <p><strong>Message:</strong></p>
      <p>${esc(message).replace(/\n/g, "<br>") || "—"}</p>
    `,
  });

  if (error) {
    return Response.json({ error: "Could not send your message." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
