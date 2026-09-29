import Link from "next/link";
import { IconEye, IconFileText, IconPencil } from "@tabler/icons-react";
import DownloadResumeButton from "@/components/resumes/DownloadResumeButton";
import { getResumes } from "@/lib/queries/resume";
import classes from "./ResumeList.module.css";

export default async function ResumeList() {
  const result = await getResumes();

  if (!result.success) {
    throw new Error(result.message);
  }

  if (result.resumes.length === 0) {
    return (
      <div className={classes.empty}>
        <span className={classes.icon} aria-hidden="true">
          <IconFileText size={30} stroke={1.7} />
        </span>

        <h2>Your first resume starts here</h2>
        <p>Create a resume and save the job posting you want to target.</p>
      </div>
    );
  }

  return (
    <ul className={classes.list} aria-label="Your resumes">
      {result.resumes.map((resume) => (
        <li key={resume.id} className={classes.row}>
          <span className={classes.icon} aria-hidden="true">
            <IconFileText size={30} stroke={1.7} />
          </span>

          <div className={classes.details}>
            <h2 className={classes.title}>{resume.title}</h2>

            <p className={classes.target}>
              {resume.targetRole}
              {resume.companyName ? ` at ${resume.companyName}` : ""}
            </p>

            <p className={classes.updated}>
              Updated{" "}
              <time dateTime={resume.updatedAt}>
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "medium",
                  timeZone: "UTC",
                }).format(new Date(resume.updatedAt))}
              </time>
            </p>

            <div className={classes.actions}>
              <Link
                href={`/resumes/${resume.id}/edit`}
                className={classes.editLink}
                aria-label={`Edit job details for ${resume.title}`}
              >
                <IconPencil size={18} aria-hidden="true" />
                Edit job details
              </Link>

              {resume.hasGeneratedDraft && (
                <>
                  <Link
                    href={`/resumes/${resume.id}/edit#generated-resume`}
                    className={classes.editLink}
                    aria-label={`View generated resume for ${resume.title}`}
                  >
                    <IconEye size={18} aria-hidden="true" />
                    View resume
                  </Link>

                  <DownloadResumeButton resumeId={resume.id} />
                </>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
