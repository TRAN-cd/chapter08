'use client';

import useSWR from 'swr';

export function usePublicFetch<Type>(url: string){
  const fetcher = async (fetchUrl: string) => {
    const response = await fetch(fetchUrl);
  
    if (!response.ok) {
      throw new Error('データ取得に失敗しました');
    }
  
    return response.json();
  };

  return useSWR<Type> (url, fetcher);
}