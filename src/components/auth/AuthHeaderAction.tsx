import Link from "next/link";

import classes from "./AuthLayout.module.css";

type AuthHeaderActionProps = {
  prompt: string;
  label: string;
  href: string;
};

export default function AuthHeaderAction({
  prompt,
  label,
  href,
}: AuthHeaderActionProps) {
  return (
    <div className={classes.headerAction}>
      <span className={classes.headerPrompt}>{prompt}</span>

      <Link href={href} className={classes.headerLink}>
        {label}
      </Link>
    </div>
  );
}
