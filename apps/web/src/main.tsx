import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootEle = document.getElementById("root");
if (rootEle && !rootEle.innerHTML) {
	const root = ReactDOM.createRoot(rootEle);
	root.render(
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>,
	);
}
