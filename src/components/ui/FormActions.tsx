import { Button, Group } from "@mantine/core";

type FormActionsProps = {
  submitLabel: string;
  pending?: boolean;
  onCancel?: () => void;
};

export default function FormActions({
  submitLabel,
  pending = false,
  onCancel,
}: FormActionsProps) {
  return (
    <Group justify="flex-end">
      {onCancel && (
        <Button
          type="button"
          variant="default"
          onClick={onCancel}
          disabled={pending}
        >
          Cancel
        </Button>
      )}

      <Button
        type="submit"
        variant="filled"
        color="blue.8"
        c={pending ? undefined : "white"}
        disabled={pending}
      >
        {submitLabel}
      </Button>
    </Group>
  );
}
