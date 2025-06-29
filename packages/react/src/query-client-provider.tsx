// TODO: 实现 QueryClientProvider 组件 

import { createContext, useContext, useState } from "react";
import { QueryClient } from "@the-tanstack-query/core";

const QueryClientContext = createContext<QueryClient | null>(null);

export const useQueryClient = () => {
  const queryClient = useContext(QueryClientContext);
  if (!queryClient) {
    throw new Error('QueryClient not found');
  }
  return queryClient;
}

export const QueryClientProvider = ({children}: {children: React.ReactNode}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientContext.Provider value={queryClient}>
      {children}
    </QueryClientContext.Provider>
  )
}
