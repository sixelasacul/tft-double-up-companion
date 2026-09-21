import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { FetchError, ofetch } from "ofetch";
import {
  Champion, Trait,
  communityDragonResponseType,
  playableChampionType,
} from "../types/tft";
import { type } from "arktype";
import { join, basename, dirname} from 'node:path'

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
      // it made sense to have the icons handled in the server function rather
      // than the api, it's just that the types aren't correct
      // ChampionResponse (may have null and non champions)
      // -> APIChampion (only playable champions with full properties)
      // -> PlayableChampion (Client ready data)
      tileIcons: getChampionIcons(champion),
      traits: champion.traits.map((trait) => ({
        name: trait,
        icon: getTraitIcon(currentSet.traits.find((t) => t.name === trait)!),
      })),
    }));
  const playableChampions = playableChampionsType(filteredChampions);
  if (playableChampions instanceof type.errors) {
    return errAsync(playableChampions.summary);
  }

  return okAsync({ champions: playableChampions, traits: currentSet.traits });
}

const SUFFIX = ".tft_set18"
export function getChampionIcons(champion: Champion) {
  const tileIcon = champion.tileIcon ?? ''
  const filename = basename(tileIcon.toLowerCase()).replace(".tex", `${SUFFIX}.jpg`)
  const folder = dirname(tileIcon.toLowerCase())


  const squareIcon = champion.squareIcon ?? ''
  const squareFilename = basename(squareIcon.toLowerCase()).replace(".tex", ".png")
  const squareFolder = dirname(squareIcon.toLowerCase())

  return [
    // as expected
    `${baseAssetsURL}/${folder}/${filename}`,
    // sometimes the path points to the hud folder when not needed
    `${baseAssetsURL}/${join(folder, '..')}/${filename}`,
    // and sometimes the path should point to the hud folder but it's not the case
    `${baseAssetsURL}/${join(folder, 'hud')}/${filename}`,
    // if nothing works, we look at the squareIcon instead
    `${baseAssetsURL}/${squareFolder}/${squareFilename}`,
  ];
}

function getTraitIcon(trait: Trait) {
  const assetUrl = trait.icon.toLowerCase().replace(".tex", `${SUFFIX}.png`);
  return `${baseAssetsURL}/${assetUrl}`;
}
