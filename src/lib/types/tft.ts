import { type } from "arktype";

export const championType = type({
  name: "string | null",
  role: "string | null",
  tileIcon: "string | null",
  cost: "number",
  traits: "string[]",
});
export type Champion = typeof championType.infer;

export const traitType = type({
  name: "string",
  icon: "string",
});
export type Trait = typeof traitType.infer;

export const playableChampionType = type({
  name: "string",
  role: "string",
  tileIcon: "string",
  cost: "number",
  traits: traitType.array(),
});
export type PlayableChampion = typeof playableChampionType.infer;

export const selectedChampionType = playableChampionType.and({
  starLevel: "number",
});
export type SelectedChampion = typeof selectedChampionType.infer;

export const setType = type({
  number: "number",
  champions: championType.array(),
  traits: traitType.array(),
});
export type Set = typeof setType.infer;

export const communityDragonResponseType = type({
  setData: setType.array(),
});
export type CommunityDragonResponse = typeof communityDragonResponseType.infer;
