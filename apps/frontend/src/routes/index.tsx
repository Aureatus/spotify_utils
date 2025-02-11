import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({
  component: Index,
});

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Index() {
  const { data: session, isPending, error } = authClient.useSession();

  const spotifySignIn = async () => {
    await authClient.signIn.social({
      provider: "spotify",
      callbackURL: `${window.location.origin}`,
    });
  };

  if (error) return <div>Unexpected error: {error.message}</div>;
  if (session) return <div>Signed in!</div>;

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
