import {
  useSearchAppClientsLazyQuery,
  useSearchBillingItemsLazyQuery,
  useSearchClientsLazyQuery,
  useSearchInvoicesLazyQuery,
  useSearchProposalsLazyQuery,
} from '@generated/ignition/hooks';

import {
  ClientState,
  PaymentMethodType,
  SearchBooleanFilterCondition,
  SearchDateFilterCondition,
  SearchInvoicePaymentProgressStatusType,
  SearchInvoicePaymentStatusType,
  SearchNumberFilterCondition,
  SearchSortDirection,
  SearchTextFilterCondition,
  SearchType,
} from '@generated/ignition/types';

export const useApi = () => {
  const [runSearchAppClients] = useSearchAppClientsLazyQuery();
  const [runSearchBillingItems] = useSearchBillingItemsLazyQuery();
  const [runSearchClients] = useSearchClientsLazyQuery();
  const [runSearchInvoices] = useSearchInvoicesLazyQuery();
  const [runSearchProposals] = useSearchProposalsLazyQuery();

  //====================
  // Search App Clients
  //====================
  type SearchAppClientsArgs = {
    appName?: string;
    searchQuery?: string;
    isNotLinked?: boolean;
    sortAttribute?: string;
    sortDirection?: SearchSortDirection;
    pageNumber?: number;
    pageSize?: number;
  };

  const searchAppClients = async ({
    appName,
    searchQuery,
    isNotLinked,
    sortAttribute = 'name',
    sortDirection = SearchSortDirection.ASC,
    pageNumber = 1,
    pageSize = 50,
  }: SearchAppClientsArgs = {}) => {
    try {
      const { data } = await runSearchAppClients({
        variables: {
          sort: {
            attribute: sortAttribute,
            direction: sortDirection,
            relation: SearchType.APP_CLIENT,
          },
          pagination: {
            pageNumber,
            pageSize,
          },
          booleanFilters: [

          ],
          textFilters: [
            ...(searchQuery
              ? [
                {
                  attribute: 'text',
                  condition: SearchTextFilterCondition.CONTAINS,
                  values: [searchQuery],
                  relation: SearchType.APP_CLIENT,
                },
              ]
              : []),
            ...(appName
              ? [
                {
                  attribute: 'app_name',
                  condition: SearchTextFilterCondition.ANY_OF,
                  values: [appName],
                  relation: SearchType.APP_CLIENT,
                },
              ] : []
            ),
            ...(typeof isNotLinked === 'boolean'
              ? [
                {
                  attribute: 'ignitionapp_client_slug',
                  condition: SearchTextFilterCondition.HAS_NO_VALUE,
                  values: [],
                  relation: SearchType.APP_CLIENT,
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
    } catch (e) { }
  };

  //======================
  // Search Billing Items
  //======================
  type SearchBillingItemsArgs = {
    searchQuery?: string;
    clientName?: string;
    createdOn?: string;
    createdOnCondition?: SearchDateFilterCondition;
    status?: string;
    sortAttribute?: string;
    sortDirection?: SearchSortDirection;
    pageNumber?: number;
    pageSize?: number;
  };

  const searchBillingItems = async ({
    searchQuery,
    clientName,
    createdOn,
    createdOnCondition = SearchDateFilterCondition.EQUALS,
    status,
    sortAttribute = 'created_on',
    sortDirection = SearchSortDirection.DESC,
    pageNumber = 1,
    pageSize = 50,
  }: SearchBillingItemsArgs = {}) => {
    try {
      const { data } = await runSearchBillingItems({
        variables: {
          sort: {
            attribute: sortAttribute,
            direction: sortDirection,
            relation: SearchType.BILLING_ITEM,
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
                  relation: SearchType.BILLING_ITEM,
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
            ...(status
              ? [
                {
                  attribute: 'status',
                  condition: SearchTextFilterCondition.EQUALS,
                  values: [status],
                  relation: SearchType.BILLING_ITEM,
                },
              ]
              : []),
          ],
          dateFilters: [
            ...(createdOn
              ? [
                {
                  attribute: 'created_on',
                  condition: createdOnCondition,
                  values: [createdOn],
                  relation: SearchType.BILLING_ITEM,
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
    } catch (e) { }
  };

  //=================
  // Search Clients
  //=================
  type SearchClientsArgs = {
    billingDueDate?: string;
    billingDueDateCondition?: SearchDateFilterCondition;
    searchQuery?: string;
    sortAttribute?: string;
    sortDirection?: SearchSortDirection;
    isSurchargeEnabled?: boolean;
    paymentMethodRequested?: boolean;
    pageNumber?: number;
    pageSize?: number;
    paymentMethodTypes?: PaymentMethodType
    state?: ClientState
  };

  const searchClients = async ({
    searchQuery,
    billingDueDate,
    billingDueDateCondition = SearchDateFilterCondition.EQUALS,
    sortAttribute = 'name',
    sortDirection = SearchSortDirection.ASC,
    isSurchargeEnabled,
    paymentMethodTypes,
    paymentMethodRequested,
    pageNumber = 1,
    pageSize = 50,
    state,
  }: SearchClientsArgs = {}) => {
    try {
      const { data } = await runSearchClients({
        variables: {
          sort: {
            attribute: sortAttribute,
            direction: sortDirection,
            relation: SearchType.CLIENT,
          },
          pagination: {
            pageNumber,
            pageSize,
          },
          dateFilters: [
            ...(billingDueDate
              ? [
                {
                  attribute: 'billing_due_date',
                  condition: billingDueDateCondition,
                  values: [billingDueDate],
                  relation: SearchType.CLIENT,
                },
              ]
              : []),
          ],
          booleanFilters: [
            ...(typeof isSurchargeEnabled === 'boolean'
              ? [
                {
                  attribute: 'is_surcharge_enabled',
                  condition: SearchBooleanFilterCondition.EQUALS,
                  values: [isSurchargeEnabled],
                  relation: SearchType.CLIENT,
                },
              ] : []),
            ...(typeof paymentMethodRequested === 'boolean'
              ? [
                {
                  attribute: 'payment_method_requested',
                  condition: SearchBooleanFilterCondition.EQUALS,
                  values: [paymentMethodRequested],
                  relation: SearchType.CLIENT,
                },
              ] : []
            )
          ],
          textFilters: [
            ...(searchQuery
              ? [
                {
                  attribute: 'text',
                  condition: SearchTextFilterCondition.CONTAINS,
                  values: [searchQuery],
                  relation: SearchType.CLIENT,
                },
              ]
              : []),
            ...(paymentMethodTypes
              ? [
                {
                  attribute: 'payment_method_types',
                  condition: SearchTextFilterCondition.INCLUDES,
                  values: [paymentMethodTypes],
                  relation: SearchType.CLIENT,
                },
              ] : []),
            ...(state
              ? [
                {
                  attribute: 'state',
                  condition: SearchTextFilterCondition.EQUALS,
                  values: [state],
                  relation: SearchType.CLIENT,
                },
              ] : []),
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
    } catch (e) { }
  };

  //=================
  // Search Invoices
  //=================
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
    pageSize = 50,
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
    } catch (e) { }
  };

  //=================
  // Search Proposals
  //=================
  type SearchProposalsArgs = {
    clientName?: string;
    createdOn?: string;
    createdOnCondition?: SearchDateFilterCondition;
    updatedOn?: string;
    updatedOnCondition?: SearchDateFilterCondition;
    status?: string;
    searchQuery?: string;
    sortAttribute?: string;
    sortDirection?: SearchSortDirection;
    sortRelation?: SearchType;
    paymentType?: string;
    pageNumber?: number;
    pageSize?: number;
  };

  const searchProposals = async ({
    clientName,
    createdOn,
    createdOnCondition = SearchDateFilterCondition.EQUALS,
    updatedOn,
    updatedOnCondition = SearchDateFilterCondition.EQUALS,
    status,
    searchQuery,
    sortAttribute = 'created_on',
    sortDirection = SearchSortDirection.DESC,
    sortRelation = SearchType.PROPOSAL,
    pageNumber = 1,
    pageSize = 50,
    paymentType,
  }: SearchProposalsArgs = {}) => {
    try {
      const { data } = await runSearchProposals({
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
                  relation: SearchType.PROPOSAL,
                },
              ]
              : []),
            ...(status
              ? [
                {
                  attribute: 'status',
                  condition: SearchTextFilterCondition.EQUALS,
                  values: [status],
                  relation: SearchType.PROPOSAL,
                },
              ]
              : []),
            ...(clientName
              ? [
                {
                  attribute: 'name',
                  condition: SearchTextFilterCondition.EQUALS,
                  values: [clientName],
                  relation: SearchType.CLIENT,
                },
              ]
              : []),
            ...(paymentType
              ? [
                {
                  attribute: 'payment_type',
                  condition: SearchTextFilterCondition.EQUALS,
                  values: [paymentType],
                  relation: SearchType.PROPOSAL,
                },
              ]
              : []),
          ],
          dateFilters: [
            ...(createdOn
              ? [
                {
                  attribute: 'created_on',
                  condition: createdOnCondition,
                  values: [createdOn],
                  relation: SearchType.PROPOSAL,
                },
              ]
              : []),
            ...(updatedOn
              ? [
                {
                  attribute: 'updated_on',
                  condition: updatedOnCondition,
                  values: [updatedOn],
                  relation: SearchType.PROPOSAL,
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
    } catch (e) { }
  };

  return {
    searchAppClients,
    searchBillingItems,
    searchClients,
    searchInvoices,
    searchProposals,
  };
};
