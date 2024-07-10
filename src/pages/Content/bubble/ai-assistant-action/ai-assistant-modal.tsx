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
  VStack,
  Box,
  Input,
  Button,
  HStack,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { AI_ASSISTANT } from '../../lib';
import { askAssistant } from './utils';
import { HtmlContent } from './html-content';
import { useApi } from './use-api';

type FormValues = {
  userMessage: string;
  token: string;
};

export const AiAssistantModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) => {
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
      token: '',
    },
  });

  const [conversationHistory, setConversationHistory] = useState<
    { sender: string; message: string }[]
  >([]);

  useEffect(() => {
    chrome.storage.local.get([AI_ASSISTANT]).then((results) => {
      const { userMessage, token } = results[AI_ASSISTANT] || {
        userMessage: 'Hey Sparky!',
        token: '',
      };
      reset({ userMessage, token });
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

  const handleSave = async ({ token, userMessage }: FormValues) => {
    if (userMessage.trim() === '') return;

    const newMessage = { sender: 'user', message: userMessage };
    setConversationHistory((prevHistory) => [...prevHistory, newMessage]);
    const conversationEl = conversationRef.current;
    if (conversationEl) {
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }

    try {
      await askAssistant({
        messageContent: userMessage,
        messageRole: 'user',
        token,
        history: conversationHistory,
        onInit: handleInitConversation,
        onUpdate: handleUpdateConversation,
        onCallFunction: handleCallFunction,
      });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      const errorMessage = {
        sender: 'assistant',
        message: 'Error fetching response from API.',
      };
      setConversationHistory((prevHistory) => [...prevHistory, errorMessage]);
    }

    chrome.storage.local.set({
      [AI_ASSISTANT]: {
        userMessage,
        token,
      },
    });
    reset({ userMessage: '' });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      handleSubmit(handleSave)();
    }
  };

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      onClose={onClose}
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent maxWidth="95%" width="800px">
        <ModalHeader>
          <Text>AI Assistant: Sparky</Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(handleSave)}>
            <VStack spacing="large" padding="large">
              <Box
                height="500px"
                overflowY="scroll"
                ref={conversationRef}
                width="100%"
                p={4}
                border="1px solid lightgray"
              >
                {conversationHistory.map((entry, index) => (
                  <Box key={index} mb={4}>
                    <HStack
                      alignItems="flex-start"
                      justifyContent={
                        entry.sender === 'user' ? 'flex-end' : 'flex-start'
                      }
                    >
                      <strong>
                        {entry.sender === 'user' ? 'You' : 'Sparky'}:
                      </strong>
                      <HtmlContent>
                        <ReactMarkdown>{entry.message}</ReactMarkdown>
                      </HtmlContent>
                    </HStack>
                  </Box>
                ))}
              </Box>
              <InputGroup>
                <Input
                  pr="4.5rem"
                  placeholder="Your message..."
                  {...register('userMessage')}
                  onKeyDown={handleKeyDown}
                ></Input>
                <InputRightElement width="4.5rem">
                  <Button
                    colorScheme="brand"
                    size="sm"
                    type="submit"
                    height="1.75rem"
                  >
                    Send
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Input
                type="password"
                placeholder="Open AI Token"
                {...register('token')}
              />
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
