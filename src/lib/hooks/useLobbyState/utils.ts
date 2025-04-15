import { SelectedChampion } from "~/lib/types/tft";
import { LobbyMessage, LobbyState } from "../../types/lobbyState";

const defaultPlayerState: NonNullable<LobbyMessage[number]> = {
  clientId: "",
  champions: [],
};

export const defaultLobbyState: LobbyState = {
  you: {
    clientId: "",
    champions: [],
  },
  partner: {
    clientId: "",
    champions: [],
  },
};

export function messageToLobbyState(
  message: LobbyMessage,
  clientId: string
): LobbyState {
  // defaults to 0 for "spectators"
  const youIndex =
    message.findIndex((player) => player?.clientId === clientId) ?? 0;
  const yourState = message[youIndex] ?? defaultPlayerState;
  const partnerState = message[youIndex === 0 ? 1 : 0] ?? defaultPlayerState;

  return {
    you: yourState,
    partner: partnerState,
  };
}

export function lobbyStateToMessage(lobbyState: LobbyState): LobbyMessage {
  return [lobbyState.you, lobbyState.partner];
}

function findChampionIndex(
  selectedChampions: SelectedChampion[],
  champion: SelectedChampion
) {
  // used to work with `indexOf`, idk why it broke
  return selectedChampions.findIndex((c) => c.name === champion.name);
}

export function toggleChampion(
  selectedChampions: SelectedChampion[],
  championToToggle: SelectedChampion
): SelectedChampion[] {
  const index = findChampionIndex(selectedChampions, championToToggle);
  if (index === -1) {
    return selectedChampions.concat(championToToggle);
  }
  return selectedChampions.toSpliced(index, 1);
}

export function moveChampion(
  selectedChampions: SelectedChampion[],
  championToMove: SelectedChampion,
  destination: number
): SelectedChampion[] {
  // could call toggle i guess
  const index = findChampionIndex(selectedChampions, championToMove);
  return selectedChampions
    .toSpliced(index, 1)
    .toSpliced(destination, 0, championToMove);
}

export function updateChampionStarLevel(
  selectedChampions: SelectedChampion[],
  championToUpdate: SelectedChampion,
  newStarLevel: number
): SelectedChampion[] {
  const index = findChampionIndex(selectedChampions, championToUpdate);
  return selectedChampions.with(index, {
    ...championToUpdate,
    starLevel: newStarLevel,
  });
}
