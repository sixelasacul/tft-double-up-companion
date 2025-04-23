import { PlayableChampion } from "~/lib/types/tft";

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\w]/g, "");
}

type Search = (string | string[])[];

export function prepareSearch(search: string): Search {
  return search
    .trim()
    .split(" ")
    .map((group) => {
      const splitted = group.split("+");
      return group.length > 1 ? splitted : splitted[0];
    });
}

// could use some fuzzy match library like fuse.js or uFuzzy
function unionMatch({ name, traits }: PlayableChampion, term: string) {
  const matchesName = normalize(name).includes(term);
  const matchesTraits = traits.some((trait) =>
    normalize(trait.name).includes(term)
  );
  return matchesName || matchesTraits;
}

function intersectionMatch(champion: PlayableChampion, terms: string[]) {
  return terms.every((term) => unionMatch(champion, term));
}

// in theory, fuse.js should be able to help with the extended search, but
// it's buggy, so here's a simplified solution
export function matchesByNameOrTraits(
  champion: PlayableChampion,
  search: Search
) {
  return search.some((terms) => {
    if (Array.isArray(terms)) {
      return intersectionMatch(champion, terms);
    }
    return unionMatch(champion, terms);
  });
}
