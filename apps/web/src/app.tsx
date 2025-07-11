import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ApiProvider } from "@/contexts/api";
import { ThemeProvider } from "@/contexts/theme";
import { routeTree } from "./routeTree.gen";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({ routeTree });

export function App() {
  return (
    <ApiProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ApiProvider>
  );
}
