import React from 'react';
import { Button, Text, useClipboard } from '@chakra-ui/react';
import type { ButtonProps } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

type Props = ButtonProps & {
  value: string;
};

export const CopyButton = React.forwardRef(
  (props: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { isDisabled, value, ...rest } = props;
    const { hasCopied, onCopy } = useClipboard(value);

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onCopy();
    };

    return (
      <Button
        color="faint"
        size="xs"
        onClick={handleClick}
        ref={ref}
        _hover={{ color: isDisabled ? 'faint' : 'blue.500' }}
        sx={{ pointerEvents: 'auto !important' }}
        transition="all 0.5s"
        {...rest}
      >
        {hasCopied ? (
          <Text color="green.500">
            <FontAwesomeIcon icon={faCheck} />
          </Text>
        ) : (
          <FontAwesomeIcon icon={faCopy} />
        )}
      </Button>
    );
  }
);
