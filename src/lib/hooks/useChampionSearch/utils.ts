import {Expression} from "fuse.js";
import { PlayableChampion } from "~/lib/types/tft";

export type GroupBy = "none" | "trait";
type GroupedChampion = Record<string, PlayableChampion[]>;

export function groupChampion(
  champions: PlayableChampion[],
  by: GroupBy
): GroupedChampion {
  if (by === "trait") {
    return champions.reduce((acc, champion) => {
      for (const trait of champion.traits) {
        acc[trait.name] = [...(acc[trait.name] ?? []), champion];
      }
      return acc;
    }, {} as GroupedChampion);
  }

  return {
    none: champions,
  };
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\w]/g, "");
}

// could move to fuse.js or another lib
export function matchesByNameOrTraits(
  champion: PlayableChampion,
  terms: string[]
) {
  const matchesName = terms.some((term) =>
    normalize(champion.name).includes(term)
  );
  const matchesTraits = terms.some((term) =>
    champion.traits.some((trait) => normalize(trait.name).includes(term))
  );
  return matchesName || matchesTraits;
}

// https://www.fusejs.io/examples.html#extended-search
// From the docs: White space acts as an AND operator, while a single pipe (|)
// character acts as an OR operator.
// in my case, i need to do some transformation as i want spaces for ors and + for ands
export function prepareSearch(search: string) {
  return search.replace(' ', '|').replace('+', ' ')
}
