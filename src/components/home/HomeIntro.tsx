import { Container, Stack, Text, Title } from "@mantine/core";

type HomeIntroProps = {
  title: string;
  description: string;
};

export default function HomeIntro({ title, description }: HomeIntroProps) {
  return (
    <Container size="sm" py={{ base: 48, sm: 80 }}>
      <Stack gap="md">
        <Title order={1} fz={{ base: 36, sm: 48 }}>
          {title}
        </Title>

        <Text size="lg" c="dimmed">
          {description}
        </Text>
      </Stack>
    </Container>
  );
}
