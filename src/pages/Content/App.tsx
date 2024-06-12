import React, { useState } from 'react';

import { AppWrapper } from './app-wrapper';
import { Bubble } from './bubble';
import { useBoolean } from '@chakra-ui/react';
import { Panel } from './panel';
import { AppStatus } from './app-status';
import { MissionControl } from './mission-control';
import { AcknowledgementModal } from './acknowledgement-modal';
import { CreateAccountModal } from './create-account-modal';
import { GraphiqlModal } from './graphiql-modal';

export const App = ({ csrfToken }: { csrfToken: string }) => {
  const [missionControlUrl, setMissionControlUrl] = useState<string>();
  const [missionControlName, setMissionControlName] = useState<string>();
  const [graphiqlUrl, setGraphiqlUrl] = useState<string>();
  const [graphiqlName, setGraphiqlName] = useState<string>();
  const [isAcknowledgementVisible, setAcknowledgementVisibility] = useBoolean();
  const [isPanelVisible, setPanelVisibility] = useBoolean();
  const [isMissionControlVisible, setMissionControlVisibility] = useBoolean();
  const [isGraphiqlVisible, setGraphiqlVisibility] = useBoolean();
  const [isCreateAccountVisible, setCreateAccountVisibility] = useBoolean();

  return (
    <AppWrapper csrfToken={csrfToken}>
      <Bubble
        csrfToken={csrfToken}
        onMissionControlClick={(url, name) => {
          setGraphiqlVisibility.off();
          setPanelVisibility.off();
          setAcknowledgementVisibility.off();

          setMissionControlName(name);
          setMissionControlUrl(url);
          setMissionControlVisibility.on();
        }}
        onClickGraphiql={(url, name) => {
          setMissionControlVisibility.off();
          setPanelVisibility.off();
          setAcknowledgementVisibility.off();

          setGraphiqlName(name);
          setGraphiqlUrl(url);
          setGraphiqlVisibility.on();
        }}
        onPanelClick={() => {
          setGraphiqlVisibility.off();
          setMissionControlVisibility.off();
          setAcknowledgementVisibility.off();

          setPanelVisibility.on();
        }}
        onAcknowledgementClick={() => {
          setGraphiqlVisibility.off();
          setMissionControlVisibility.off();
          setPanelVisibility.off();

          setAcknowledgementVisibility.on();
        }}
        onClickCreateNewAccount={setCreateAccountVisibility.on}
      />
      <MissionControl
        url={missionControlUrl}
        name={missionControlName}
        isOpen={isMissionControlVisible}
        onClose={() => {
          setMissionControlVisibility.off();
        }}
      />
      <GraphiqlModal
        url={graphiqlUrl}
        name={graphiqlName}
        isOpen={isGraphiqlVisible}
        onClose={() => {
          setGraphiqlVisibility.off();
        }}
      />
      <AcknowledgementModal
        isOpen={isAcknowledgementVisible}
        onClose={setAcknowledgementVisibility.off}
      />
      <CreateAccountModal
        isOpen={isCreateAccountVisible}
        onClose={setCreateAccountVisibility.off}
      />
      {isPanelVisible && (
        <Panel isOpen={isPanelVisible} onClose={setPanelVisibility.off} />
      )}
      <AppStatus />
    </AppWrapper>
  );
};
