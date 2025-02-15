import { eq } from "drizzle-orm";

import { db } from "../db/index";
import * as schema from "../db/schema";
import { getSpotifyWebAPIWithFixesAndImprovementsFromSonallux } from "./orval/spotify-api-client";

const spotifyClient = getSpotifyWebAPIWithFixesAndImprovementsFromSonallux();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const refreshSpotifyToken = async (refreshToken: string) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET)
    throw new Error(
      "Missing Spotify client credentials in environment variables."
    );

  const basicCode = Buffer.from(
    SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicCode}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error refreshing token", errorData);
    throw new Error(
      `Spotify token refresh failed: ${response.status} ${JSON.stringify(
        errorData
      )}`
    );
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token || refreshToken,
  };
};

const getValidAccessToken = async (userId: string): Promise<string> => {
  const account = await db.query.account.findFirst({
    where: eq(schema.account.userId, userId),
  });

  if (!account) {
    throw new Error(`No Spotify account found for user ${userId}`);
  }
  if (
    !account.accessToken ||
    !account.refreshToken ||
    !account.accessTokenExpiresAt
  ) {
    throw new Error(
      `Spotify account for user ${userId} is missing essential data (token or expiry). Please re-authenticate.`
    );
  }

  const now = new Date();
  const token_valid = account.accessTokenExpiresAt > now;
  if (token_valid) return account.accessToken;

  const { accessToken, expiresIn, refreshToken } = await refreshSpotifyToken(
    account.refreshToken
  );

  const expiresInMs = expiresIn * 1000;

  const expiresAt = new Date(Date.now() + expiresInMs);

  await db
    .update(schema.account)
    .set({
      accessToken,
      refreshToken,
      accessTokenExpiresAt: expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(schema.account.userId, userId));

  console.log("Spotify token refreshed and updated.");

  return accessToken;
};

const getCurrentUserPlaylists = async (accessToken: string) => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  const data = await spotifyClient.getAListOfCurrentUsersPlaylists(
    {},
    { headers }
  );

  return data.data;
};

export { refreshSpotifyToken, getCurrentUserPlaylists, getValidAccessToken };
