import React, { Suspense } from 'react';
import type { BoxProps } from '@chakra-ui/react';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  forwardRef,
  useBoolean,
} from '@chakra-ui/react';
import { AiAssistantView } from './ai-assistant-view';

export const AiAssistantAction = forwardRef(
  (props: BoxProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const [isVisible, setVisibility] = useBoolean();

    return (
      <>
        <Tooltip hasArrow label="Chat to get the data you need">
          <Box onClick={setVisibility.on} ref={ref} {...props} />
        </Tooltip>
        <Suspense>
          <Modal
            isCentered
            isOpen={isVisible}
            onClose={setVisibility.off}
            size="3xl"
          >
            <ModalOverlay />
            <ModalContent maxWidth="95%" width="800px" height="90%">
              <ModalHeader>
                <Text>AI assistant</Text>
                <ModalCloseButton />
              </ModalHeader>
              <ModalBody pb="large">
                <AiAssistantView />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Suspense>
      </>
    );
  }
);
