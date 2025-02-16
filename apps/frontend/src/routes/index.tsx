import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import PlaylistCard from "@/components/features/playlist-merge/card";
import MergeDialog from "@/components/features/playlist-merge/merge-dialog";
import PlaylistMergerHeader from "@/components/features/playlist-merge/merge-header";

import { authClient } from "@/lib/auth-client";
import { app } from "@/lib/elysia-client";

const selectedPlaylistsSchema = z.object({
	selectedPlaylists: z.array(z.string()).default([]),
	mergedPlaylistName: z.string().optional(),
	dialogOpen: z.boolean().default(false),
});

export const Route = createFileRoute("/")({
	component: Index,
	validateSearch: zodValidator(selectedPlaylistsSchema),
});

export default function Index() {
	const { data: session, isPending, error } = authClient.useSession();
	const { data: playlists } = useQuery({
		queryKey: ["playlists"],
		queryFn: async () => {
			const response = await app.api.spotify.playlists.get();
			const { data, error } = response;
			if (error) throw error;
			return data;
		},
	});

	const { selectedPlaylists, mergedPlaylistName, dialogOpen } =
		Route.useSearch();

	const navigate = useNavigate({ from: Route.fullPath });

	const { toast } = useToast();

	const spotifySignIn = async () => {
		await authClient.signIn.social({
			provider: "spotify",
			callbackURL: `${window.location.origin}`,
		});
	};

	const handlePlaylistSelect = (playlistId: string) => {
		const newSelectedPlaylists = selectedPlaylists.includes(playlistId)
			? selectedPlaylists.filter((id) => id !== playlistId)
			: [...selectedPlaylists, playlistId];

		navigate({
			search: (prev) => ({ ...prev, selectedPlaylists: newSelectedPlaylists }),
			resetScroll: false,
		});
	};

	const handleMergePlaylists = () => {
		navigate({
			search: (prev) => ({ ...prev, dialogOpen: true }),
			resetScroll: false,
		});
	};

	const handleDialogClose = () => {
		navigate({
			search: (prev) => ({
				...prev,
				dialogOpen: false,
				mergedPlaylistName: undefined,
			}),
			resetScroll: false,
		});
	};

	const handlePlaylistNameChange = (name: string) => {
		navigate({
			search: (prev) => ({ ...prev, mergedPlaylistName: name }),
			resetScroll: false,
		});
	};

	const handleMergeConfirm = async () => {
		if (!mergedPlaylistName || !playlists) return;

		const body = {
			playlistName: mergedPlaylistName,
			playlistsToMerge: selectedPlaylists
				.map((playlistId) => {
					const targetPlaylist = playlists?.items?.find(
						(playlist) => playlist.id === playlistId,
					);
					if (
						!targetPlaylist ||
						!targetPlaylist.name ||
						!targetPlaylist.id ||
						!targetPlaylist.tracks ||
						!targetPlaylist.tracks.href ||
						!targetPlaylist.tracks.total
					)
						return null;

					return {
						name: targetPlaylist?.name,
						id: targetPlaylist?.id,
						trackListCount: targetPlaylist.tracks.total,
					};
				})
				.filter((e) => e !== null),
		};
		const loadingToast = toast({
			title: "Merging playlists...",
			duration: Number.POSITIVE_INFINITY,
			style: { borderRadius: 6 },
		});

		try {
			await app.api.spotify.merge.post(body);
			handleDialogClose();
			toast({
				title: `Successfully created "${mergedPlaylistName}"`,
				duration: 500,
				style: { borderRadius: 6 },
			});
		} catch {
			toast({
				variant: "destructive",
				title: "Failed to merge playlists",
				style: { borderRadius: 6 },
			});
		} finally {
			loadingToast.dismiss();
		}
	};

	if (error) return <div>Unexpected error: {error.message}</div>;

	if (session && playlists)
		return (
			<div className="w-full min-h-screen bg-background">
				<PlaylistMergerHeader
					selectedPlaylists={selectedPlaylists}
					onMergePlaylists={handleMergePlaylists}
				/>

				<div className="container mx-auto p-4">
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{playlists?.items?.map((playlist) => (
							<PlaylistCard
								playlist={playlist}
								selectedPlaylists={selectedPlaylists}
								onPlaylistSelection={handlePlaylistSelect}
							/>
						))}
					</div>
				</div>

				<MergeDialog
					open={dialogOpen}
					onOpenChange={(open) => {
						if (!open) handleDialogClose();
					}}
					onClose={handleDialogClose}
					playlistCount={selectedPlaylists.length}
					playlistName={mergedPlaylistName}
					onPlaylistNameChange={handlePlaylistNameChange}
					onConfirm={handleMergeConfirm}
				/>
			</div>
		);

	if (!isPending && !session) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Card className="max-w-lg w-full p-8">
					<CardContent className="p-0 w-full flex items-center">
						<Button
							variant="outline"
							className="w-full px-8 py-3 gap-2"
							onClick={() => spotifySignIn()}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1.2em"
								height="1.2em"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M12.001 2c-5.5 0-10 4.5-10 10s4.5 10 10 10s10-4.5 10-10s-4.45-10-10-10m3.75 14.65c-2.35-1.45-5.3-1.75-8.8-.95c-.35.1-.65-.15-.75-.45c-.1-.35.15-.65.45-.75c3.8-.85 7.1-.5 9.7 1.1c.35.15.4.55.25.85c-.2.3-.55.4-.85.2m1-2.7c-2.7-1.65-6.8-2.15-9.95-1.15c-.4.1-.85-.1-.95-.5s.1-.85.5-.95c3.65-1.1 8.15-.55 11.25 1.35c-.3.15.45.65.2 1s-.7.5-1.05.25M6.3 9.75c-.5.15-1-.15-1.15-.6c-.15-.5.15-1 .6-1.15c3.55-1.05 9.4-.85 13.1 1.35c-.45.25.6.85.35 1.3c-.25.35-.85.5-1.3.25C14.7 9 9.35 8.8 6.3 9.75"
								></path>
							</svg>
							Sign in with Spotify
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}
}
