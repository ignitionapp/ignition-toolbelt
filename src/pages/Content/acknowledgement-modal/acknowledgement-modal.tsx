import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { AcknowledgementList } from '../acknowledgement-list';

type Props = {
  isOpen: boolean;
  onClose(): void;
};

export const AcknowledgementModal = ({ isOpen, onClose }: Props) => {
  const isUpdatedRef = useRef<boolean>(false);

  const handleClose = () => {
    onClose();
    if (isUpdatedRef.current) {
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleUpdateSuccess = () => {
    isUpdatedRef.current = true;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="6xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Acknowledgements</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingX="xxlarge" paddingY="large" minHeight="500px">
          <AcknowledgementList onUpdateSuccess={handleUpdateSuccess} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
