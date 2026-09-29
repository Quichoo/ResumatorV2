import { SimpleGrid, Skeleton, Stack } from "@mantine/core";
import AppNavigation from "@/components/ui/AppNavigation";
import Brand from "@/components/ui/Brand";
import classes from "@/components/profile/ProfileLayout.module.css";

export default function ProfileLoading() {
  return (
    <div className={classes.page}>
      <div className={classes.background} aria-hidden="true">
        <span className={classes.dots} />
      </div>

      <header className={classes.header}>
        <div className={classes.headerInner}>
          <Brand className={classes.brand} />

          <div className={classes.headerNavigation}>
            <AppNavigation active="profile" />
          </div>

          <div className={classes.account} aria-hidden="true">
            <Skeleton height={42} width={90} radius={10} animate={false} />
          </div>
        </div>
      </header>

      <main
        className={classes.main}
        aria-busy="true"
        aria-label="Loading your profile"
      >
        <div className={classes.hero}>
          <div>
            <p className={classes.eyebrow}>Your profile</p>
            <h1 className={classes.title}>Master Profile</h1>

            <p className={classes.subtitle}>
              Keep your information ready for your next opportunity.
            </p>

            <Skeleton
              height={18}
              width="65%"
              mt={12}
              animate={false}
              aria-hidden="true"
            />
          </div>

          <Skeleton
            height={110}
            radius={16}
            animate={false}
            aria-hidden="true"
          />
        </div>

        <div className={classes.card} aria-hidden="true">
          <Stack gap={26}>
            <Stack gap={10}>
              <Skeleton height={26} width={160} animate={false} />
              <Skeleton height={16} width="70%" animate={false} />
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={22}>
              {Array.from({ length: 6 }, (_, index) => (
                <Stack key={index} gap={8}>
                  <Skeleton height={16} width={110} animate={false} />
                  <Skeleton height={44} radius={9} animate={false} />
                </Stack>
              ))}
            </SimpleGrid>

            <Stack gap={8}>
              <Skeleton height={16} width={110} animate={false} />
              <Skeleton height={44} radius={9} animate={false} />
            </Stack>

            <Stack gap={8}>
              <Skeleton height={16} width={170} animate={false} />
              <Skeleton height={112} radius={9} animate={false} />
            </Stack>

            <Stack align="flex-end">
              <Skeleton height={44} width={140} radius={10} animate={false} />
            </Stack>
          </Stack>
        </div>
      </main>
    </div>
  );
}
