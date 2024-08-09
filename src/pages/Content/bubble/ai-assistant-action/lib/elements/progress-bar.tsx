import React from 'react';
import { BoxProps, HStack, Progress, Text, Stack } from '@chakra-ui/react';
import { match } from 'ts-pattern';
import { ProgressType } from '../vars';

type Props = BoxProps & {
  progress: number;
  progressType?: ProgressType;
  totalDownloadedMegaBytes: number;
};

const getColorScheme = ({ progressType }: { progressType?: ProgressType }) =>
  match(progressType)
    .with(ProgressType.LOADING, () => 'green')
    .with(ProgressType.DOWNLOAD_PREPARING, () => 'pink')
    .otherwise(() => 'blue');

const getMessage = ({
  progressType,
  totalDownloadedMegaBytes,
}: {
  progressType?: ProgressType;
  totalDownloadedMegaBytes: number;
}) =>
  match(progressType)
    .with(ProgressType.LOADING, () => 'Initializing the assistant...')
    .with(
      ProgressType.DOWNLOADING,
      () =>
        `Downloading the assistant (${totalDownloadedMegaBytes} MB downloaded) ...`
    )
    .with(
      ProgressType.DOWNLOAD_PREPARING,
      () => 'Preparing for download the assistant'
    )
    .otherwise(() => '');

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
