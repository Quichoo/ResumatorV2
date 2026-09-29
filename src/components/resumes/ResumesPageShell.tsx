import type { ReactNode } from "react";
import SignOutButton from "@/components/auth/SignOutButton";
import AppNavigation from "@/components/ui/AppNavigation";
import Brand from "@/components/ui/Brand";
import classes from "./ResumesPageShell.module.css";

type ResumesPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
};

export default function ResumesPageShell({
  title,
  description,
  children,
  action,
}: ResumesPageShellProps) {
  return (
    <div className={classes.page}>
      <div className={classes.background} aria-hidden="true" />

      <header className={classes.header}>
        <div className={classes.headerInner}>
          <Brand className={classes.brand} />

          <div className={classes.headerNavigation}>
            <AppNavigation active="resumes" />
          </div>

          <div className={classes.account}>
            <SignOutButton
              variant="outline"
              className={classes.signOutButton}
            />
          </div>
        </div>
      </header>

      <main className={classes.main}>
        <div className={classes.hero}>
          <div className={classes.intro}>
            <p className={classes.eyebrow}>Your resumes. Your opportunities.</p>

            <h1 className={classes.title}>
              {title === "My resumes" ? (
                <>
                  My <span>resumes</span>
                </>
              ) : (
                title
              )}
            </h1>

            <p className={classes.description}>{description}</p>
          </div>

          {action && <div className={classes.action}>{action}</div>}
        </div>

        <div className={classes.content}>{children}</div>
      </main>
    </div>
  );
}
