import { renderToBuffer } from "@react-pdf/renderer";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { getLatestGeneratedResume } from "@/lib/queries/generated-resume";
import { consumeActionAttempt } from "@/lib/rate-limit";
import ResumePdfDocument from "@/lib/resume-pdf/ResumePdfDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ resumeId: string }>;
};

function errorResponse(message: string, status: number) {
  return Response.json(
    { success: false, message },
    {
      status,
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}

function filenamePart(value: string) {
  return (
    value
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "resume"
  );
}

export async function GET(_request: Request, { params }: RouteContext) {
  const user = await requireUser();
  const { resumeId } = await params;

  if (!z.uuid().safeParse(resumeId).success) {
    return errorResponse("Resume not found.", 404);
  }

  // The query independently checks ownership.
  // Keep authentication redirects outside the rendering catch.
  const resume = await getLatestGeneratedResume(resumeId);

  if (!resume) {
    return errorResponse("No generated resume was found.", 404);
  }

  try {
    const allowed = await consumeActionAttempt({
      userId: user.id,
      action: "resume-pdf-export",
      limit: 10,
      windowSeconds: 600,
    });

    if (!allowed) {
      return errorResponse(
        "Too many PDF requests. Please try again later.",
        429,
      );
    }

    const buffer = await renderToBuffer(ResumePdfDocument({ resume }));

    const filename =
      `${filenamePart(resume.profile.fullName)}-` +
      `${filenamePart(resume.job.targetRole)}.pdf`;

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    console.error("Resume PDF export failed.");

    return errorResponse("Unable to generate the PDF. Please try again.", 500);
  }
}
