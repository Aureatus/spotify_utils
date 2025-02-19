import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

interface MergeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onClose: () => void;
	playlistCount: number;
	playlistName: string | undefined;
	onPlaylistNameChange: (name: string) => void;
	onConfirm: () => void;
}

const MergeDialog = ({
	open,
	onOpenChange,
	onClose,
	playlistCount,
	playlistName,
	onPlaylistNameChange,
	onConfirm,
}: MergeDialogProps) => {
	const { toasts } = useToast();
	const isMerging = toasts.some(
		(toast) => toast.title === "Merging playlists...",
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="bg-background border-border sm:max-w-[425px] [&>button:last-child]:hidden"
				// The [&>button:last-child]:hidden class hides the default close button that shadcn/ui adds
			>
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-foreground">
						Name Your Merged Playlist
					</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="playlist-name" className="text-foreground">
							Playlist Name
						</Label>
						<Input
							id="playlist-name"
							placeholder="Enter playlist name..."
							value={playlistName || ""}
							onChange={(e) => onPlaylistNameChange(e.target.value)}
							className="border-border bg-background text-foreground placeholder:text-muted-foreground"
						/>
					</div>
					<div className="text-sm text-primary-foreground/70">
						Merging {playlistCount} playlists
					</div>
				</div>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button
						variant="outline"
						onClick={onClose}
						className="border-border text-foreground hover:bg-muted"
					>
						Cancel
					</Button>
					<Button
						onClick={onConfirm}
						disabled={!playlistName || isMerging}
						className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
					>
						<RefreshCw className="w-4 h-4" />
						Create Playlist
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default MergeDialog;
