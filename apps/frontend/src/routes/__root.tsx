import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import queryClient from "@/lib/query-client";

import { Toaster } from "@/components/ui/toaster";

export const Route = createRootRoute({
	component: () => {
		return (
			<QueryClientProvider client={queryClient}>
				<Outlet />
				<TanStackRouterDevtools position="top-left" />
				<ReactQueryDevtools
					initialIsOpen={false}
					buttonPosition="bottom-left"
				/>
				<Toaster />
			</QueryClientProvider>
		);
	},
});
