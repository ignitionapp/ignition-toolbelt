import React from 'react';
import {
  Flex,
  HStack,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';

export const AboutModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>About</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingX="xlarge" paddingBottom="xxlarge">
          <Stack spacing="small">
            <Text>
              <Text as="span" fontWeight="bold">
                Ignition Toolbelt
              </Text>{' '}
              was born during our exciting{' '}
              <Link
                color="blue.500"
                textDecoration="underline"
                href="https://ignitionapp.atlassian.net/wiki/spaces/ENG/pages/2763423809/Ignition+Toolbelt+-+Chrome+Extension"
                isExternal
              >
                Sparkathon event in 2022
              </Link>
              . Since then, it's been my personal project, growing with each day
              to make my Ignition tasks easier. While I created it for myself,
              I'm thrilled to share its usefulness with you. I will be very
              happy if you find it's helpful.
            </Text>
            <Text>
              My goal with this extension? To recapture the magic of my{' '}
              <Link
                color="blue.500"
                textDecoration="underline"
                href="https://ignitionapp.atlassian.net/wiki/spaces/ENG/pages/3057975297/Sparky+AI+assistant+with+voice+control"
                isExternal
              >
                2023 GPT hack
              </Link>{' '}
              through this tool!
            </Text>
            <Text>
              Feel free to reach out on{' '}
              <Link
                color="blue.500"
                textDecoration="underline"
                href="https://ignitionapp.slack.com/team/U027C1PSVEJ"
                isExternal
              >
                Slack
              </Link>{' '}
              or suggest a feature{' '}
              <Link
                color="blue.500"
                textDecoration="underline"
                href="https://github.com/ignitionapp/ignition-toolbelt/issues"
                isExternal
              >
                here
              </Link>
            </Text>
            <HStack alignItems="center" justifyContent="center" spacing="large">
              <Text>Made by</Text>
              <Tooltip label="Joseph">
                <Link
                  href="https://ignitionapp.slack.com/team/U027C1PSVEJ"
                  isExternal
                >
                  <Image
                    src="https://gravatar.com/avatar/c43978727926bed201399816f7efb45d?size=256&cache=1713570750542"
                    width="50px"
                    height="50px"
                    borderRadius="50%"
                  />
                </Link>
              </Tooltip>
              <Text>with ❤️</Text>
            </HStack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Flex
            color="faint"
            justifyContent="space-between"
            width="100%"
            fontSize="xsmall"
          >
            <Text>Environment: {process.env.NODE_ENV}</Text>
            <Text>Version: {process.env.PACKAGE_VERSION}</Text>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
