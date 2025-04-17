import { useMemo, useState } from "react";
import { PlayableChampion } from "~/lib/types/tft";
import { type GroupBy, groupChampion, matchesByNameOrTraits } from "./utils";

export { type GroupBy };

type UseChampionSearchProps = {
  champions: PlayableChampion[];
  group: GroupBy;
};

export function useChampionSearch({
  champions,
  group,
}: UseChampionSearchProps) {
  // can be debounced
  const [search, setSearch] = useState("");

  const preparedChampions = useMemo(() => {
    const terms = search.trim().split(" ");
    const filtered = champions.filter((champion) =>
      matchesByNameOrTraits(champion, terms)
    );

    const grouped = Object.entries(groupChampion(filtered, group));
    return grouped;
  }, [champions, search, group]);

  return { search, setSearch, preparedChampions };
}
