import type { GeneratedResumeView } from "@/lib/queries/generated-resume";
import classes from "./ResumeDocument.module.css";

type ResumeDocumentProps = {
  resume: GeneratedResumeView;
};

function formatMonth(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function BulletPoints({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className={classes.bullets}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default function ResumeDocument({ resume }: ResumeDocumentProps) {
  const links = [
    resume.profile.portfolioUrl,
    resume.profile.linkedinUrl,
    resume.profile.githubUrl,
  ].filter((url): url is string => Boolean(url));

  return (
    <article
      className={classes.document}
      aria-label={`Resume for ${resume.profile.fullName}`}
    >
      <header className={classes.header}>
        <h1>{resume.profile.fullName}</h1>

        <p>
          {[
            resume.profile.contactEmail,
            resume.profile.phone,
            resume.profile.location,
          ]
            .filter(Boolean)
            .join(" | ")}
        </p>

        {links.length > 0 && (
          <div className={classes.links}>
            {links.map((url) => (
              <a key={url} href={url}>
                {url.replace(/^https?:\/\//i, "").replace(/\/$/, "")}
              </a>
            ))}
          </div>
        )}
      </header>

      {resume.summary && (
        <section className={classes.section}>
          <h2>Professional summary</h2>
          <p>{resume.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className={classes.section}>
          <h2>Skills</h2>
          <p>{resume.skills.map((skill) => skill.name).join(" · ")}</p>
        </section>
      )}

      {resume.workExperiences.length > 0 && (
        <section className={classes.section}>
          <h2>Work experience</h2>

          {resume.workExperiences.map((entry) => (
            <div key={entry.id} className={classes.entry}>
              <div className={classes.entryHeading}>
                <div className={classes.headingRow}>
                  <h3>{entry.jobTitle}</h3>
                  <p className={classes.date}>
                    {formatMonth(entry.startDate)}
                    {" – "}
                    {entry.isCurrent
                      ? "Present"
                      : entry.endDate
                        ? formatMonth(entry.endDate)
                        : ""}
                  </p>
                </div>

                <p className={classes.meta}>
                  {[entry.companyName, entry.location]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>

              <BulletPoints items={entry.bulletPoints} />
            </div>
          ))}
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className={classes.section}>
          <h2>Projects</h2>

          {resume.projects.map((entry) => (
            <div key={entry.id} className={classes.entry}>
              <h3>{entry.projectName}</h3>
              <BulletPoints items={entry.bulletPoints} />

              <div className={classes.links}>
                {entry.projectUrl && (
                  <a href={entry.projectUrl}>{entry.projectUrl}</a>
                )}
                {entry.repositoryUrl && (
                  <a href={entry.repositoryUrl}>{entry.repositoryUrl}</a>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {resume.educationEntries.length > 0 && (
        <section className={classes.section}>
          <h2>Education</h2>

          {resume.educationEntries.map((entry) => (
            <div key={entry.id} className={classes.entry}>
              <div className={classes.headingRow}>
                <h3>{entry.schoolName}</h3>
                <p className={classes.date}>
                  {[
                    entry.startYear,
                    entry.isCurrent ? "Present" : entry.endYear,
                  ]
                    .filter((value) => value !== null)
                    .join(" – ")}
                </p>
              </div>

              <p>
                {[entry.degree, entry.fieldOfStudy].filter(Boolean).join(" · ")}
              </p>
            </div>
          ))}
        </section>
      )}

      {resume.certifications.length > 0 && (
        <section className={classes.section}>
          <h2>Certifications and courses</h2>

          {resume.certifications.map((entry) => (
            <div key={entry.id} className={classes.certification}>
              <p>
                <strong>{entry.name}</strong>
                {" · "}
                {entry.issuer}
                {entry.issueYear !== null && ` · ${entry.issueYear}`}
              </p>
            </div>
          ))}
        </section>
      )}
    </article>
  );
}
