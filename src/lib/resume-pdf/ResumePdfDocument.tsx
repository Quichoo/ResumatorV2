import "server-only";

import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { GeneratedResumeView } from "@/lib/queries/generated-resume";

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 34,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.2,
    color: "#111111",
  },
  header: {
    textAlign: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.2,
    marginBottom: 8,
  },
  contact: {
    fontSize: 9,
    marginBottom: 3,
  },
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  link: {
    color: "#111111",
    fontSize: 8,
    marginHorizontal: 4,
    marginBottom: 2,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textTransform: "uppercase",
    borderBottomWidth: 0.6,
    borderBottomColor: "#444444",
    paddingBottom: 2,
    marginTop: 6,
    marginBottom: 4,
  },
  entry: {
    marginBottom: 4,
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 10,
  },
  date: {
    fontSize: 9,
    flexShrink: 0,
  },
  meta: {
    fontSize: 9,
    marginTop: 1,
    marginBottom: 3,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 1,
  },
  bulletMarker: {
    width: 9,
    flexShrink: 0,
  },
  bulletText: {
    flexGrow: 1,
    flexShrink: 1,
  },
  projectLink: {
    color: "#111111",
    fontSize: 8,
    marginTop: 2,
  },
  certification: {
    marginBottom: 3,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
});

function formatMonth(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text style={styles.sectionTitle} minPresenceAhead={36}>
      {children}
    </Text>
  );
}

function BulletPoints({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, index) => (
        <View key={index} style={styles.bullet} wrap={false}>
          <Text style={styles.bulletMarker}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </>
  );
}

type ResumePdfDocumentProps = {
  resume: GeneratedResumeView;
};

export default function ResumePdfDocument({ resume }: ResumePdfDocumentProps) {
  const links = [
    resume.profile.portfolioUrl,
    resume.profile.linkedinUrl,
    resume.profile.githubUrl,
  ].filter((url): url is string => Boolean(url));

  return (
    <Document
      title={`${resume.profile.fullName} - ${resume.job.targetRole}`}
      author={resume.profile.fullName}
      creator="Resumator"
      language="en"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} wrap={false}>
          <Text style={styles.name}>{resume.profile.fullName}</Text>

          <Text style={styles.contact}>
            {[
              resume.profile.contactEmail,
              resume.profile.phone,
              resume.profile.location,
            ]
              .filter(Boolean)
              .join(" | ")}
          </Text>

          <View style={styles.links}>
            {links.map((url) => (
              <Link key={url} src={url} style={styles.link}>
                {url.replace(/^https?:\/\//i, "").replace(/\/$/, "")}
              </Link>
            ))}
          </View>
        </View>

        {resume.summary && (
          <>
            <SectionTitle>Professional summary</SectionTitle>
            <Text>{resume.summary}</Text>
          </>
        )}

        {resume.skills.length > 0 && (
          <>
            <SectionTitle>Skills</SectionTitle>
            <Text>{resume.skills.map((skill) => skill.name).join(" · ")}</Text>
          </>
        )}

        {resume.workExperiences.length > 0 && (
          <>
            <SectionTitle>Work experience</SectionTitle>

            {resume.workExperiences.map((entry) => (
              <View key={entry.id} style={styles.entry}>
                <View wrap={false} minPresenceAhead={24}>
                  <View style={styles.headingRow}>
                    <Text style={styles.entryTitle}>{entry.jobTitle}</Text>

                    <Text style={styles.date}>
                      {formatMonth(entry.startDate)}
                      {" – "}
                      {entry.isCurrent
                        ? "Present"
                        : entry.endDate
                          ? formatMonth(entry.endDate)
                          : ""}
                    </Text>
                  </View>

                  <Text style={styles.meta}>
                    {[entry.companyName, entry.location]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                </View>

                <BulletPoints items={entry.bulletPoints} />
              </View>
            ))}
          </>
        )}

        {resume.projects.length > 0 && (
          <>
            <SectionTitle>Projects</SectionTitle>

            {resume.projects.map((entry) => (
              <View key={entry.id} style={styles.entry}>
                <Text style={styles.entryTitle} minPresenceAhead={24}>
                  {entry.projectName}
                </Text>

                <BulletPoints items={entry.bulletPoints} />

                {entry.projectUrl && (
                  <Link src={entry.projectUrl} style={styles.projectLink}>
                    {entry.projectUrl}
                  </Link>
                )}

                {entry.repositoryUrl && (
                  <Link src={entry.repositoryUrl} style={styles.projectLink}>
                    {entry.repositoryUrl}
                  </Link>
                )}
              </View>
            ))}
          </>
        )}

        {resume.educationEntries.length > 0 && (
          <>
            <SectionTitle>Education</SectionTitle>

            {resume.educationEntries.map((entry) => (
              <View key={entry.id} style={styles.entry} wrap={false}>
                <View style={styles.headingRow}>
                  <Text style={styles.entryTitle}>{entry.schoolName}</Text>
                  <Text style={styles.date}>
                    {[
                      entry.startYear,
                      entry.isCurrent ? "Present" : entry.endYear,
                    ]
                      .filter((value) => value !== null)
                      .join(" – ")}
                  </Text>
                </View>

                <Text>
                  {[entry.degree, entry.fieldOfStudy]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              </View>
            ))}
          </>
        )}

        {resume.certifications.length > 0 && (
          <>
            <SectionTitle>Certifications and courses</SectionTitle>

            {resume.certifications.map((entry) => (
              <Text key={entry.id} style={styles.certification} wrap={false}>
                <Text style={styles.bold}>{entry.name}</Text>
                {" · "}
                {entry.issuer}
                {entry.issueYear !== null && ` · ${entry.issueYear}`}
              </Text>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
}
