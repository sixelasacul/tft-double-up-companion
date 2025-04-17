import { PlayableChampion } from "~/lib/types/tft";

export type GroupBy = "none" | "cost" | "trait";
type GroupedChampion = Record<string, PlayableChampion[]>;

export function groupChampion(
  champions: PlayableChampion[],
  by: GroupBy
): GroupedChampion {
  if (by === "cost") {
    return Object.groupBy(
      champions,
      (champion) => `${champion.cost}-cost`
    ) as GroupedChampion;
  }

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
