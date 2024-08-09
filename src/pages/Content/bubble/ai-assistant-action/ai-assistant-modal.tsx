import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Button,
  Center,
  HStack,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Spinner,
  Text,
  Textarea,
  useBoolean,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import remarkGfm from 'remark-gfm';

import { AI_ASSISTANT } from '../../lib';
import {
  askLocalAssistant,
  askRemoteAssistant,
  ProgressType,
  useApi,
} from './lib';
import type { HistoryItem } from './lib';
import { HtmlContent } from './html-content';
import { SuggestedQuestions } from './suggested-questions';
import { getEnvByUrl } from '../../../Popup/utils';
import { ProgressBar } from './lib/elements/progress-bar';

type FormValues = {
  userMessage: string;
};

const isProduction = getEnvByUrl(window.location.href) === 'production';

export const AiAssistantModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) => {
  const [isProcessing, setProcessing] = useBoolean();
  const {
    searchAppClients,
    searchBillingItems,
    searchClients,
    searchInvoices,
    searchProposals,
  } = useApi();
  const conversationRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [progressType, setProgressType] = useState<ProgressType>(
    ProgressType.IDLE
  );
  const [totalDownloadedMegaBytes, setTotalDownloadedMegaBytes] = useState(0);

  const { setValue, handleSubmit, register, reset } = useForm<FormValues>({
    defaultValues: {
      userMessage: 'Hey Sparky!',
    },
  });

  const [conversationHistory, setConversationHistory] = useState<HistoryItem[]>(
    []
  );

  useEffect(() => {
    chrome.storage.local.get([AI_ASSISTANT]).then((results) => {
      const { userMessage } = results[AI_ASSISTANT] || {
        userMessage: 'Hey Sparky!',
      };
      reset({ userMessage });
    });
  }, [reset]);

  const handleInitConversation = () => {
    setConversationHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'assistant', message: '' },
    ]);
  };

  const handleCallFunction = async (functionName: string, parameters: any) => {
    switch (functionName) {
      case 'searchAppClients':
        return searchAppClients({ ...parameters });
      case 'searchBillingItems':
        return searchBillingItems({ ...parameters });
      case 'searchClients':
        return searchClients({ ...parameters });
      case 'searchProposals':
        return searchProposals({ ...parameters });
      case 'searchInvoices':
        return searchInvoices({ ...parameters });
    }
  };

  const handleUpdateConversation = (message: string) => {
    setConversationHistory((prevHistory) => {
      const updatedHistory = [...prevHistory];
      updatedHistory[updatedHistory.length - 1] = {
        sender: 'assistant',
        message,
      };
      return updatedHistory;
    });

    const conversationEl = conversationRef.current;
    if (conversationEl) {
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }
  };

  const handleSelectQuestion = (question: string) => {
    setValue('userMessage', question);
    handleSubmit(handleSave)();
  };

  const handleLoading = (progress: number) => {
    setProgressType(ProgressType.LOADING);
    setProgress(progress);
    if (progress === 100) {
      setProgressType(ProgressType.IDLE);
      setProgress(0);
    }
  };

  const handleDownloading = (progress: number, totalMegaBytes: number) => {
    setProgressType(ProgressType.DOWNLOADING);
    setProgress(progress);
    setTotalDownloadedMegaBytes(totalMegaBytes);
    if (progress === 100) {
      setProgressType(ProgressType.IDLE);
      setProgress(0);
    }
  };

  const handleDownloadPreparing = () => {
    setProgressType(ProgressType.DOWNLOAD_PREPARING);
  };

  const handleSave = async ({ userMessage }: FormValues) => {
    if (isProcessing || userMessage.trim() === '') return;

    setConversationHistory((prevHistories) => [
      ...prevHistories,
      {
        sender: 'user',
        message: userMessage,
      },
    ]);

    const conversationEl = conversationRef.current;
    if (conversationEl) {
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }

    try {
      const result = await chrome.storage.local.get([AI_ASSISTANT]);
      const { token } = result[AI_ASSISTANT] || {};
      const askAssistant = isProduction
        ? askLocalAssistant
        : askRemoteAssistant;

      setProcessing.on();
      await askAssistant({
        messageContent: userMessage,
        messageRole: 'user',
        history: conversationHistory,
        token,
        onInit: handleInitConversation,
        onDownloading: handleDownloading,
        onDownloadPreparing: handleDownloadPreparing,
        onLoading: handleLoading,
        onUpdate: handleUpdateConversation,
        onCallFunction: handleCallFunction,
      });

      chrome.storage.local.set({
        [AI_ASSISTANT]: {
          userMessage,
          token,
        },
      });
      reset({ userMessage: '' });
    } catch (error: unknown) {
      setConversationHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        updatedHistory[updatedHistory.length - 1] = {
          sender: 'assistant',
          message:
            error instanceof Error
              ? error.message
              : 'Oops, something goes wrong. Please reload the page to try again',
        };
        return updatedHistory;
      });
    } finally {
      setProcessing.off();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      handleSubmit(handleSave)();
    }
  };

  const handleReset = () => {
    setConversationHistory([]);
    reset();
  };

  const isLoading = progressType !== ProgressType.IDLE;

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent maxWidth="95%" width="800px" height="90%">
        <ModalHeader>
          <Text>AI assistant</Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody pb="large">
          <form
            style={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
            }}
            onSubmit={handleSubmit(handleSave)}
          >
            <Stack display="flex" spacing="large" height="100%">
              <Box width="100%" flexShrink="1" flexGrow="1" height="0">
                <Box overflowY="scroll" ref={conversationRef} height="100%">
                  {conversationHistory.map((history, index) => (
                    <Box key={index} mb={4}>
                      <HStack
                        alignItems="flex-start"
                        justifyContent={
                          history.sender === 'user' ? 'flex-end' : 'flex-start'
                        }
                      >
                        <Box fontWeight="bold" py="medium">
                          {history.sender === 'user' ? 'You' : 'Sparky'}:
                        </Box>
                        <Box
                          backgroundColor={
                            history.sender === 'user' ? 'blue.50' : 'gray.50'
                          }
                          borderRadius="md"
                          p="medium"
                          minWidth="300px"
                          maxWidth="70%"
                        >
                          <HtmlContent sx={{ p: { _last: { mb: 0 } } }}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {history.message}
                            </ReactMarkdown>
                          </HtmlContent>
                          {index === conversationHistory.length - 1 &&
                          history.message === '' &&
                          isProcessing &&
                          !isLoading ? (
                            <HStack>
                              <Spinner color="red.500" />
                              <Text>Assistant is thinking...</Text>
                            </HStack>
                          ) : null}
                        </Box>
                      </HStack>
                    </Box>
                  ))}

                  {isLoading && (
                    <ProgressBar
                      progress={progress}
                      progressType={progressType}
                      totalDownloadedMegaBytes={totalDownloadedMegaBytes}
                    />
                  )}
                </Box>
              </Box>
              {!conversationHistory.length ? (
                <SuggestedQuestions onSelect={handleSelectQuestion} />
              ) : (
                <Center>
                  <Button onClick={handleReset}>
                    Clean up the conversation
                  </Button>
                </Center>
              )}
              <Box>
                <InputGroup>
                  <Textarea
                    isDisabled={isProcessing}
                    pr="6.5rem"
                    height="4.5rem"
                    minHeight="4.5rem"
                    placeholder="Your message..."
                    resize="none"
                    {...register('userMessage')}
                    onKeyDown={handleKeyDown}
                  ></Textarea>
                  <InputRightElement width="5rem" mt="medium" mr="medium">
                    <Button
                      colorScheme="brand"
                      size="lg"
                      type="submit"
                      height="3rem"
                      isDisabled={isProcessing}
                    >
                      Send
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
