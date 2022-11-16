import React, { useEffect } from 'react'
import {gql, useQuery} from "@apollo/client";

const QUERY = gql`
  query codeVersion {
    codeVersion
  }
`;



export const AppStatus = () => {
  const { error } = useQuery(QUERY, { fetchPolicy: 'network-only', pollInterval: 5000 })

  useEffect(() => {
    if (error?.message === 'Unauthorized Request') {
      window.localStorage.setItem('accessToken', '');
    }
  }, [error])

  return <div>App Status</div>
}