/* eslint-disable */
/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY. */
import type * as Types from './types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export const AppClientResultFragmentDoc = gql`
  fragment appClientResult on AppClientResult {
    id
    appClient {
      id
      name
    }
    appData {
      ... on AppClientProconnect {
        taxReturnType
      }
    }
    appName
    ignitionappClientId
    lastSyncedAt
    primaryContactEmail
    primaryContactName
  }
`;
export const BillingItemResultFragmentDoc = gql`
  fragment billingItemResult on BillingItemResult {
    id
    amount {
      format
    }
    amountWithTax {
      format
    }
    billingItemStatus
    billingStrategy
    client {
      id
      name
    }
    date
    itemPrice {
      description
      display
      displayName
      displayWithTax
      type
    }
    serviceName
  }
`;
export const PaymentMethodRequestFragmentDoc = gql`
  fragment paymentMethodRequest on PaymentMethodRequest {
    id
    errorMessage
    mostRecentActivityAt
    state
  }
`;
export const ClientResultFragmentDoc = gql`
  fragment clientResult on ClientResult {
    id
    client {
      id
      createdAt
      defaultContact {
        id
        email
        name
      }
      group {
        id
        name
      }
      isSurchargeEnabled
      name
      notificationSettings {
        recipients {
          emailAddress
        }
      }
      paymentMethodRequests(last: 1, filter: { requestTypeEq: EMAIL }) {
        edges {
          node {
            ...paymentMethodRequest
          }
        }
      }
      paymentMethods {
        createdAt
        type
      }
      state
    }
    mostRecentActivityCause
    mostRecentActivityError
    mostRecentActivityOn
  }
  ${PaymentMethodRequestFragmentDoc}
`;
export const InvoiceResultFragmentDoc = gql`
  fragment invoiceResult on InvoiceResult {
    id
    amountWithTax {
      format
    }
    client {
      id
      name
    }
    collectionOn
    externalNumber
    externalUrl
    paymentFailedOn
    paymentMethod {
      id
      displayName
      numberSuffix
      type
    }
    paymentProgress {
      displayName
    }
    paymentStatus
    payoutOn
    updatedAt
  }
`;
export const ProposalResultFragmentDoc = gql`
  fragment proposalResult on ProposalResult {
    id
    acceptedOn
    activeServiceCount
    client {
      id
      createdAt
      groupContactEmail
      groupName
      manager
      name
      partner
      primaryContactEmail
      tags
      updatedAt
    }
    clientSlug
    completedOn
    createdAt
    createdOn
    currency
    effectiveStartDate
    expiryDate
    isRenewed
    minimumValueCents
    mostRecentActivityCause
    mostRecentActivityError
    mostRecentActivityOn
    name
    referenceNumber
    remindersSentCount
    renewal
    reviewAssignee
    reviewState
    sentOn
    status
    updatedAt
    viewedByClient
    viewedByClientOn
  }
`;
export const AcknowledgementAddDocument = gql`
  mutation acknowledgementAdd($id: ID!, $level: AcknowledgementLevel!) {
    acknowledgementAdd(input: { id: $id, level: $level }) {
      acknowledgements {
        id
        level
        updatedAt
      }
    }
  }
`;
export type AcknowledgementAddMutationFn = Apollo.MutationFunction<
  Types.AcknowledgementAddMutation,
  Types.AcknowledgementAddMutationVariables
>;

/**
 * __useAcknowledgementAddMutation__
 *
 * To run a mutation, you first call `useAcknowledgementAddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcknowledgementAddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acknowledgementAddMutation, { data, loading, error }] = useAcknowledgementAddMutation({
 *   variables: {
 *      id: // value for 'id'
 *      level: // value for 'level'
 *   },
 * });
 */
export function useAcknowledgementAddMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.AcknowledgementAddMutation,
    Types.AcknowledgementAddMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.AcknowledgementAddMutation,
    Types.AcknowledgementAddMutationVariables
  >(AcknowledgementAddDocument, options);
}
export type AcknowledgementAddMutationHookResult = ReturnType<
  typeof useAcknowledgementAddMutation
>;
export type AcknowledgementAddMutationResult =
  Apollo.MutationResult<Types.AcknowledgementAddMutation>;
export type AcknowledgementAddMutationOptions = Apollo.BaseMutationOptions<
  Types.AcknowledgementAddMutation,
  Types.AcknowledgementAddMutationVariables
