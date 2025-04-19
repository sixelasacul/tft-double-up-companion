import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { PlayableChampion } from "~/lib/types/tft";
import {
  type GroupBy,
  groupChampion,
  matchesByNameOrTraits,
  prepareSearch,
} from "./utils";

export { type GroupBy };

type UseChampionSearchProps = {
  champions: PlayableChampion[];
  group: GroupBy;
};

export function useChampionSearch({
  champions,
  group,
}: UseChampionSearchProps) {
  const [search, setSearch] = useState("");
  const fuse = useMemo(
    () =>
      new Fuse(champions, {
        isCaseSensitive: false,
        threshold: 0.2,
        // allow to use " " for "and" and "|" for "or"
        useExtendedSearch: true,
        keys: ["name", "traits.name"],
      }),
    [champions]
  );

  // idk why it doesn't find mundo with "bruiser+slayer" but it does with "bruiser slayer"
  // also, will need to bring back grouping then (if it's still needed)
  const preparedChampions = useMemo(() => {
    if (search === "") return champions;
    const result = fuse.search(prepareSearch(search));
    return result.map(({ item }) => item);
    // const terms = search.trim().split(" ");
    // const filtered = champions.filter((champion) =>
    //   matchesByNameOrTraits(champion, terms)
    // );

    // const grouped = Object.entries(groupChampion(filtered, group));
    // return grouped.sort((first, second) => first[0].localeCompare(second[0]));
  }, [champions, search]);
  // const preparedChampions = useMemo(() => {
  //   const terms = search.trim().split(" ");
  //   const filtered = champions.filter((champion) =>
  //     matchesByNameOrTraits(champion, terms)
  //   );

  //   const grouped = Object.entries(groupChampion(filtered, group));
  //   return grouped.sort((first, second) => first[0].localeCompare(second[0]));
  // }, [champions, search, group]);

  return { search, setSearch, preparedChampions };
}
