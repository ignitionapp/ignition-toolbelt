import {
  Card,
  CardHeader,
  CardBody,
  Grid,
  GridItem,
  HStack,
  Switch,
  Text,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { allFeatureFlags } from '../lib';
import type { FeatureFlag } from '../lib';
import { FEATURE_LIST } from './vars';

type Mapping = [featureFlag: FeatureFlag, isEnable: boolean];

export const FeaturesSetting = () => {
  const [featureStates, setFeatureStates] = useState<Mapping[]>([]);

  useEffect(() => {
    chrome.storage.local.get(allFeatureFlags, (result) => {
      const mappings = allFeatureFlags.map((feature) => [
        feature,
        result[feature] || false,
      ]);
      setFeatureStates(mappings as Mapping[]);
    });
  }, []);

  const handleToggleFeature =
    (feature: FeatureFlag) => async (e: ChangeEvent) => {
      const isChecked = (e.target as HTMLInputElement).checked;

      if (feature === 'feature::jira-mission-control-login' && isChecked) {
        const isOkay = window.confirm(
          "For accessing the cross domain data, when you view the Jira HELP ticket with a Mission Control link, your credential (Session ID and CSRF token) will be sent to a proxy API service that Joseph made. I don't store your data but it does a bit hacky. Are you sure you want to enable this?"
        );
        if (!isOkay) {
          e.preventDefault();
          return;
        }
      }

      setFeatureStates((prevState) => {
        const nextState = prevState.map(([f, value]) =>
          f === feature ? [f, isChecked] : [f, value]
        ) as Mapping[];
        chrome.runtime.sendMessage({
          type: feature,
          value: isChecked,
        });
        chrome.storage.local.set({ [feature]: isChecked });
        return nextState;
      });
    };

  const featureItems = FEATURE_LIST.map((item) => {
    const featureState = featureStates.find(
      ([featureFlag]) => featureFlag === item.id
    );
    const [, isEnabled] = featureState ?? [];

    return {
      ...item,
      isEnabled,
    };
  });

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      {featureItems.map(({ id, title, description, isEnabled }) => (
        <GridItem key={id}>
          <Card>
            <CardHeader bgColor="gray.100">
              <HStack display="flex">
                <Text fontWeight="bold" flex="1">
                  {title}
                </Text>
                <Switch
                  alignSelf="flex-end"
                  size="lg"
                  isChecked={isEnabled}
                  id={`toggle-${id}`}
                  onChange={handleToggleFeature(id)}
                />
              </HStack>
            </CardHeader>
            <CardBody>{description}</CardBody>
          </Card>
        </GridItem>
      ))}
    </Grid>
  );
};
