import { MAX_RESUME_FILE_BYTES } from "@/lib/resume-import/limits";

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/x-pdf",
  "application/octet-stream",
  "",
]);

export function getResumeFileError(file: File | null): string | null {
  if (!file || file.size === 0) {
    return "Choose a PDF file that contains your resume.";
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return "Choose a PDF file.";
  }

  if (!allowedMimeTypes.has(file.type.toLowerCase())) {
    return "This file type is not supported. Choose a PDF.";
  }

  if (file.size > MAX_RESUME_FILE_BYTES) {
    return "Your PDF must be 2 MB or smaller.";
  }

  return null;
}
