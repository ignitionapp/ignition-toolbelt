import { useSearchInvoicesLazyQuery } from '@generated/ignition/hooks';
import {
  SearchTextFilterCondition,
  SearchType,
} from '@generated/ignition/types';

export const useApi = () => {
  const [runSearchInvoices] = useSearchInvoicesLazyQuery();

  const searchInvoices = async (keywords: string) => {
    const { data } = await runSearchInvoices({
      variables: {
        textFilters: [
          {
            attribute: 'text',
            condition: SearchTextFilterCondition.CONTAINS,
            values: [keywords],
            relation: SearchType.INVOICE,
          },
        ],
      },
    });

    return data;
  };

  return {
    searchInvoices,
  };
};
