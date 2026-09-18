import type { Metadata } from "next";
import {
  IconFileText,
  IconSparkles,
  IconFileDownload,
} from "@tabler/icons-react";

import AuthHeaderAction from "@/components/auth/AuthHeaderAction";
import AuthIntro from "@/components/auth/AuthIntro";
import AuthLayout from "@/components/auth/AuthLayout";
import SignInForm from "@/components/auth/SignInForm";
import classes from "@/components/auth/AuthLayout.module.css";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Resumator account.",
};

const features = [
  {
    title: "Start with your story",
    description: "Keep your experience and skills ready for the next step.",
    icon: <IconFileText size={28} stroke={1.7} />,
    color: "blue",
  },
  {
    title: "Find the right emphasis",
    description: "Focus each resume on the opportunity in front of you.",
    icon: <IconSparkles size={28} stroke={1.7} />,
    color: "violet",
  },
  {
    title: "Make your next move",
    description: "Review your tailored resume and prepare it for download.",
    icon: <IconFileDownload size={28} stroke={1.7} />,
    color: "teal",
  },
];

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Your next opportunity starts with your story."
      headerAction={
        <AuthHeaderAction
          prompt="New to Resumator?"
          label="Create account"
          href="/sign-up"
        />
      }
      intro={
        <AuthIntro
          eyebrow="Your career. Your next chapter."
          title={
            <>
              Ready for your
              <br />
              <span className={classes.accent}>next opportunity?</span>
            </>
          }
          description="Bring your experience into focus and build a resume that reflects what you can do."
          features={features}
        />
      }
    >
      <SignInForm />
    </AuthLayout>
  );
}
