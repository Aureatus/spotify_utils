import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
	beforeLoad: async ({ location }) => {
		const { data } = await authClient.getSession();
		if (!data) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.pathname,
				},
			});
		}
		return { session: data };
	},
});

export default function Index() {
	return (
		<div className="flex items-center justify-center h-screen bg-background">
			<Card className="max-w-lg w-full p-8">
				<CardContent className="p-0 w-full flex flex-col items-center gap-4">
					<h1 className="text-2xl font-bold">Welcome to Playlist Merger</h1>
					<p className="text-muted-foreground">
						Ready to merge your playlists?
					</p>
					<Link to="/merge">
						<Button className="w-full px-8 py-3">Go to Playlist Merger</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
