import React from 'react';
import { BoxProps, HStack, Progress, Text, Stack } from '@chakra-ui/react';
import { ProgressType } from '../vars';

type Props = BoxProps & {
  message: string;
  progress: number;
  progressType?: ProgressType;
};

export const ProgressBar = ({
  message,
  progress,
  progressType,
  ...rest
}: Props) => (
  <Stack {...rest}>
    <Text alignSelf="flex-start" color="gray.700" fontSize="xsmall">
      {message}
    </Text>
    <HStack display="flex">
      <Progress
        colorScheme={progressType === ProgressType.LOADING ? 'green' : 'blue'}
        borderRadius="md"
        flex="1"
        size="lg"
        value={progress}
        hasStripe
        isAnimated
      />
      <Text color="gray.600" fontSize="xsmall">
        {`${progress}%`}
      </Text>
    </HStack>
  </Stack>
);
