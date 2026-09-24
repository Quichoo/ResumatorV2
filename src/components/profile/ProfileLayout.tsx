import type { ReactNode } from "react";
import { IconFileText, IconMail, IconUser } from "@tabler/icons-react";
import { AppLink } from "@/components/ui/AppLink";
import SignOutButton from "@/components/auth/SignOutButton";
import Brand from "@/components/ui/Brand";
import classes from "./ProfileLayout.module.css";

type ProfileLayoutProps = {
  user: {
    name: string;
    email: string;
  };
  children: ReactNode;
};

export default function ProfileLayout({ user, children }: ProfileLayoutProps) {
  const initial = (user.name.trim() || user.email).charAt(0).toUpperCase();

  return (
    <div className={classes.page}>
      <div className={classes.background} aria-hidden="true">
        <span className={classes.dots} />
      </div>

      <header className={classes.header}>
        <div className={classes.headerInner}>
          <Brand className={classes.brand} />

          <div className={classes.account}>
            <div className={classes.accountIdentity}>
              <span className={classes.avatar} aria-hidden="true">
                {initial}
              </span>

              <span className={classes.accountEmail} title={user.email}>
                {user.email}
              </span>
            </div>

            <span className={classes.headerDivider} aria-hidden="true" />

            <SignOutButton
              variant="outline"
              className={classes.signOutButton}
            />
          </div>
        </div>
      </header>

      <main className={classes.main}>
        <div className={classes.hero}>
          <div>
            <p className={classes.eyebrow}>Your profile</p>
            <h1 className={classes.title}>Master Profile</h1>

            <p className={classes.subtitle}>
              Keep your information ready for your next opportunity.
            </p>

            <p className={classes.signedIn}>
              <IconMail size={18} aria-hidden="true" />
              <span>Signed in as {user.email}</span>
            </p>
          </div>

          <aside className={classes.tip} aria-label="Profile tip">
            <span className={classes.tipIcon} aria-hidden="true">
              <IconFileText size={30} stroke={1.7} />
            </span>

            <p>
              <strong>A complete profile</strong>
              <span>
                Keep your experience in one place and make tailoring your next
                resume easier.
              </span>
            </p>
          </aside>
        </div>

        <section className={classes.card} aria-labelledby="profile-details">
          <div className={classes.cardHeading}>
            <span className={classes.headingIcon} aria-hidden="true">
              <IconUser size={28} stroke={1.7} />
            </span>

            <div>
              <h2 id="profile-details">Your details</h2>
              <p>
                Add the contact information and introduction you want to use on
                your resumes.
              </p>
            </div>
          </div>

          {children}
        </section>
      </main>
      <nav aria-label="Resume navigation" className={classes.navigation}>
        <AppLink href="/resumes">My resumes</AppLink>
        <span aria-current="page">Master profile</span>
      </nav>
    </div>
  );
}
