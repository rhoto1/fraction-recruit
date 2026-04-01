import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract the CV file
    const cvFile = formData.get("CV") as File | null;
    if (!cvFile || cvFile.size === 0) {
      return NextResponse.json(
        { success: false, message: "CV file is required." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (cvFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "CV file must be under 5MB." },
        { status: 400 }
      );
    }

    // Upload CV to Vercel Blob
    const timestamp = Date.now();
    const safeName = cvFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const applicantName = (formData.get("Full Name") as string) || "unknown";
    const safeApplicantName = applicantName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const blobPath = `cvs/${safeApplicantName}_${timestamp}_${safeName}`;

    const blob = await put(blobPath, cvFile, {
      access: "public",
    });

    // Build Web3Forms submission (without the file)
    const web3Data = new FormData();
    web3Data.append("access_key", "d0f96f12-69bf-43c3-a94b-67e1311fd629");
    web3Data.append("subject", "New Application: Senior Full-Stack Developer");
    web3Data.append("from_name", "Fraction Recruitment Portal");

    // Forward all non-file fields
    for (const [key, value] of formData.entries()) {
      if (key !== "CV" && key !== "access_key" && key !== "subject" && key !== "from_name" && typeof value === "string") {
        web3Data.append(key, value);
      }
    }

    // Add CV download link
    web3Data.append("CV Download Link", blob.url);

    // Submit to Web3Forms
    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3Data,
    });

    const web3Result = await web3Response.json();

    if (web3Result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: web3Result.message || "Submission failed." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
