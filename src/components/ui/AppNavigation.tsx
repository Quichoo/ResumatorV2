import Link from "next/link";
import classes from "./AppNavigation.module.css";

type AppNavigationProps = {
  active: "resumes" | "profile";
};

export default function AppNavigation({ active }: AppNavigationProps) {
  return (
    <nav className={classes.navigation} aria-label="Main navigation">
      <Link
        href="/resumes"
        className={classes.link}
        aria-current={active === "resumes" ? "page" : undefined}
      >
        My resumes
      </Link>

      <Link
        href="/profile"
        className={classes.link}
        aria-current={active === "profile" ? "page" : undefined}
      >
        Master profile
      </Link>
    </nav>
  );
}
