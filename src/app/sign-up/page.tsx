import type { Metadata } from "next";
import {
  IconFileText,
  IconSparkles,
  IconFileDownload,
} from "@tabler/icons-react";

import AuthIntro from "@/components/auth/AuthIntro";
import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";
import AuthHeaderAction from "@/components/auth/AuthHeaderAction";
import classes from "@/components/auth/AuthLayout.module.css";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create your Resumator account and start building resumes around your experience.",
};

const features = [
  {
    title: "Your experience, all in one place",
    description: "Keep your skills, projects, and work history together.",
    icon: <IconFileText size={28} stroke={1.7} />,
    color: "blue",
  },
  {
    title: "Tailor for each opportunity",
    description: "Bring your most relevant experience to the forefront.",
    icon: <IconSparkles size={28} stroke={1.7} />,
    color: "violet",
  },
  {
    title: "Preview, refine, and download",
    description: "Turn your tailored content into a polished PDF resume.",
    icon: <IconFileDownload size={28} stroke={1.7} />,
    color: "teal",
  },
];

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Keep your profile and tailored resumes in one place."
      headerAction={
        <AuthHeaderAction
          prompt="Already have an account?"
          label="Sign in"
          href="/sign-in"
        />
      }
      intro={
        <AuthIntro
          eyebrow="Your career. A brighter tomorrow."
          title={
            <>
              Build a resume
              <br />
              that <span className={classes.accent}>opens doors</span>
            </>
          }
          description="Start with your experience. Shape it for the opportunity ahead, and take your next step with confidence."
          features={features}
        />
      }
    >
      <SignUpForm />
    </AuthLayout>
  );
}