>;
export const AcknowledgementRemoveDocument = gql`
  mutation acknowledgementRemove($id: ID!, $level: AcknowledgementLevel!) {
    acknowledgementRemove(input: { id: $id, level: $level }) {
      acknowledgements {
        id
        level
        updatedAt
      }
    }
  }
`;
export type AcknowledgementRemoveMutationFn = Apollo.MutationFunction<
  Types.AcknowledgementRemoveMutation,
  Types.AcknowledgementRemoveMutationVariables
>;

/**
 * __useAcknowledgementRemoveMutation__
 *
 * To run a mutation, you first call `useAcknowledgementRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcknowledgementRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acknowledgementRemoveMutation, { data, loading, error }] = useAcknowledgementRemoveMutation({
 *   variables: {
 *      id: // value for 'id'
 *      level: // value for 'level'
 *   },
 * });
 */
export function useAcknowledgementRemoveMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.AcknowledgementRemoveMutation,
    Types.AcknowledgementRemoveMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.AcknowledgementRemoveMutation,
    Types.AcknowledgementRemoveMutationVariables
  >(AcknowledgementRemoveDocument, options);
}
export type AcknowledgementRemoveMutationHookResult = ReturnType<
  typeof useAcknowledgementRemoveMutation
>;
export type AcknowledgementRemoveMutationResult =
  Apollo.MutationResult<Types.AcknowledgementRemoveMutation>;
export type AcknowledgementRemoveMutationOptions = Apollo.BaseMutationOptions<
  Types.AcknowledgementRemoveMutation,
  Types.AcknowledgementRemoveMutationVariables
>;
export const AcknowledgementsDocument = gql`
  query acknowledgements {
    acknowledgements {
      id
      level
      updatedAt
    }
  }
`;

/**
 * __useAcknowledgementsQuery__
 *
 * To run a query within a React component, call `useAcknowledgementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAcknowledgementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAcknowledgementsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAcknowledgementsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.AcknowledgementsQuery,
    Types.AcknowledgementsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.AcknowledgementsQuery,
    Types.AcknowledgementsQueryVariables
  >(AcknowledgementsDocument, options);
}
export function useAcknowledgementsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.AcknowledgementsQuery,
    Types.AcknowledgementsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.AcknowledgementsQuery,
    Types.AcknowledgementsQueryVariables
  >(AcknowledgementsDocument, options);
}
export function useAcknowledgementsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    Types.AcknowledgementsQuery,
    Types.AcknowledgementsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.AcknowledgementsQuery,
    Types.AcknowledgementsQueryVariables
  >(AcknowledgementsDocument, options);
}
export type AcknowledgementsQueryHookResult = ReturnType<
  typeof useAcknowledgementsQuery
>;
export type AcknowledgementsLazyQueryHookResult = ReturnType<
  typeof useAcknowledgementsLazyQuery
>;
export type AcknowledgementsSuspenseQueryHookResult = ReturnType<
  typeof useAcknowledgementsSuspenseQuery
>;
export type AcknowledgementsQueryResult = Apollo.QueryResult<
  Types.AcknowledgementsQuery,
  Types.AcknowledgementsQueryVariables
>;
export const CodeVersionDocument = gql`
  query codeVersion {
    codeVersion
  }
`;

/**
 * __useCodeVersionQuery__
 *
 * To run a query within a React component, call `useCodeVersionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCodeVersionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCodeVersionQuery({
 *   variables: {
 *   },
 * });
 */
export function useCodeVersionQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.CodeVersionQuery,
    Types.CodeVersionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.CodeVersionQuery,
    Types.CodeVersionQueryVariables
  >(CodeVersionDocument, options);
}
export function useCodeVersionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.CodeVersionQuery,
    Types.CodeVersionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.CodeVersionQuery,
    Types.CodeVersionQueryVariables
  >(CodeVersionDocument, options);
}
export function useCodeVersionSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    Types.CodeVersionQuery,
    Types.CodeVersionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.CodeVersionQuery,
    Types.CodeVersionQueryVariables
  >(CodeVersionDocument, options);
}
export type CodeVersionQueryHookResult = ReturnType<typeof useCodeVersionQuery>;
export type CodeVersionLazyQueryHookResult = ReturnType<
  typeof useCodeVersionLazyQuery
>;
export type CodeVersionSuspenseQueryHookResult = ReturnType<
  typeof useCodeVersionSuspenseQuery
>;
export type CodeVersionQueryResult = Apollo.QueryResult<
  Types.CodeVersionQuery,
  Types.CodeVersionQueryVariables
