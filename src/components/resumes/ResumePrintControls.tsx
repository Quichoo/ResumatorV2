"use client";

import { useState } from "react";
import classes from "./ResumePrint.module.css";

type ResumePrintControlsProps = {
  resumeId: string;
};

export default function ResumePrintControls({
  resumeId,
}: ResumePrintControlsProps) {
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePrint() {
    if (isPreparing) return;

    setIsPreparing(true);
    setError(null);

    try {
      await document.fonts.ready;
      window.print();
    } catch {
      setError("Could not open printing. Please try again.");
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <div className={classes.controls}>
      <div className={classes.actions}>
        <a href={`/resumes/${resumeId}/edit`}>Back to resume</a>

        <button type="button" onClick={handlePrint} disabled={isPreparing}>
          {isPreparing ? "Preparing..." : "Print / Save as PDF"}
        </button>
      </div>

      <p>
        Choose A4, 100% scale, and turn off browser headers and footers. Check
        the page count before saving.
      </p>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
