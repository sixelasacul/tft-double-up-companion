import { useMemo, useState } from "react";
import { PlayableChampion } from "~/lib/types/tft";
import { matchesByNameOrTraits, prepareSearch } from "./utils";

export function useChampionSearch(champions: PlayableChampion[]) {
  const [search, setSearch] = useState("");

  const preparedChampions = useMemo(() => {
    if (search === "") return champions;
    const preparedSearch = prepareSearch(search);

    return champions.filter((champion) =>
      matchesByNameOrTraits(champion, preparedSearch)
    );
  }, [champions, search]);

  return { search, setSearch, preparedChampions };
}
