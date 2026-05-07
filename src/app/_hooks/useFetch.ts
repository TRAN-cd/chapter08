'use client';

import useSWR from 'swr';
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export function useFetch<Type>(url: string){
  const { token } = useSupabaseSession();

  const fetcher = async ([fetchUrl, fetchToken]: [string, string]) => {
    const response = await fetch(fetchUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: fetchToken,
      },
    });
  
    if (!response.ok) {
      throw new Error('データ取得に失敗しました');
    }
  
    return response.json();
  };

  return useSWR<Type> (
    token ? [url, token] : null,
    fetcher
  );
}