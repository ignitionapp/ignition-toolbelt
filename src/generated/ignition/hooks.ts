/* eslint-disable */
/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY. */
import type * as Types from './types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

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
