import React from 'react';
import { Tag, Wrap, WrapItem } from '@chakra-ui/react';
import { useUpcomingBusinessDaysSuspenseQuery } from '@generated/ignition/hooks';

type Props = {
  onSelect(question: string): void;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

type ItemProps = {
  children: string;
  message?: string;
  onSelect(message: string): void;
};

const Item = ({ onSelect, children, message }: ItemProps) => (
  <WrapItem>
    <Tag
      borderRadius="full"
      cursor="pointer"
      onClick={() => onSelect(message || children)}
      size="lg"
      whiteSpace="nowrap"
    >
      {children}
    </Tag>
  </WrapItem>
);

export const SuggestedQuestions = ({ onSelect }: Props) => {
  const today = new Date();

  const {
    data: { upcomingBusinessDays },
  } = useUpcomingBusinessDaysSuspenseQuery({
    variables: { startDate: formatDate(today) },
  });

  const [firstBusinessDay, secondBusinessDay, thirdBusinessDay] =
    upcomingBusinessDays;

  if (!firstBusinessDay || !secondBusinessDay || !thirdBusinessDay) {
    return null;
  }

  const dayBeforeFirstBusinessDay = new Date(firstBusinessDay);
  dayBeforeFirstBusinessDay.setDate(dayBeforeFirstBusinessDay.getDate() - 1);
  const dayBeforeFirstBusinessDayStr = formatDate(dayBeforeFirstBusinessDay);

  const dayAfterFirstBusinessDay = new Date(firstBusinessDay);
  dayAfterFirstBusinessDay.setDate(dayAfterFirstBusinessDay.getDate() + 1);
  const dayAfterFirstBusinessDayStr = formatDate(dayAfterFirstBusinessDay);

  const handleClick = (question: string) => {
    onSelect(question);
  };

  return (
    <Wrap justify="center">
      <Item
        onSelect={handleClick}
        message={`Invoices which payment progress status are paid and their paid out date are after ${dayBeforeFirstBusinessDayStr}`}
      >
        Paid out today
      </Item>
      <Item
        onSelect={handleClick}
        message={`List invoices which payment progress status are collecting or collected and their pay out date are before ${dayAfterFirstBusinessDayStr}`}
      >
        Next payout
      </Item>
      <Item
        onSelect={handleClick}
        message={`List invoices which payment progress status are collecting or collected and their pay out date are ${secondBusinessDay}`}
      >
        Paying soon
      </Item>
      <Item
        onSelect={handleClick}
        message={`List invoices which payment progress status are collecting or collected and their pay out date are after ${thirdBusinessDay}`}
      >
        Processing
      </Item>
    </Wrap>
  );
};
