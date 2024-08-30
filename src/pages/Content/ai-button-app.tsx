import React from 'react';
import { Button } from '@chakra-ui/react';
import { AppWrapper } from './app-wrapper';

import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStore } from './store';

export const AiButtonApp = ({ csrfToken }: { csrfToken: string }) => {
  const { isAssistantVisible, setAssistantVisibility } = useStore();

  return (
    <AppWrapper csrfToken={csrfToken}>
      <Button
        leftIcon={<FontAwesomeIcon fixedWidth icon={faRobot} />}
        variant={isAssistantVisible ? 'solid' : 'outline'}
        colorScheme="purple"
        onClick={() =>
          isAssistantVisible
            ? setAssistantVisibility.off()
            : setAssistantVisibility.on()
        }
      >
        Ask AI
      </Button>
    </AppWrapper>
  );
};