>;
export const CurrentPracticeDocument = gql`
  query currentPractice {
    currentPractice {
      id
      referenceNumber
      name
      countryCode
    }
  }
`;

/**
 * __useCurrentPracticeQuery__
 *
 * To run a query within a React component, call `useCurrentPracticeQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentPracticeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentPracticeQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentPracticeQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.CurrentPracticeQuery,
    Types.CurrentPracticeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.CurrentPracticeQuery,
    Types.CurrentPracticeQueryVariables
  >(CurrentPracticeDocument, options);
}
export function useCurrentPracticeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.CurrentPracticeQuery,
    Types.CurrentPracticeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.CurrentPracticeQuery,
    Types.CurrentPracticeQueryVariables
  >(CurrentPracticeDocument, options);
}
export function useCurrentPracticeSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    Types.CurrentPracticeQuery,
    Types.CurrentPracticeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.CurrentPracticeQuery,
    Types.CurrentPracticeQueryVariables
  >(CurrentPracticeDocument, options);
}
export type CurrentPracticeQueryHookResult = ReturnType<
  typeof useCurrentPracticeQuery
>;
export type CurrentPracticeLazyQueryHookResult = ReturnType<
  typeof useCurrentPracticeLazyQuery
>;
export type CurrentPracticeSuspenseQueryHookResult = ReturnType<
  typeof useCurrentPracticeSuspenseQuery
>;
export type CurrentPracticeQueryResult = Apollo.QueryResult<
  Types.CurrentPracticeQuery,
  Types.CurrentPracticeQueryVariables
>;
export const SearchDocument = gql`
  query search(
    $searchType: SearchType!
    $booleanFilters: [SearchQueryBooleanFilterInput!]
    $dateFilters: [SearchQueryDateFilterInput!]
    $relativeDateFilters: [SearchQueryRelativeDateFilterInput!]
    $numberFilters: [SearchQueryNumberFilterInput!]
    $textFilters: [SearchQueryTextFilterInput!]
    $sort: SearchQuerySortInput
    $pagination: PaginationInput
  ) {
    search {
      pagedQuery(
        type: $searchType
        booleanFilters: $booleanFilters
        dateFilters: $dateFilters
        relativeDateFilters: $relativeDateFilters
        numberFilters: $numberFilters
        textFilters: $textFilters
        sort: $sort
        pagination: $pagination
      ) {
        results {
          edges {
            node {
              ... on ProposalResult {
                ...proposalResult
              }
              ... on ClientResult {
                ...clientResult
              }
              ... on AppClientResult {
                ...appClientResult
              }
              ... on BillingItemResult {
                ...billingItemResult
              }
            }
          }
        }
        totalCount
        totalValue {
          format
        }
      }
    }
  }
  ${ProposalResultFragmentDoc}
  ${ClientResultFragmentDoc}
  ${AppClientResultFragmentDoc}
  ${BillingItemResultFragmentDoc}
`;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      searchType: // value for 'searchType'
 *      booleanFilters: // value for 'booleanFilters'
 *      dateFilters: // value for 'dateFilters'
 *      relativeDateFilters: // value for 'relativeDateFilters'
 *      numberFilters: // value for 'numberFilters'
 *      textFilters: // value for 'textFilters'
 *      sort: // value for 'sort'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useSearchQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.SearchQuery,
    Types.SearchQueryVariables
  > &
    (
      | { variables: Types.SearchQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Types.SearchQuery, Types.SearchQueryVariables>(
    SearchDocument,
    options
  );
}
export function useSearchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.SearchQuery,
    Types.SearchQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Types.SearchQuery, Types.SearchQueryVariables>(
    SearchDocument,
    options
  );
}
export function useSearchSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    Types.SearchQuery,
    Types.SearchQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<Types.SearchQuery, Types.SearchQueryVariables>(
    SearchDocument,
    options
  );
}
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchSuspenseQueryHookResult = ReturnType<
  typeof useSearchSuspenseQuery
>;
export type SearchQueryResult = Apollo.QueryResult<
  Types.SearchQuery,
  Types.SearchQueryVariables
>;
export const SearchInvoicesDocument = gql`
  query searchInvoices(
    $booleanFilters: [SearchQueryBooleanFilterInput!]
    $dateFilters: [SearchQueryDateFilterInput!]
    $relativeDateFilters: [SearchQueryRelativeDateFilterInput!]
    $numberFilters: [SearchQueryNumberFilterInput!]
    $textFilters: [SearchQueryTextFilterInput!]
    $sort: SearchQuerySortInput
    $pagination: PaginationInput
  ) {
    search {
      pagedQuery(
        type: INVOICE
        booleanFilters: $booleanFilters
        dateFilters: $dateFilters
        relativeDateFilters: $relativeDateFilters
        numberFilters: $numberFilters
        textFilters: $textFilters
        sort: $sort
        pagination: $pagination
      ) {
        results {
          edges {
            node {
              ... on InvoiceResult {
                ...invoiceResult
              }
            }
          }
        }
        totalCount
        totalValue {
          format
        }
      }
    }
  }
  ${InvoiceResultFragmentDoc}
`;

/**
 * __useSearchInvoicesQuery__
 *
 * To run a query within a React component, call `useSearchInvoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchInvoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchInvoicesQuery({
 *   variables: {
 *      booleanFilters: // value for 'booleanFilters'
 *      dateFilters: // value for 'dateFilters'
 *      relativeDateFilters: // value for 'relativeDateFilters'
 *      numberFilters: // value for 'numberFilters'
 *      textFilters: // value for 'textFilters'
 *      sort: // value for 'sort'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useSearchInvoicesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.SearchInvoicesQuery,
    Types.SearchInvoicesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.SearchInvoicesQuery,
    Types.SearchInvoicesQueryVariables
  >(SearchInvoicesDocument, options);
}
export function useSearchInvoicesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.SearchInvoicesQuery,
    Types.SearchInvoicesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.SearchInvoicesQuery,
    Types.SearchInvoicesQueryVariables
  >(SearchInvoicesDocument, options);
}
export function useSearchInvoicesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    Types.SearchInvoicesQuery,
    Types.SearchInvoicesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.SearchInvoicesQuery,
    Types.SearchInvoicesQueryVariables
  >(SearchInvoicesDocument, options);
}
export type SearchInvoicesQueryHookResult = ReturnType<
  typeof useSearchInvoicesQuery
>;
export type SearchInvoicesLazyQueryHookResult = ReturnType<
  typeof useSearchInvoicesLazyQuery
>;
export type SearchInvoicesSuspenseQueryHookResult = ReturnType<
  typeof useSearchInvoicesSuspenseQuery
>;
export type SearchInvoicesQueryResult = Apollo.QueryResult<
  Types.SearchInvoicesQuery,
  Types.SearchInvoicesQueryVariables
>;
export const UpcomingBusinessDaysDocument = gql`
  query upcomingBusinessDays($startDate: Date!) {
    upcomingBusinessDays(count: 3, startDate: $startDate)
  }
`;

/**
 * __useUpcomingBusinessDaysQuery__
 *
 * To run a query within a React component, call `useUpcomingBusinessDaysQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpcomingBusinessDaysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpcomingBusinessDaysQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *   },
 * });
 */
export function useUpcomingBusinessDaysQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.UpcomingBusinessDaysQuery,
    Types.UpcomingBusinessDaysQueryVariables
  > &
    (
      | { variables: Types.UpcomingBusinessDaysQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.UpcomingBusinessDaysQuery,
    Types.UpcomingBusinessDaysQueryVariables
  >(UpcomingBusinessDaysDocument, options);
}
export function useUpcomingBusinessDaysLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.UpcomingBusinessDaysQuery,
    Types.UpcomingBusinessDaysQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.UpcomingBusinessDaysQuery,
    Types.UpcomingBusinessDaysQueryVariables
  >(UpcomingBusinessDaysDocument, options);
}
export function useUpcomingBusinessDaysSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    Types.UpcomingBusinessDaysQuery,
    Types.UpcomingBusinessDaysQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.UpcomingBusinessDaysQuery,
    Types.UpcomingBusinessDaysQueryVariables
  >(UpcomingBusinessDaysDocument, options);
}
export type UpcomingBusinessDaysQueryHookResult = ReturnType<
  typeof useUpcomingBusinessDaysQuery
>;
export type UpcomingBusinessDaysLazyQueryHookResult = ReturnType<
  typeof useUpcomingBusinessDaysLazyQuery
>;
export type UpcomingBusinessDaysSuspenseQueryHookResult = ReturnType<
  typeof useUpcomingBusinessDaysSuspenseQuery
>;
export type UpcomingBusinessDaysQueryResult = Apollo.QueryResult<
  Types.UpcomingBusinessDaysQuery,
  Types.UpcomingBusinessDaysQueryVariables
>;
