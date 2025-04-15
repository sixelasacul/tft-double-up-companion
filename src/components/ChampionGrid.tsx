import { PlayableChampion } from "~/lib/types/tft";
import { ChampionCard } from "./ChampionCard";
import { useMemo, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type GroupBy = "cost" | "trait";

type GroupedChampion<TGroup extends string | number> = Record<
  TGroup,
  PlayableChampion[]
>;

function groupChampion<
  TBuy extends GroupBy,
  TGroup extends string | number = TBuy extends "cost" ? number : string
>(champions: PlayableChampion[], by: GroupBy): GroupedChampion<TGroup> {
  if (by === "cost") {
    return Object.groupBy(
      champions,
      (champion) => `${champion.cost}-cost`
    ) as GroupedChampion<TGroup>;
  }

  return champions.reduce((acc, champion) => {
    for (const trait of champion.traits) {
      acc[trait.name] = [...(acc[trait.name] ?? []), champion];
    }
    return acc;
  }, {} as GroupedChampion<TGroup>);
}

type ChampionListProps = {
  champions: PlayableChampion[];
  onChampionClick?: (champion: PlayableChampion) => void;
};

export function ChampionGrid({
  champions,
  onChampionClick,
}: ChampionListProps) {
  // can be debounced
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<GroupBy>("cost");
  const preparedChampions = useMemo(() => {
    const filtered = champions.filter((champion) => {
      const matchesName = champion.name.toLocaleLowerCase().startsWith(search);
      const matchesTraits = champion.traits.some((trait) =>
        trait.name.toLocaleLowerCase().startsWith(search)
      );
      return matchesName || matchesTraits;
    });

    const grouped = groupChampion(filtered, group);
    return Object.entries(grouped).filter(([key, champions]) => {
      if (group === "trait") {
        return key.toLowerCase().startsWith(search);
      }
      return champions.some((champion) => {
        return champion.name.toLowerCase().startsWith(search);
      });
    });
  }, [champions, search, group]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row gap-1 p-2 border-b-2 border-border">
        <Input
          className="h-12"
          placeholder={
            group === "cost" ? "Search champion..." : "Search trait..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ToggleGroup
          type="single"
          value={group}
          onValueChange={(value) =>
            setGroup(value === "" ? group : (value as GroupBy))
          }
        >
          <ToggleGroupItem value="cost">By cost</ToggleGroupItem>
          <ToggleGroupItem value="trait">By trait</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <ScrollArea>
        <ul className="flex flex-col gap-2">
          {preparedChampions.map(([groupName, champions]) => (
            <li
              key={groupName}
              className="border-b-2 border-border last:border-b-0 pb-4 px-2"
            >
              <p className="text-xl">{groupName}</p>
              <ul className="flex flex-row gap-4 flex-wrap">
                {champions.map((champion) => (
                  <li key={champion.name}>
                    <ChampionCard
                      champion={champion}
                      onClick={() => onChampionClick?.(champion)}
                    />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
