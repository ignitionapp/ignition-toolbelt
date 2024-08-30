import { Box, CloseButton, Flex, Stack } from '@chakra-ui/react';
import React, { Suspense, useEffect } from 'react';

import { AppWrapper } from './app-wrapper';
import { useStore } from './store';
import { AiAssistantView } from './bubble/ai-assistant-action/ai-assistant-view';

type Props = {
  csrfToken: string;
  onOpen(): void;
  onClose(): void;
};

export const AiAssistantApp = ({ csrfToken, onOpen, onClose }: Props) => {
  const { isAssistantVisible, setAssistantVisibility } = useStore();

  useEffect(() => {
    if (isAssistantVisible) {
      onOpen();
    } else {
      onClose();
    }
  }, [isAssistantVisible, onClose, onOpen]);

  const handleClose = () => {
    setAssistantVisibility.off();
    onClose();
  };

  return (
    <AppWrapper csrfToken={csrfToken}>
      <Stack
        display="flex"
        spacing="medium"
        height="100vh"
        backgroundColor="purple.50"
        borderLeft="2px solid #ffffff"
        minWidth="350px"
        hidden={!isAssistantVisible}
        p="large"
      >
        <Flex justifyContent="flex-end">
          <CloseButton onClick={handleClose} />
        </Flex>
        <Box flex="1">
          <Suspense>
            <AiAssistantView />
          </Suspense>
        </Box>
      </Stack>
    </AppWrapper>
  );
};
