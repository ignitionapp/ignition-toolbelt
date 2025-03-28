import React from 'react';
import type { BoxProps } from '@chakra-ui/react';
import { Box, Tooltip, forwardRef } from '@chakra-ui/react';
import { useStore } from '../../store';

export const AiAssistantAction = forwardRef(
  (props: BoxProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { setAssistantVisibility } = useStore();

    return (
      <Tooltip hasArrow label="Chat to get the data you need">
        <Box onClick={setAssistantVisibility.toggle} ref={ref} {...props} />
      </Tooltip>
    );
  }
);
