"use client";

import type { ReactNode } from "react";
import { ActionIcon, Button, Tooltip } from "@mantine/core";

type RecordActionButtonProps = {
  label: string;
  ariaLabel?: string;
  icon?: ReactNode;
  compact?: boolean;
  color?: string;
  disabled?: boolean;
  onClick: () => void;
};

export default function RecordActionButton({
  label,
  ariaLabel = label,
  icon,
  compact = false,
  color = "blue.8",
  disabled = false,
  onClick,
}: RecordActionButtonProps) {
  if (compact && icon) {
    return (
      <Tooltip
        label={ariaLabel}
        disabled={disabled}
        events={{ hover: true, focus: true, touch: false }}
      >
        <ActionIcon
          type="button"
          size={34}
          radius="sm"
          variant="filled"
          color={color}
          c={disabled ? undefined : "white"}
          aria-label={ariaLabel}
          disabled={disabled}
          onClick={onClick}
        >
          {icon}
        </ActionIcon>
      </Tooltip>
    );
  }

  return (
    <Button
      type="button"
      variant="filled"
      color={color}
      c={disabled ? undefined : "white"}
      leftSection={icon}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
