import { Trait } from "./../types/tft";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { FetchError, ofetch } from "ofetch";
import {
  communityDragonResponseType,
  PlayableChampion,
  playableChampionType,
} from "../types/tft";
import { type } from "arktype";

// from https://www.communitydragon.org

const baseURL = "https://raw.communitydragon.org/latest";
const cdApi = ofetch.create({
  baseURL,
});
const baseAssetsURL = `${baseURL}/plugins/rcp-be-lol-game-data/global/default`;

async function getLatestTftSetData() {
  const result = await ResultAsync.fromPromise(
    cdApi("/cdragon/tft/en_us.json"),
    (error) => {
      if (error instanceof FetchError) {
        return String(error.data);
      }
      return String(error);
    }
  );

  if (result.isErr()) {
    return errAsync(result.error);
  }

  const data = communityDragonResponseType(result.value);

  if (data instanceof type.errors) {
    return errAsync(data.summary);
  }

  return okAsync(data);
}

export const CURRENT_SET_NUMBER = 18;

const playableChampionsType = playableChampionType.array();
export async function getAllDataForCurrentSet() {
  const result = await getLatestTftSetData();
  if (result.isErr()) {
    return errAsync(result.error);
  }

  const response = result.value;
  const currentSet = response.setData.find(
    (set) => set.number === CURRENT_SET_NUMBER
  );

  if (!currentSet) {
    return errAsync(`Set ${CURRENT_SET_NUMBER} not found`);
  }

  const filteredChampions = currentSet.champions
    .filter((champion) => champion.traits.length > 0)
    .map((champion) => ({
      ...champion,
      traits: champion.traits.map((trait) => ({
        name: trait,
        icon: currentSet.traits.find((t) => t.name === trait)?.icon,
      })),
    }));
  const playableChampions = playableChampionsType(filteredChampions);
  if (playableChampions instanceof type.errors) {
    return errAsync(playableChampions.summary);
  }

  console.log(playableChampions)

  return okAsync({ champions: playableChampions, traits: currentSet.traits });
}

const SUFFIX = ".tft_set18"
export function getChampionImage(champion: PlayableChampion) {
  const assetUrl = champion.tileIcon.toLowerCase().replace(".tex", `${SUFFIX}.jpg`);
  return `${baseAssetsURL}/${assetUrl}`;
}
// Some champions have their images not stored in the same way as the others
// Should make a ping to know if the asset folder of that champions contains a
// hud folder, and if so, use this one instead.
// Or if possible, find a pure html way to do so? like object and img, having a fallback
export function getChampionHudImage(champion: PlayableChampion) {
  const assetUrl = champion.tileIcon.toLowerCase().replace(".tex", `${SUFFIX}.jpg`);
  return `${baseAssetsURL}/${assetUrl}`;
}

export function getTraitImage(trait: Trait) {
  const assetUrl = trait.icon.toLowerCase().replace(".tex", `${SUFFIX}.png`);
  return `${baseAssetsURL}/${assetUrl}`;
}
