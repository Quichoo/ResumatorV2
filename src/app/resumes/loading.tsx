import { Container } from "@mantine/core";
import Loader from "@/components/ui/Loader";

export default function ResumesLoading() {
  return (
    <Container size="md" py="xl">
      <Loader label="Loading resumes..." />
    </Container>
  );
}
