import type { ReactNode } from "react";
import Link from "next/link";
import { Paper, Text, Title } from "@mantine/core";

import classes from "./AuthLayout.module.css";

type AuthLayoutProps = {
  title: string;
  description: string;
  intro: ReactNode;
  children: ReactNode;
  headerAction?: ReactNode;
};

export default function AuthLayout({
  title,
  description,
  intro,
  children,
  headerAction,
}: AuthLayoutProps) {
  return (
    <div className={classes.page}>
      <div className={classes.background} aria-hidden="true" />

      <header className={classes.header}>
        <Link href="/" className={classes.brand}>
          <span className={classes.brandMark} aria-hidden="true" />
          <span>Resumator</span>
        </Link>

        {headerAction ?? (
          <Text className={classes.headerNote}>
            Your next chapter starts here.
          </Text>
        )}
      </header>

      <main className={classes.main}>
        {intro}

        <div className={classes.cardArea}>
          <Paper className={classes.card}>
            <div className={classes.cardHeading}>
              <Title order={2} className={classes.cardTitle}>
                {title}
              </Title>

              <Text className={classes.cardDescription}>{description}</Text>
            </div>

            {children}

            <Text className={classes.cardFooter}>
              Built around your experience.
              <br />
              Tailored for your next opportunity.
            </Text>
          </Paper>

          <div className={classes.handwrittenNote} aria-hidden="true">
            A smarter way
            <br />
            to your next
            <br />
            opportunity.
          </div>
        </div>
      </main>
    </div>
  );
}
