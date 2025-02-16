import { Music2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaylistMergerHeaderProps {
  selectedPlaylists: string[];
  onMergePlaylists: () => void;
}

const PlaylistMergerHeader = ({
  selectedPlaylists,
  onMergePlaylists,
}: PlaylistMergerHeaderProps) => {
  return (
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
              onClick={onMergePlaylists}
              disabled={selectedPlaylists.length < 2}
              variant="default"
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <RefreshCw
                className={`w-4 h-4 transition-opacity ${
                  selectedPlaylists.length < 2 ? "opacity-50" : "opacity-100"
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
  );
};

export default PlaylistMergerHeader;
