import {
  Flex,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  ModalCloseButton,
} from '@chakra-ui/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

type Props = {
  url?: string;
  name?: string;
  isOpen: boolean;
  onClose(): void;
};

export const GraphiqlModal = ({ url, name, isOpen, onClose }: Props) => {
  return (
    <Modal
      isCentered
      isOpen={isOpen}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      onClose={onClose}
      size="8xl"
    >
      <ModalOverlay />
      <ModalContent maxWidth="95%" width="1400px">
        <ModalHeader>
          <Flex justifyContent="space-between">
            <HStack spacing="large">
              <Text>{name}</Text>
              <Link colorScheme="blue" href={url} isExternal>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </Link>
            </HStack>
            <ModalCloseButton />
          </Flex>
        </ModalHeader>
        <ModalBody pb="xlarge">
          <iframe
            title="frame"
            src={url}
            width="100%"
            height="800px"
            frameBorder={0}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
