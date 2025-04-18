import {
  useChannel,
  useConnectionStateListener,
  usePresence,
  usePresenceListener,
} from "ably/react";
import { useRef, useState } from "react";
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
import { useUpdateFeedback } from "../useUpdateFeedback";

type UseLobbyStateOptions = {
  onPartnersUpdate?: () => void;
};

export function useLobbyState(
  id: string,
  { onPartnersUpdate }: UseLobbyStateOptions = {}
) {
  const [lobbyState, setLobbyState] = useState<LobbyState>(defaultLobbyState);
  const [isConnected, setIsConnected] = useState(false);
  const {shouldShowUpdateFeedback, triggerUpdateFeedback} = useUpdateFeedback({delay: 1000})

  // signifies presence in the canal, that's it
  usePresence(id);
  useConnectionStateListener("connected", () => {
    setIsConnected(true);
  });
  const { presenceData } = usePresenceListener(id);
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
    if (message.clientId !== clientId) {
      onPartnersUpdate?.();
      triggerUpdateFeedback()
    }
    setLobbyState(messageToLobbyState(message.data, clientId));
  });

  const clientId = ably.auth.clientId;
  const isPartnerConnected = presenceData.some(
    (user) => user.clientId !== clientId
  );

  async function sendMessage(message: LobbyMessage) {
    if (!isConnected) return;
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
    isConnected,
    isPartnerConnected,
    shouldShowUpdateFeedback,
    updateSelectedChampions,
    updateChampionPriority,
    updateChampionStarLevel,
  };
}
