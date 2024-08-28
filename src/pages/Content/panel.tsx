import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useBoolean,
} from '@chakra-ui/react';
import { Faker, en_AU, en, base } from '@faker-js/faker';
import { FeaturesSetting } from './features-setting';
import { GithubAutofillSetting } from './github-autofill-setting';
import { AiAssistantSetting } from './ai-assistant-setting';
import { AI_ASSISTANT, AUTOFILL_PAGES, GITHUB_AUTOFILL } from './lib';

const faker = new Faker({ locale: [en_AU, en, base] });

export const Panel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) => {
  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();
  const [isGithubAutofillEnabled, setGithubAutofillEnablility] = useBoolean();
  const [isAutofillPagesEnabled, setAutofillPagesEnablility] = useBoolean();
  const [isAiAssistantEnabled, setAiAssistantEnablility] = useBoolean();

  useEffect(() => {
    chrome.storage.local
      .get(['fakerSeedValue', GITHUB_AUTOFILL, AUTOFILL_PAGES, AI_ASSISTANT])
      .then((results) => {
        const { fakerSeedValue } = results;
        faker.seed(fakerSeedValue);
        const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
        const email = faker.internet.email();
        setName(name);
        setEmail(email);
        if (results[AI_ASSISTANT]) {
          setAiAssistantEnablility.on();
        }
        if (results[AUTOFILL_PAGES]) {
          setAutofillPagesEnablility.on();
        }
        if (results[GITHUB_AUTOFILL]) {
          setGithubAutofillEnablility.on();
        }
      });

    chrome.storage.onChanged.addListener((changes) => {
      const autofillPagesChange = changes[AUTOFILL_PAGES]?.newValue;
      if (autofillPagesChange === true) {
        setAutofillPagesEnablility.on();
      } else if (autofillPagesChange === false) {
        setAutofillPagesEnablility.off();
      }

      const githubAutofillChange = changes[GITHUB_AUTOFILL]?.newValue;
      if (githubAutofillChange === true) {
        setGithubAutofillEnablility.on();
      } else if (githubAutofillChange === false) {
        setGithubAutofillEnablility.off();
      }

      const aiAssistantChange = changes[AI_ASSISTANT]?.newValue;
      if (aiAssistantChange === true) {
        setAiAssistantEnablility.on();
      } else if (aiAssistantChange === false) {
        setAiAssistantEnablility.off();
      }
    });
  }, [
    setAiAssistantEnablility,
    setAutofillPagesEnablility,
    setGithubAutofillEnablility,
  ]);

  const handleResetFaker = async () => {
    const fakerSeedValue = new Date().getTime();
    await chrome.storage.local.set({ fakerSeedValue });
    faker.seed(fakerSeedValue);
    const name = faker.person.fullName();
    const email = faker.internet.email();
    setName(name);
    setEmail(email);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Features</Tab>
              {isAiAssistantEnabled ? <Tab>AI assistant</Tab> : null}
              {isAutofillPagesEnabled ? (
                <Tab>Autofill onboarding pages</Tab>
              ) : null}
              {isGithubAutofillEnabled ? (
                <Tab>Autofill Github pull request</Tab>
              ) : null}
            </TabList>

            <TabPanels>
              <TabPanel>
                <FeaturesSetting />
              </TabPanel>
              {isAiAssistantEnabled ? (
                <TabPanel>
                  <AiAssistantSetting />
                </TabPanel>
              ) : null}
              {isAutofillPagesEnabled ? (
                <TabPanel>
                  <VStack spacing="large">
                    <FormControl>
                      <FormLabel>Current email</FormLabel>
                      <Input isDisabled value={email} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Current name</FormLabel>
                      <Input isDisabled value={name} />
                    </FormControl>
                    <Button colorScheme="brand" onClick={handleResetFaker}>
                      Reset
                    </Button>
                  </VStack>
                </TabPanel>
              ) : null}
              {isGithubAutofillEnabled ? (
                <TabPanel>
                  <GithubAutofillSetting />
                </TabPanel>
              ) : null}
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
