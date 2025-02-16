import { eq } from "drizzle-orm";

import { db } from "../db/index";
import * as schema from "../db/schema";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "../env";
import { getSpotifyWebAPIWithFixesAndImprovementsFromSonallux } from "./orval/spotify-api-client";

const spotifyClient = getSpotifyWebAPIWithFixesAndImprovementsFromSonallux();

const refreshSpotifyToken = async (refreshToken: string) => {
	const basicCode = Buffer.from(
		`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
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
				errorData,
			)}`,
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
			`Spotify account for user ${userId} is missing essential data (token or expiry). Please re-authenticate.`,
		);
	}

	const now = new Date();
	const token_valid = account.accessTokenExpiresAt > now;
	if (token_valid) return account.accessToken;

	const { accessToken, expiresIn, refreshToken } = await refreshSpotifyToken(
		account.refreshToken,
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

	return accessToken;
};

const calculatePageOffsets = (totalItems: number, pageSize: number) => {
	const pageCount = Math.ceil(totalItems / pageSize);
	return Array.from({ length: pageCount }, (_, i) => i * pageSize);
};

const createBatches = <T>(items: T[], batchSize: number) => {
	const batches = [];
	for (let i = 0; i < items.length; i += batchSize) {
		batches.push({
			items: items.slice(i, i + batchSize),
			position: i,
		});
	}
	return batches;
};

const getCurrentUserPlaylists = async (accessToken: string) => {
	const headers: Record<string, string> = {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	};
	const data = await spotifyClient.getAListOfCurrentUsersPlaylists(
		{},
		{ headers },
	);

	return data.data;
};

const getAllPlaylistTracks = async (
	playlistId: string,
	trackListCount: number,
	headers: Record<string, string>,
) => {
	const limit = 50;
	const offsets = calculatePageOffsets(trackListCount, limit);

	const trackBatches = await Promise.all(
		offsets.map((offset) =>
			spotifyClient.getPlaylistsTracks(
				playlistId,
				{
					limit,
					offset,
					fields: "items(track(uri))",
				},
				{ headers: headers },
			),
		),
	);

	return trackBatches.flatMap((batch) => batch.data.items);
};

type playlist = {
	name: string;
	id: string;
	trackListCount: number;
};

const createMergedPlaylistForUser = async (
	accessToken: string,
	playlistName: string,
	playlistsToMerge: playlist[],
) => {
	const headers: Record<string, string> = {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	};

	const user = await spotifyClient.getCurrentUsersProfile({ headers });
	if (!user.data.id)
		throw new Error(
			`No user id found for access token with status ${user.status}: ${user.statusText}`,
		);

	const trackURIs = (
		await Promise.all(
			playlistsToMerge.map(({ id, trackListCount }) =>
				getAllPlaylistTracks(id, trackListCount, headers),
			),
		)
	)
		.flat()
		.map((e) => e?.track?.uri)
		.filter((track) => track !== undefined);

	const trackBatches = createBatches(trackURIs, 100);

	const description = `Playlist created by spotify_utils - merged result of playlists: ${playlistsToMerge.map((e) => e.name).join(", ")}`;

	const newPlaylist = await spotifyClient.createPlaylist(
		user.data.id,
		{
			name: playlistName,
			description: description,
		},
		{ headers: headers },
	);

	const newPlaylistId = newPlaylist.data.id;

	if (!newPlaylistId)
		throw new Error(
			`Failed to create playlist with name: ${playlistName}, description :${description}`,
		);

	for (const { items, position } of trackBatches) {
		await spotifyClient.addTracksToPlaylist(
			newPlaylistId,
			{ uris: items, position },
			{},
			{ headers },
		);
	}
};

export {
	refreshSpotifyToken,
	getCurrentUserPlaylists,
	createMergedPlaylistForUser,
	getValidAccessToken,
};
