import { PlayableChampion } from "~/lib/types/tft";
import { ChampionCard } from "./ChampionCard";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { cn } from "~/lib/utils";
import { GroupBy, useChampionSearch } from "~/lib/hooks/useChampionSearch";

const PLACEHOLDER_MAP: { [key in GroupBy]: string } = {
  none: "Search champion or trait...",
  cost: "Search champion...",
  trait: "Search trait...",
};

type ChampionListProps = {
  champions: PlayableChampion[];
  onChampionClick?: (champion: PlayableChampion) => void;
};

export function ChampionGrid({
  champions,
  onChampionClick,
}: ChampionListProps) {
  const [group, setGroup] = useState<GroupBy>("none");
  const { search, setSearch, preparedChampions } = useChampionSearch({
    champions,
    group,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row gap-1 p-2 border-b-2 border-border">
        <Input
          className="h-12"
          placeholder={PLACEHOLDER_MAP[group]}
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
          <ToggleGroupItem value="none">None</ToggleGroupItem>
          <ToggleGroupItem value="cost">By cost</ToggleGroupItem>
          <ToggleGroupItem value="trait">By trait</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <ScrollArea>
        <ul className={cn("flex flex-col gap-2", group === "none" && "pt-2")}>
          {preparedChampions.map(([groupName, champions]) => (
            <li
              key={groupName}
              className="border-b-2 border-border last:border-b-0 pb-4 px-2"
            >
              {group !== "none" && <p className="text-xl">{groupName}</p>}
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
