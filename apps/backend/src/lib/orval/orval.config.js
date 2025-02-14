module.exports = {
  "spotify-api": {
    input: "./fixed-spotify-open-api.yml",
    output: {
      target: "./spotify-api-client.ts",
      baseUrl: "https://api.spotify.com/v1",
      client: "axios",
    },
  },
};
