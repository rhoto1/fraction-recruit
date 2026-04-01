import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const BEHAVIORAL_QUESTIONS = [
  "I often explore technical problems beyond the scope of my assigned work, driven purely by curiosity.",
  "I engage most productively when there is clear external recognition or reward attached to the outcome.",
  "I feel uncomfortable closing a ticket if I suspect the underlying problem has not been fully resolved.",
  "Once I have completed my assigned tasks, I consider my responsibility for a feature to be fulfilled.",
  "Critical code reviews from peers are among the most valuable parts of my professional development.",
  "I find it difficult to stay engaged when my technical approach is regularly questioned by others.",
  "When a project I invested significant effort in is cancelled or pivoted, I adapt quickly without lingering frustration.",
  "Extended periods of repetitive or maintenance-focused work significantly reduce my motivation.",
  "I will raise concerns about technical risk even when the broader team is aligned on shipping quickly.",
  "In practice, I typically defer to business timelines when there is tension between speed and technical rigour.",
  "I am comfortable openly acknowledging mistakes or knowledge gaps in front of my team.",
  "I feel confident challenging a technical decision made by a more senior colleague when I have strong evidence to the contrary.",
  "I escalate risks or blockers early, even when doing so draws attention to difficulties I am facing.",
  "I actively seek feedback on my work from peers, even when it is not formally required.",
  "I feel a genuine connection to the broader impact of the product I am building, beyond my individual contributions.",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract fields
    const fullName = (formData.get("Full Name") as string) || "Unknown";
    const email = (formData.get("Email") as string) || "Not provided";
    const phone = (formData.get("Phone") as string) || "Not provided";
    const location = (formData.get("Location") as string) || "Not provided";
    const timezone = (formData.get("Timezone") as string) || "Not provided";
    const linkedin = (formData.get("LinkedIn") as string) || "Not provided";
    const github = (formData.get("GitHub") as string) || "Not provided";
    const portfolio = (formData.get("Portfolio Website") as string) || "Not provided";
    const otherLinks = (formData.get("Other Links") as string) || "Not provided";

    // Build behavioral answers
    let behavioralHtml = "";
    for (let i = 0; i < BEHAVIORAL_QUESTIONS.length; i++) {
      const answer = (formData.get(`q${i + 1}`) as string) || "Not answered";
      behavioralHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 14px;">
            <strong>Q${i + 1}.</strong> ${BEHAVIORAL_QUESTIONS[i]}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #00a3ff; font-weight: 600; font-size: 14px; white-space: nowrap;">
            ${answer}
          </td>
        </tr>`;
    }

    // Extract CV file
    const cvFile = formData.get("CV") as File | null;
    const attachments: { filename: string; content: Buffer }[] = [];

    if (cvFile && cvFile.size > 0) {
      if (cvFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "CV file must be under 5MB." },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      attachments.push({
        filename: cvFile.name,
        content: buffer,
      });
    }

    // Build email HTML
    const emailHtml = `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 700px; margin: 0 auto;">
      <div style="background: #001F54; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">
          New Application: Senior Full-Stack Developer
        </h1>
        <p style="color: #00a3ff; margin: 4px 0 0; font-size: 14px;">Fraction Recruitment Portal</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb;">
        <h2 style="color: #001F54; font-size: 16px; margin: 0 0 16px; border-bottom: 2px solid #00a3ff; padding-bottom: 8px;">
          Personal Information
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Name</td><td style="padding: 6px 0; color: #111;">${fullName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0; color: #111;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td style="padding: 6px 0; color: #111;">${phone}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Location</td><td style="padding: 6px 0; color: #111;">${location}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Timezone</td><td style="padding: 6px 0; color: #111;">${timezone}</td></tr>
        </table>

        <h2 style="color: #001F54; font-size: 16px; margin: 24px 0 16px; border-bottom: 2px solid #00a3ff; padding-bottom: 8px;">
          Portfolio & Links
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">LinkedIn</td><td style="padding: 6px 0; color: #111;">${linkedin}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">GitHub</td><td style="padding: 6px 0; color: #111;">${github}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Portfolio</td><td style="padding: 6px 0; color: #111;">${portfolio}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Other Links</td><td style="padding: 6px 0; color: #111;">${otherLinks}</td></tr>
        </table>

        <h2 style="color: #001F54; font-size: 16px; margin: 24px 0 16px; border-bottom: 2px solid #00a3ff; padding-bottom: 8px;">
          CV / Resume
        </h2>
        <p style="color: #374151; font-size: 14px;">
          ${attachments.length > 0 ? `📎 Attached: <strong>${cvFile?.name}</strong>` : "No CV uploaded"}
        </p>

        <h2 style="color: #001F54; font-size: 16px; margin: 24px 0 16px; border-bottom: 2px solid #00a3ff; padding-bottom: 8px;">
          Behavioral Assessment
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${behavioralHtml}
        </table>
      </div>

      <div style="background: #f3f4f6; padding: 16px; border-radius: 0 0 12px 12px; text-align: center; border: 1px solid #e5e7eb; border-top: 0;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          Sent from Fraction Recruitment Portal
        </p>
      </div>
    </div>`;

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: "Fraction Recruitment <onboarding@resend.dev>",
      to: "admin@fraction-solutions.com",
      subject: `New Application: ${fullName} – Senior Full-Stack Developer`,
      html: emailHtml,
      attachments,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
