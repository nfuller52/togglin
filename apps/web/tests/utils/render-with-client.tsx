import type { ReactElement } from "react";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { render } from "@testing-library/react";

export function renderWithClient(
  component: ReactElement,
  client?: QueryClient,
) {
  if (!client) {
    const queryCache = new QueryCache();
    const mutationCache = new MutationCache();

    client = new QueryClient({ queryCache, mutationCache });
  }

  const { rerender, ...result } = render(
    <QueryClientProvider client={client}>{component}</QueryClientProvider>,
  );

  return {
    ...result,
    render: (rerenderUi: ReactElement) =>
      rerender(
        <QueryClientProvider client={client}>{rerenderUi}</QueryClientProvider>,
      ),
  };
}
