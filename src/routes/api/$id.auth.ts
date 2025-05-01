import * as Ably from "ably";
import { ResultAsync } from "neverthrow";
import { v4 as uuid } from "uuid";
import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export const APIRoute = createAPIFileRoute("/api/$id/auth")({
  GET: async ({ params }) => {
    const lobbyId = params.id;
    const CLIENT_ID_COOKIE = "client-id";
    const clientId = getCookie(CLIENT_ID_COOKIE) ?? uuid();
    setCookie(CLIENT_ID_COOKIE, clientId);

    const ably = new Ably.Rest({
      key: process.env.ABLY_API_KEY,
    });

    // this is to avoid more people to come and hijack a lobby
    // though this could still happen if one of them leaves, and someone else
    // joins
    // + we don't check the client ids
    const presence = await ably.channels.get(lobbyId).presence.get();
    const isLobbyFull = presence.items.length === 2;

    // the first recommended approach: https://ably.com/docs/auth/token#token-request
    // though I don't quite understand why they would not recommend fetching
    // the token server side.
    const result = await ResultAsync.fromPromise(
      ably.auth.createTokenRequest({
        clientId,
        capability: {
          [lobbyId]: isLobbyFull
            ? ["subscribe"]
            : ["presence", "publish", "subscribe"],
        },
      }),
      (error) =>
        new Error("Error occurred while creating a token request", {
          cause: error,
        })
    );

    if (result.isErr()) {
      console.error(result.error);
      return json(result.error, { status: 400 });
    }
    return json(result.value);
  },
});
