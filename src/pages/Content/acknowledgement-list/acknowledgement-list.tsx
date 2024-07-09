import {
  Badge,
  Button,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Highlight,
  HStack,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import debounce from 'debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  useAcknowledgementAddMutation,
  useAcknowledgementRemoveMutation,
  useAcknowledgementsQuery,
} from '@generated/ignition/hooks';
import {
  Acknowledgement,
  AcknowledgementLevel,
} from '@generated/ignition/types';

const ACCESSED_ACKNOWLEDGEMENTS_LOG = 'accessed_acknowledgements';
const ACKNOWLEDGEMENTS_SEARCH_KEYWORD = 'acknowledgements_search_keyword';

const updateLocalStorage = debounce((key: string, value: string) => {
  chrome.storage.local.set({
    [key]: value,
  });
}, 500);

type Props = {
  onUpdateSuccess(): void;
};

export const AcknowledgementList = ({ onUpdateSuccess }: Props) => {
  const { data, loading, refetch } = useAcknowledgementsQuery();
  const [acks, setAcks] = useState<Acknowledgement[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [acknowledgementRemove, { loading: isProcessingRemoveAck }] =
    useAcknowledgementRemoveMutation();
  const [acknowledgementAdd, { loading: isProcessingAddAck }] =
    useAcknowledgementAddMutation();

  useEffect(() => {
    chrome.storage.local.get([ACKNOWLEDGEMENTS_SEARCH_KEYWORD], (result) => {
      if (result[ACKNOWLEDGEMENTS_SEARCH_KEYWORD]) {
        setSearchKeyword(result[ACKNOWLEDGEMENTS_SEARCH_KEYWORD]);
      }
    });
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }
    const { acknowledgements = [] } = data;

    chrome.storage.local.get([ACCESSED_ACKNOWLEDGEMENTS_LOG], (result) => {
      const savedAcks = result[ACCESSED_ACKNOWLEDGEMENTS_LOG] || [];
      const newAcks = acknowledgements.filter(
        ({ id }) => !savedAcks.some((ack: Acknowledgement) => ack.id === id)
      );
      if (newAcks.length) {
        const nextAcks = [...savedAcks, ...newAcks];
        setAcks(nextAcks);
        chrome.storage.local.set({
          [ACCESSED_ACKNOWLEDGEMENTS_LOG]: nextAcks,
        });
      } else {
        setAcks(savedAcks);
      }
    });
  }, [data]);

  if (loading || !data) return null;

  const handleToggleAck = async (
    id: string,
    level: AcknowledgementLevel,
    checked: boolean
  ) => {
    if (!checked) {
      await acknowledgementRemove({ variables: { id, level } });
    } else {
      await acknowledgementAdd({ variables: { id, level } });
    }
    await refetch();
    onUpdateSuccess();
  };

  const handleRemove = async (id: string) => {
    const results = await chrome.storage.local.get([
      ACCESSED_ACKNOWLEDGEMENTS_LOG,
    ]);
    const prevAcks = results[ACCESSED_ACKNOWLEDGEMENTS_LOG] || [];
    const nextAcks = prevAcks.filter((ack: Acknowledgement) => ack.id !== id);

    await chrome.storage.local.set({
      [ACCESSED_ACKNOWLEDGEMENTS_LOG]: nextAcks,
    });

    setAcks(nextAcks);
  };

  const handleChangeSearchKeyword = (event: React.SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement;
    setSearchKeyword(value);

    updateLocalStorage(ACKNOWLEDGEMENTS_SEARCH_KEYWORD, value);
  };

  const handleReset = () => {
    setSearchKeyword('');
    updateLocalStorage(ACKNOWLEDGEMENTS_SEARCH_KEYWORD, '');
  };

  const acknowledgements = acks
    .map(({ id, ...rest }) => {
      const matched = data.acknowledgements.find((ack) => ack.id === id);
      return {
        id,
        ...rest,
        updatedAt: matched?.updatedAt || null,
        isEnabled: !!matched,
      };
    })
    .filter(({ id }) =>
      searchKeyword.trim() ? id.includes(searchKeyword.trim()) : true
    )
    .sort((a, b) => (a.id > b.id ? 1 : -1));

  return (
    <Stack spacing="large">
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          placeholder="Search acknowledgement..."
          value={searchKeyword}
          onChange={handleChangeSearchKeyword}
        />
        <InputRightElement width="4.5rem">
          <Button onClick={handleReset}>Reset</Button>
        </InputRightElement>
      </InputGroup>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        {acknowledgements?.map(({ id, isEnabled, level, updatedAt }) => (
          <GridItem
            borderRadius="md"
            borderColor="gray.200"
            borderStyle="solid"
            borderWidth="1px"
            padding="large"
            key={id}
          >
            <HStack display="flex" width="100%">
              <Switch
                size="lg"
                defaultChecked={isEnabled}
                isDisabled={isProcessingRemoveAck || isProcessingAddAck}
                onChange={(e) => handleToggleAck(id, level, e.target.checked)}
                {...{ id }}
              />
              <FormLabel m={0} htmlFor={id} flex="1">
                <Highlight
                  query={[searchKeyword.trim()]}
                  styles={{ fontWeight: 'bold' }}
                >
                  {id}
                </Highlight>
                {updatedAt ? (
                  <Text fontSize="sm" color="gray.500">
                    {updatedAt}
                  </Text>
                ) : null}
              </FormLabel>
              <Badge
                colorScheme={
                  level === AcknowledgementLevel.USER ? 'green' : 'yellow'
                }
                size="small"
                textTransform="lowercase"
              >
                {level}
              </Badge>
              <Link colorScheme="blue" onClick={() => handleRemove(id)}>
                <FontAwesomeIcon icon={faXmark} />
              </Link>
            </HStack>
          </GridItem>
        ))}
      </Grid>
    </Stack>
  );
};
