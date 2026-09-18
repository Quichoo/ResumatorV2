import type { ReactNode } from "react";
import { Text, ThemeIcon, Title } from "@mantine/core";

import classes from "./AuthLayout.module.css";

type AuthFeature = {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
};

type AuthIntroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  features: AuthFeature[];
};

export default function AuthIntro({
  eyebrow,
  title,
  description,
  features,
}: AuthIntroProps) {
  return (
    <section className={classes.intro}>
      <Text className={classes.eyebrow}>{eyebrow}</Text>

      <Title order={1} className={classes.headline}>
        {title}
      </Title>

      <Text className={classes.introDescription}>{description}</Text>

      <ul className={classes.features}>
        {features.map((feature) => (
          <li key={feature.title} className={classes.feature}>
            <ThemeIcon
              size={60}
              radius="xl"
              variant="light"
              color={feature.color}
              aria-hidden="true"
            >
              {feature.icon}
            </ThemeIcon>

            <div>
              <Text className={classes.featureTitle}>{feature.title}</Text>
              <Text className={classes.featureDescription}>
                {feature.description}
              </Text>
            </div>
          </li>
        ))}
      </ul>

      <Text className={classes.introFooter}>
        Your experience. Your story.
        <br />A stronger start to your next chapter.
      </Text>
    </section>
  );
}
