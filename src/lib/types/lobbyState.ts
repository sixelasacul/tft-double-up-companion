import { type } from "arktype";
import { selectedChampionType } from "~/lib/types/tft";

const lobbyPlayerType = type({
  clientId: "string.uuid | ''",
  champions: selectedChampionType.array(),
});
export const lobbyMessageType = lobbyPlayerType.or("null").array();
export type LobbyMessage = typeof lobbyMessageType.infer;

export const lobbyStateType = type({
  you: {
    clientId: "string.uuid",
    champions: selectedChampionType.array(),
  },
  partner: {
    clientId: "string.uuid | ''",
    champions: selectedChampionType.array(),
  },
});
export type LobbyState = typeof lobbyStateType.infer;
