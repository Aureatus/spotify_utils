import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

import { Check, Music2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MergeDialog from "@/components/features/playlist-merge/merge-dialog";

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

  const handleMergeConfirm = () => {
    if (!mergedPlaylistName) return;

    console.log("Merging playlists with name:", mergedPlaylistName);

    handleDialogClose();
  };

  if (error) return <div>Unexpected error: {error.message}</div>;

  if (session && playlists)
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
          <div className="container mx-auto p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm p-2 rounded-md">
                  <Music2 className="w-6 h-6 text-primary" />
                  <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    Playlist Merger
                  </h1>
                </div>
                <Button
                  onClick={handleMergePlaylists}
                  disabled={selectedPlaylists.length < 2}
                  variant="default"
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  <RefreshCw
                    className={`w-4 h-4 transition-opacity ${
                      selectedPlaylists.length < 2
                        ? "opacity-50"
                        : "opacity-100"
                    }`}
                  />
                  Merge Selected ({selectedPlaylists.length})
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm text-foreground/80">
                  <span>
                    {selectedPlaylists.length === 0
                      ? "Select playlists to merge"
                      : `${selectedPlaylists.length} playlist${
                          selectedPlaylists.length === 1 ? "" : "s"
                        } selected`}
                  </span>
                  {selectedPlaylists.length > 0 && (
                    <span>
                      {selectedPlaylists.length < 2
                        ? "Select at least one more"
                        : "Ready to merge"}
                    </span>
                  )}
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{
                      width: `${Math.min(
                        (selectedPlaylists.length / 2) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlists?.items?.map((playlist) => (
              <Card
                key={playlist.id}
                className="overflow-hidden cursor-pointer relative group hover:bg-muted/50 transition-colors"
                onClick={() => playlist.id && handlePlaylistSelect(playlist.id)}
              >
                <CardContent className="p-2">
                  <div className="aspect-square relative mb-2">
                    <img
                      src={playlist?.images?.[0]?.url || "/placeholder.svg"}
                      alt={playlist.name}
                      className="object-cover w-full h-full rounded"
                    />
                    {/* Selection overlay */}
                    {playlist.id && selectedPlaylists.includes(playlist.id) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="relative z-10 bg-primary rounded-full p-2">
                          <Check className="text-white w-6 h-6" />
                        </div>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm font-medium truncate">
                    {playlist.name}
                  </p>
                  {/* Selection indicator */}
                  {playlist.id && selectedPlaylists.includes(playlist.id) && (
                    <div className="absolute top-0 right-0 left-0 h-1 bg-primary" />
                  )}
                </CardContent>
              </Card>
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
