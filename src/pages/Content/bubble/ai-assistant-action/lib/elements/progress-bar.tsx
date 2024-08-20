import React from 'react';
import { BoxProps, HStack, Progress, Text, Stack } from '@chakra-ui/react';
import { ProgressType } from '../vars';

type Props = BoxProps & {
  progress: number;
  progressType?: ProgressType;
  totalDownloadedMegaBytes: number;
};

const getColorScheme = ({
  progressType,
}: {
  progressType?: ProgressType;
}): string => {
  switch (progressType) {
    case ProgressType.LOADING:
      return 'green';
    case ProgressType.DOWNLOAD_PREPARING:
      return 'pink';
    default:
      return 'blue';
  }
};

const getMessage = ({
  progressType,
  totalDownloadedMegaBytes,
}: {
  progressType?: ProgressType;
  totalDownloadedMegaBytes: number;
}): string => {
  switch (progressType) {
    case ProgressType.LOADING:
      return 'Initializing the assistant...';
    case ProgressType.DOWNLOADING:
      return `Downloading the assistant (${totalDownloadedMegaBytes} MB downloaded) ...`;
    case ProgressType.DOWNLOAD_PREPARING:
      return 'Preparing for download the assistant';
    default:
      return '';
  }
};

export const ProgressBar = ({
  progress,
  progressType,
  totalDownloadedMegaBytes,
  ...rest
}: Props) => (
  <Stack {...rest}>
    <Text alignSelf="flex-start" color="gray.700" fontSize="xsmall">
      {getMessage({ progressType, totalDownloadedMegaBytes })}
    </Text>
    <HStack display="flex">
      <Progress
        borderRadius="md"
        colorScheme={getColorScheme({ progressType })}
        flex="1"
        hasStripe
        isAnimated
        isIndeterminate={progressType === ProgressType.DOWNLOAD_PREPARING}
        size="lg"
        value={progress}
      />
      {progressType !== ProgressType.DOWNLOAD_PREPARING && (
        <Text color="gray.600" fontSize="xsmall">
          {`${progress}%`}
        </Text>
      )}
    </HStack>
  </Stack>
);
