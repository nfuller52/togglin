import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

interface ApiProviderProps {
	children: ReactNode;
}

export function ApiProvider({ children }: Readonly<ApiProviderProps>) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
