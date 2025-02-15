import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

import type { SimplifiedPlaylistObject } from "../../../../../backend/src/lib/orval/spotify-api-client";

interface PlaylistCardProps {
  playlist: SimplifiedPlaylistObject;
  selectedPlaylists: string[];
  onPlaylistSelection: (id: string) => void;
}

const PlaylistCard = ({
  playlist,
  selectedPlaylists,
  onPlaylistSelection,
}: PlaylistCardProps) => {
  return (
    <Card
      key={playlist.id}
      className="overflow-hidden cursor-pointer relative group hover:bg-muted/50 transition-colors"
      onClick={() => playlist.id && onPlaylistSelection(playlist.id)}
    >
      <CardContent className="p-2">
        <div className="aspect-square relative mb-2">
          <img
            src={playlist?.images?.[0]?.url || "/placeholder.svg"}
            alt={playlist.name}
            className="object-cover w-full h-full rounded"
          />
          {playlist.id && selectedPlaylists.includes(playlist.id) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 bg-primary rounded-full p-2">
                <Check className="text-white w-6 h-6" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-sm font-medium truncate">{playlist.name}</p>
        {playlist.id && selectedPlaylists.includes(playlist.id) && (
          <div className="absolute top-0 right-0 left-0 h-1 bg-primary" />
        )}
      </CardContent>
    </Card>
  );
};

export default PlaylistCard;
