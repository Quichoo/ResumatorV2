import { Skeleton, Stack } from "@mantine/core";
import classes from "./ResumeList.module.css";

export default function ResumeListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your resumes">
      <div className={classes.list} aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <div key={index} className={classes.row}>
            <div className={classes.icon}>
              <Skeleton height={28} width={28} radius="sm" animate={false} />
            </div>

            <div className={classes.details}>
              <Stack gap={10}>
                <Skeleton height={24} width="55%" animate={false} />
                <Skeleton height={17} width="75%" animate={false} />
                <Skeleton height={14} width="35%" animate={false} />
              </Stack>

              <div className={classes.actions}>
                <Skeleton height={42} width={165} radius={9} animate={false} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
