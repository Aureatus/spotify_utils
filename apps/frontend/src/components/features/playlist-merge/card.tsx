import { MusicIcon } from "lucide-react";
import type { SimplifiedPlaylistObject } from "../../../../../backend/src/lib/orval/spotify-api-client";

interface PlaylistCardProps {
	playlist: SimplifiedPlaylistObject;
	selectedPlaylists: string[];
	selectionOrder: number | null;
	onPlaylistSelection: (playlistId: string) => void;
}

export default function PlaylistCard({
	playlist,
	selectedPlaylists,
	selectionOrder,
	onPlaylistSelection,
}: PlaylistCardProps) {
	return (
		<button
			type="button"
			className={`relative rounded-lg overflow-hidden cursor-pointer group w-full text-left select-none
                ${selectedPlaylists.includes(playlist.id ?? "") ? "ring-2 ring-primary" : ""}
            `}
			onClick={() => onPlaylistSelection(playlist.id ?? "")}
			aria-pressed={selectedPlaylists.includes(playlist.id ?? "")}
			aria-label={`Select ${playlist.name} playlist`}
		>
			{selectionOrder && (
				<div className="absolute top-2 right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium z-10">
					{selectionOrder}
				</div>
			)}

			<div className="aspect-square relative">
				{playlist.images?.[0]?.url ? (
					<img
						src={playlist.images[0].url}
						alt={playlist.name ?? "Playlist"}
						className="w-full h-full object-cover"
						draggable={false}
					/>
				) : (
					<div className="w-full h-full bg-muted flex items-center justify-center">
						<MusicIcon className="w-12 h-12 text-muted-foreground" />
					</div>
				)}
			</div>

			<div className="p-4 bg-black/80 backdrop-blur-sm">
				<h3 className="font-semibold text-base text-white mb-1 truncate">
					{playlist.name}
				</h3>
				<p className="text-sm font-medium text-white/70 truncate">
					{playlist.tracks?.total ?? 0} tracks
				</p>
			</div>
		</button>
	);
}
