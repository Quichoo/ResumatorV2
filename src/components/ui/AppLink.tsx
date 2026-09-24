"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Anchor, Button } from "@mantine/core";

type AppLinkProps = {
  href: string;
  children: ReactNode;
};

export function AppLink({ href, children }: AppLinkProps) {
  return (
    <Anchor component={Link} href={href}>
      {children}
    </Anchor>
  );
}

export function AppLinkButton({ href, children }: AppLinkProps) {
  return (
    <Button component={Link} href={href} color="blue.8" c="white">
      {children}
    </Button>
  );
}
