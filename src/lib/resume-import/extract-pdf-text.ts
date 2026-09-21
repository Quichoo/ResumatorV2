import "server-only";

import { extractText, getResolvedPDFJS } from "unpdf";
import {
  MAX_RESUME_PAGES,
  MAX_RESUME_TEXT_LENGTH,
  RESUME_PARSE_TIMEOUT_MS,
} from "@/lib/resume-import/limits";
import type { ResumeTextPreview } from "@/types/resume-import";

export class ResumePdfError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResumePdfError";
  }
}

export async function extractResumePdfText(
  bytes: Uint8Array,
): Promise<ResumeTextPreview> {
  const { getDocument } = await getResolvedPDFJS();

  const loadingTask = getDocument({
    data: bytes,
    stopAtErrors: true,
    maxImageSize: 4_000_000,
    useSystemFonts: true,
    disableFontFace: true,
    useWorkerFetch: false,
    verbosity: 0,
  });

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  async function readDocument(): Promise<ResumeTextPreview> {
    const pdf = await loadingTask.promise;

    if (pdf.numPages > MAX_RESUME_PAGES) {
      throw new ResumePdfError(
        `Your resume must contain ${MAX_RESUME_PAGES} pages or fewer.`,
      );
    }

    const extracted = await extractText(pdf, { mergePages: true });

    const text = extracted.text.replaceAll("\u0000", "").trim();

    if (!text) {
      throw new ResumePdfError(
        "No readable text was found. Upload a PDF with selectable text. Scanned images are not supported yet.",
      );
    }

    if (text.length > MAX_RESUME_TEXT_LENGTH) {
      throw new ResumePdfError(
        "This PDF contains too much text. Upload a shorter resume.",
      );
    }

    return {
      text,
      pageCount: pdf.numPages,
    };
  }

  try {
    // Best-effort deadline; it cannot interrupt synchronous parser work.
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(
          new ResumePdfError(
            "Reading this PDF took too long. Try exporting a simpler PDF.",
          ),
        );
      }, RESUME_PARSE_TIMEOUT_MS);
    });

    return await Promise.race([readDocument(), timeout]);
  } catch (error) {
    if (error instanceof ResumePdfError) {
      throw error;
    }

    if (error instanceof Error && error.name === "PasswordException") {
      throw new ResumePdfError(
        "This PDF is password protected. Upload an unlocked copy.",
      );
    }

    throw new ResumePdfError(
      "We could not read this PDF. Try exporting your resume as a new PDF.",
    );
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    await loadingTask.destroy().catch(() => undefined);
  }
}
