import { Alert } from "@mantine/core";

type ErrorMessageProps = {
  message: string;
  title?: string;
};

export default function ErrorMessage({
  message,
  title = "Something went wrong",
}: ErrorMessageProps) {
  return (
    <Alert color="red" title={title} role="alert">
      {message}
    </Alert>
  );
}
