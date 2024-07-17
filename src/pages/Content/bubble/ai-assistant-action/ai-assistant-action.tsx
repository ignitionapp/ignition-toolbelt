import React, { Suspense } from 'react';
import type { BoxProps } from '@chakra-ui/react';
import { Box, forwardRef, useBoolean, Tooltip } from '@chakra-ui/react';
import { AiAssistantModal } from './ai-assistant-modal';

export const AiAssistantAction = forwardRef(
  (props: BoxProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const [isVisible, setVisibility] = useBoolean();

    return (
      <>
        <Tooltip hasArrow label="Chat to get the data you need">
          <Box onClick={setVisibility.on} ref={ref} {...props} />
        </Tooltip>
        <Suspense>
          <AiAssistantModal isOpen={isVisible} onClose={setVisibility.off} />
        </Suspense>
      </>
    );
  }
);
