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

  const handleClick = (question: string) => () => {
    onSelect(question);
  };

  return (
    <Wrap justify="center">
      <WrapItem>
        <Tag
          borderRadius="full"
          cursor="pointer"
          onClick={handleClick(
            `List invoices which payment status are paid and their paid out date are after ${dayBeforeFirstBusinessDayStr}`
          )}
          size="lg"
          whiteSpace="nowrap"
        >
          Invoices paid out since previous business day
        </Tag>
      </WrapItem>
      <WrapItem>
        <Tag
          borderRadius="full"
          cursor="pointer"
          onClick={handleClick(
            `List invoices which payment status are collecting or collected and their pay out date are before ${dayAfterFirstBusinessDayStr}`
          )}
          size="lg"
          whiteSpace="nowrap"
        >
          Next payout
        </Tag>
      </WrapItem>
      <WrapItem>
        <Tag
          borderRadius="full"
          cursor="pointer"
          onClick={handleClick(
            `List invoices which payment status are collecting or collected and their pay out date are ${secondBusinessDay}`
          )}
          size="lg"
          whiteSpace="nowrap"
        >
          Paying soon
        </Tag>
      </WrapItem>
      <WrapItem>
        <Tag
          borderRadius="full"
          cursor="pointer"
          onClick={handleClick(
            `List invoices which payment status are collecting or collected and their pay out date are after ${thirdBusinessDay}`
          )}
          size="lg"
          whiteSpace="nowrap"
        >
          Processing
        </Tag>
      </WrapItem>
    </Wrap>
  );
};
