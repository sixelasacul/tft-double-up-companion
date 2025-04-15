import { useChannel, usePresence } from "ably/react";
import { useEffect, useState } from "react";
import { ResultAsync } from "neverthrow";
import { type } from "arktype";
import { SelectedChampion } from "~/lib/types/tft";
import {
  LobbyMessage,
  lobbyMessageType,
  LobbyState,
} from "../../types/lobbyState";
import {
  defaultLobbyState,
  lobbyStateToMessage,
  messageToLobbyState,
  moveChampion,
  toggleChampion,
  updateChampionStarLevel as _updateChampionStarLevel,
} from "./utils";

export function useLobbyState(id: string) {
  const [lobbyState, setLobbyState] = useState<LobbyState>(defaultLobbyState);

  // signifies presence in the canal, that's it
  usePresence(id);
  const { publish, ably } = useChannel(id, (message) => {
    const lobbyMessage = lobbyMessageType(message.data);
    if (lobbyMessage instanceof type.errors) {
      console.error(
        "Invalid lobby message",
        lobbyMessage.summary,
        message.data
      );
      return;
    }
    setLobbyState(messageToLobbyState(message.data, clientId));
  });
  const clientId = ably.auth.clientId;

  async function sendMessage(message: LobbyMessage) {
    // ably doesn't provide a way to know capabilities in advance
    const result = await ResultAsync.fromPromise(
      publish({
        data: message,
      }),
      (error) =>
        new Error("Error occurred while publishing an event", { cause: error })
    );
    if (result.isErr()) {
      return;
    }
  }

  async function updateSelectedChampions(champion: SelectedChampion) {
    const newMessage = lobbyStateToMessage({
      partner: lobbyState.partner,
      you: {
        clientId: clientId,
        champions: toggleChampion(lobbyState.you.champions, champion),
      },
    });
    await sendMessage(newMessage);
  }

  async function updateChampionPriority(
    champion: SelectedChampion,
    destination: number
  ) {
    const newMessage = lobbyStateToMessage({
      partner: lobbyState.partner,
      you: {
        clientId: clientId,
        champions: moveChampion(
          lobbyState.you.champions,
          champion,
          destination
        ),
      },
    });
    await sendMessage(newMessage);
  }

  async function updateChampionStarLevel(
    champion: SelectedChampion,
    starLevel: number
  ) {
    const newMessage = lobbyStateToMessage({
      partner: lobbyState.partner,
      you: {
        clientId: clientId,
        champions: _updateChampionStarLevel(
          lobbyState.you.champions,
          champion,
          starLevel
        ),
      },
    });
    await sendMessage(newMessage);
  }

  return {
    lobbyState,
    updateSelectedChampions,
    updateChampionPriority,
    updateChampionStarLevel,
  };
}
