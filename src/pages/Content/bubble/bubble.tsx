import {
  HStack,
  Flex,
  Image,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuButton,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faFlag,
  faGear,
  faScrewdriverWrench,
  faWandMagicSparkles,
  faRobot,
  faTerminal,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { faStripeS } from '@fortawesome/free-brands-svg-icons';

import { useCurrentPracticeQuery } from '@generated/ignition/hooks';

import { getEnvByUrl } from '../../Popup/utils';
import { Header } from './header';
import { useConsolePractice } from './use-console-practice';
import { AboutModal } from './about-modal';
import { CopyButton } from './copy-button';
import { AiAssistantAction } from './ai-assistant-action';

const env = getEnvByUrl(window.location.href);
const isDevApiAvailable = env === 'development' || env === 'sandbox';
const iconUrl = chrome.runtime.getURL('icon-128.png');

export const Bubble = ({
  csrfToken,
  onMissionControlClick,
  onPanelClick,
  onAcknowledgementClick,
  onClickCreateNewAccount,
  onClickGraphiql,
}: {
  csrfToken: string;
  onMissionControlClick(url: string, name: string): void;
  onPanelClick(): void;
  onAcknowledgementClick(): void;
  onClickCreateNewAccount(): void;
  onClickGraphiql(url: string, name: string): void;
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { data } = useCurrentPracticeQuery();
  const { id } = data?.currentPractice || {};
  const { data: consolePracticeData } = useConsolePractice({ id, csrfToken });
  const stripeDashboardUri =
    consolePracticeData?.practice.stripeIntegrationAccount?.dashboardUri;

  const hasCurrentPracticeData = !!data;

  const handleClickMissionControl = (e: React.MouseEvent) => {
    const url = `${window.location.origin}/console/practice/${id}`;
    if (e.metaKey) {
      window.open(url);
    } else {
      onMissionControlClick(url, 'Mission control');
    }
  };

  const handleClickGraphiql = (e: React.MouseEvent) => {
    const url = `${window.location.origin}/graphiql`;
    if (e.metaKey) {
      window.open(url);
    } else {
      onClickGraphiql(url, 'GraphiQL');
    }
  };

  return (
    <>
      <Flex
        alignItems="center"
        data-testid="ignition-toolbelt-bubble"
        backgroundColor="gray.200"
        borderRadius="50%"
        boxShadow="0 1px 5px rgba(0, 0, 0, 0.3)"
        display="inline-flex"
        height="50px"
        justifyContent="center"
        opacity="0.5"
        position="fixed"
        left="50px"
        bottom="50px"
        transition="opacity 1s, background-color 1s"
        width="50px"
        zIndex="655350"
        _hover={{
          backgroundColor: 'gray.500',
          opacity: '1',
        }}
      >
        <Menu isLazy lazyBehavior="keepMounted" arrowPadding={16}>
          <MenuButton padding="10px">
            <Image src={iconUrl} width="18px" height="18px" draggable={false} />
          </MenuButton>
          <MenuList>
            {hasCurrentPracticeData ? (
              <>
                <Header csrfToken={csrfToken} />
                <MenuDivider />
              </>
            ) : null}
            <MenuItem
              as="a"
              icon={<FontAwesomeIcon fixedWidth icon={faScrewdriverWrench} />}
              onClick={handleClickMissionControl}
              isDisabled={!hasCurrentPracticeData}
            >
              <Flex justifyContent="space-between">
                <Text>Mission Control</Text>
                <Tooltip
                  label="Copy Mission Control URL"
                  aria-label="Click to copy Mission Control URL"
                  isDisabled={!hasCurrentPracticeData}
                  placement="right"
                  gutter={16}
                  shouldWrapChildren={true}
                >
                  <CopyButton
                    value={`${window.location.origin}/console/practice/${id}`}
                    isDisabled={!hasCurrentPracticeData}
                  />
                </Tooltip>
              </Flex>
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon fixedWidth icon={faFlag} />}
              onClick={onAcknowledgementClick}
              isDisabled={!hasCurrentPracticeData}
            >
              Acknowledgements
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon fixedWidth icon={faTerminal} />}
              onClick={handleClickGraphiql}
              isDisabled={!hasCurrentPracticeData}
            >
              GraphiQL
            </MenuItem>
            <MenuItem
              as="a"
              href={stripeDashboardUri}
              target="_blank"
              // @ts-ignore
              icon={<FontAwesomeIcon fixedWidth icon={faStripeS} />}
              isDisabled={!stripeDashboardUri}
            >
              <Flex justifyContent="space-between">
                <HStack>
                  <Text>Stripe dashboard</Text>
                  <Text as="span" fontSize="xsmall">
                    <FontAwesomeIcon
                      fixedWidth
                      icon={faArrowUpRightFromSquare}
                    />
                  </Text>
                </HStack>
                <Tooltip
                  label="Copy Stripe Dashboard URL"
                  aria-label="Click to Stripe Dashboard URL"
                  isDisabled={!stripeDashboardUri}
                  placement="right"
                  gutter={16}
                  shouldWrapChildren={true}
                >
                  <CopyButton
                    value={stripeDashboardUri}
                    isDisabled={!stripeDashboardUri}
                  />
                </Tooltip>
              </Flex>
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon fixedWidth icon={faWandMagicSparkles} />}
              onClick={onClickCreateNewAccount}
              isDisabled={!isDevApiAvailable}
            >
              Create new account
            </MenuItem>
            <AiAssistantAction
              icon={<FontAwesomeIcon fixedWidth icon={faRobot} />}
              as={MenuItem}
              isDisabled={!hasCurrentPracticeData}
            >
              AI Assistant
            </AiAssistantAction>
            <MenuItem
              icon={<FontAwesomeIcon fixedWidth icon={faGear} />}
              onClick={onPanelClick}
            >
              Settings
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon fixedWidth icon={faCircleInfo} />}
              onClick={onOpen}
            >
              About
            </MenuItem>
            <MenuDivider />
            <MenuItem>
              <Text
                color="faint"
                fontSize="xsmall"
                textAlign="right"
                width="100%"
              >
                Version: {process.env.PACKAGE_VERSION} ({process.env.NODE_ENV})
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <AboutModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
