import { Container } from "@mantine/core";
import Loader from "@/components/ui/Loader";

export default function ProfileLoading() {
  return (
    <main>
      <Container size="md" py={64}>
        <Loader label="Loading your profile…" />
      </Container>
    </main>
  );
}
