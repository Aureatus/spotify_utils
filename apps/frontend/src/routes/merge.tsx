import {
	createFileRoute,
	redirect,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";

import PlaylistCard from "@/components/features/playlist-merge/card";
import MergeDialog from "@/components/features/playlist-merge/merge-dialog";
import PlaylistMergerHeader from "@/components/features/playlist-merge/merge-header";

import { authClient } from "@/lib/auth-client";
import { app } from "@/lib/elysia-client";
import type { SimplifiedPlaylistObject } from "../../../backend/src/lib/orval/spotify-api-client";

const selectedPlaylistsSchema = z.object({
	selectedPlaylists: z.array(z.string()).default([]),
	mergedPlaylistName: z.string().optional(),
	dialogOpen: z.boolean().default(false),
});

export const Route = createFileRoute("/merge")({
	validateSearch: zodValidator(selectedPlaylistsSchema),
	beforeLoad: async () => {
		const { data, error } = await authClient.getSession();
		if (error || !data) throw redirect({ to: "/" });
	},
	loader: async () => {
		const response = await app.api.spotify.playlists.get();
		const { data, error } = response;
		if (error) throw error;
		return { playlists: data };
	},
	staleTime: Number.POSITIVE_INFINITY,
	component: MergePage,
});

export default function MergePage() {
	const { selectedPlaylists, mergedPlaylistName, dialogOpen } =
		Route.useSearch();
	const { playlists } = Route.useLoaderData();
	const navigate = useNavigate({ from: Route.fullPath });
	const router = useRouter();
	const { toast } = useToast();

	const handlePlaylistSelect = (playlistId: string) => {
		const newSelectedPlaylists = selectedPlaylists.includes(playlistId)
			? selectedPlaylists.filter((id) => id !== playlistId)
			: [...selectedPlaylists, playlistId];

		navigate({
			search: (prev) => ({ ...prev, selectedPlaylists: newSelectedPlaylists }),
			resetScroll: false,
			replace: true,
		});
	};

	const handleMergePlaylists = () => {
		navigate({
			search: (prev) => ({ ...prev, dialogOpen: true }),
			resetScroll: false,
			replace: true,
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
			replace: true,
		});
	};

	const handlePlaylistNameChange = (name: string) => {
		navigate({
			search: (prev) => ({ ...prev, mergedPlaylistName: name }),
			resetScroll: false,
			replace: true,
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
			await router.invalidate();
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

	if (playlists)
		return (
			<div className="w-full min-h-screen bg-background">
				<PlaylistMergerHeader
					selectedPlaylists={selectedPlaylists}
					onMergePlaylists={handleMergePlaylists}
				/>

				<div className="container mx-auto p-4">
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{playlists?.items?.map((playlist: SimplifiedPlaylistObject) => (
							<PlaylistCard
								playlist={playlist}
								selectedPlaylists={selectedPlaylists}
								onPlaylistSelection={handlePlaylistSelect}
								key={playlist.id}
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
}
