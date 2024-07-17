import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Button,
  HStack,
  InputGroup,
  InputRightElement,
  Textarea,
  useBoolean,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { AI_ASSISTANT } from '../../lib';
import { askAssistant } from './utils';
import { HtmlContent } from './html-content';
import { useApi } from './use-api';
import { HistoryItem } from './types';

type FormValues = {
  userMessage: string;
};

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

  const { handleSubmit, register, reset } = useForm<FormValues>({
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
      { sender: 'assistant', name: 'Sparky', message: '' },
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

  const handleSave = async ({ userMessage }: FormValues) => {
    if (isProcessing || userMessage.trim() === '') return;

    const history: HistoryItem = { sender: 'user', message: userMessage };
    setConversationHistory((prevHistory) => [...prevHistory, history]);
    const conversationEl = conversationRef.current;
    if (conversationEl) {
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }

    try {
      const result = await chrome.storage.local.get([AI_ASSISTANT]);
      const { token } = result[AI_ASSISTANT] || {};
      setProcessing.on();
      await askAssistant({
        messageContent: userMessage,
        messageRole: 'user',
        token,
        history: conversationHistory,
        onInit: handleInitConversation,
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
      setProcessing.off();
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      const errorMessage: HistoryItem = {
        sender: 'assistant',
        name: 'Sparky',
        message: 'Error fetching response from API.',
      };
      setConversationHistory((prevHistory) => [...prevHistory, errorMessage]);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      handleSubmit(handleSave)();
    }
  };

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
                          <ReactMarkdown>{history.message}</ReactMarkdown>
                        </HtmlContent>
                      </Box>
                    </HStack>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box>
              <InputGroup>
                <Textarea
                  isDisabled={isProcessing}
                  pr="5rem"
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
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
