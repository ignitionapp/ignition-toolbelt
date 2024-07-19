import {
  useSearchInvoicesLazyQuery,
  useSearchLazyQuery,
} from '@generated/ignition/hooks';
import {
  SearchDateFilterCondition,
  SearchInvoicePaymentProgressStatusType,
  SearchInvoicePaymentStatusType,
  SearchNumberFilterCondition,
  SearchSortDirection,
  SearchTextFilterCondition,
  SearchType,
} from '@generated/ignition/types';

export const useApi = () => {
  const [runSearch] = useSearchLazyQuery();
  const [runSearchInvoices] = useSearchInvoicesLazyQuery();

  const createSearchFunction =
    (searchType: SearchType) =>
    async ({ searchQuery }: { searchQuery: string }) => {
      try {
        const { data } = await runSearch({
          variables: {
            searchType,
            textFilters: [
              ...(searchQuery
                ? [
                    {
                      attribute: 'text',
                      condition: SearchTextFilterCondition.CONTAINS,
                      values: [searchQuery],
                      relation: searchType,
                    },
                  ]
                : []),
            ],
          },
        });

        // @ts-ignore
        const { pagedQuery } = data?.search || {};
        const { totalCount = 0, totalValue = 0 } = pagedQuery || {};
        const results =
          // @ts-ignored
          pagedQuery?.results?.edges?.map(({ node }) => node) || [];

        return {
          results,
          totalCount,
          totalValue,
        };
      } catch (e) {}
    };

  const searchAppClients = createSearchFunction(SearchType.APP_CLIENT);
  const searchBillingItems = createSearchFunction(SearchType.BILLING_ITEM);
  const searchClients = createSearchFunction(SearchType.CLIENT);
  const searchProposals = createSearchFunction(SearchType.PROPOSAL);

  type SearchInvoicesArgs = {
    amountWithTax?: number;
    amountWithTaxCondition?: SearchNumberFilterCondition;
    clientName?: string;
    collectionOn?: string;
    collectionOnCondition?: SearchDateFilterCondition;
    billedOn?: string;
    billedOnCondition?: SearchDateFilterCondition;
    paymentProgressStatues?: SearchInvoicePaymentProgressStatusType[];
    paymentStatus?: SearchInvoicePaymentStatusType;
    payoutOn?: string;
    payoutOnCondition?: SearchDateFilterCondition;
    searchQuery?: string;
    sortAttribute?: string;
    sortDirection?: SearchSortDirection;
    sortRelation?: SearchType;
    pageNumber?: number;
    pageSize?: number;
  };

  const searchInvoices = async ({
    amountWithTax,
    amountWithTaxCondition = SearchNumberFilterCondition.EQUALS,
    clientName,
    collectionOn,
    collectionOnCondition = SearchDateFilterCondition.EQUALS,
    billedOn,
    billedOnCondition = SearchDateFilterCondition.EQUALS,
    paymentProgressStatues,
    paymentStatus,
    payoutOn,
    payoutOnCondition = SearchDateFilterCondition.EQUALS,
    searchQuery,
    sortAttribute = 'billed_on',
    sortDirection = SearchSortDirection.DESC,
    sortRelation = SearchType.INVOICE,
    pageNumber = 1,
    pageSize = 10,
  }: SearchInvoicesArgs = {}) => {
    try {
      const { data } = await runSearchInvoices({
        context: {
          addTypename: false,
        },
        variables: {
          sort: {
            attribute: sortAttribute,
            direction: sortDirection,
            relation: sortRelation,
          },
          pagination: {
            pageNumber,
            pageSize,
          },
          textFilters: [
            ...(searchQuery
              ? [
                  {
                    attribute: 'text',
                    condition: SearchTextFilterCondition.CONTAINS,
                    values: [searchQuery],
                    relation: SearchType.INVOICE,
                  },
                ]
              : []),
            ...(paymentStatus
              ? [
                  {
                    attribute: 'payment_status',
                    condition: SearchTextFilterCondition.EQUALS,
                    values: [paymentStatus],
                    relation: SearchType.INVOICE,
                  },
                ]
              : []),
            ...(paymentProgressStatues && paymentProgressStatues.length
              ? [
                  {
                    attribute: 'payment_progress_status',
                    condition: SearchTextFilterCondition.ANY_OF,
                    values: paymentProgressStatues,
                    relation: SearchType.INVOICE,
                  },
                ]
              : []),
            ...(clientName
              ? [
                  {
                    attribute: 'name',
                    condition: SearchTextFilterCondition.CONTAINS,
                    values: [clientName],
                    relation: SearchType.CLIENT,
                  },
                ]
              : []),
          ],
          dateFilters: [
            ...(billedOn
              ? [
                  {
                    attribute: 'billed_on',
                    condition: billedOnCondition,
                    values: [billedOn],
                    relation: SearchType.INVOICE,
                  },
                ]
              : []),
            ...(collectionOn
              ? [
                  {
                    attribute: 'created_on',
                    condition: collectionOnCondition,
                    values: [collectionOn],
                    relation: SearchType.INVOICE,
                  },
                ]
              : []),
            ...(payoutOn
              ? [
                  {
                    attribute: 'payout_on',
                    condition: payoutOnCondition,
                    values: [payoutOn],
                    relation: SearchType.INVOICE,
                  },
                ]
              : []),
          ],
          numberFilters: [
            ...(amountWithTax
              ? [
                  {
                    attribute: 'amount_with_tax_cents',
                    condition: amountWithTaxCondition,
                    values: [amountWithTax * 100],
                    relation: SearchType.INVOICE,
                  },
                ]
              : []),
          ],
        },
      });

      const { pagedQuery } = data?.search || {};
      const { totalCount = 0, totalValue = 0 } = pagedQuery || {};
      const results = pagedQuery?.results?.edges?.map(({ node }) => node) || [];

      return {
        results,
        totalCount,
        totalValue,
      };
    } catch (e) {}
  };

  return {
    searchAppClients,
    searchBillingItems,
    searchClients,
    searchInvoices,
    searchProposals,
  };
};
