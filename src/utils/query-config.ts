import { DefaultOptions, QueryClient } from "@tanstack/react-query"

export const queryConfig: DefaultOptions = {
    queries: {
        staleTime: 1000 * 60 * 5,

        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
        retry: 1,
    },
}

/**
 * Creates a new QueryClient instance with the default configuration
 */
export function createQueryClient() {
    return new QueryClient({
        defaultOptions: queryConfig,
    })
}
