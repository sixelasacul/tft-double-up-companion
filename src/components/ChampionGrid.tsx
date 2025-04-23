import { PlayableChampion } from "~/lib/types/tft";
import { ChampionCard } from "./ChampionCard";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { useChampionSearch } from "~/lib/hooks/useChampionSearch";

type ChampionListProps = {
  champions: PlayableChampion[];
  onChampionClick?: (champion: PlayableChampion) => void;
};

export function ChampionGrid({
  champions,
  onChampionClick,
}: ChampionListProps) {
  const { search, setSearch, preparedChampions } = useChampionSearch(champions);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col p-2 border-b-2 border-border">
        <Input
          className="h-12"
          placeholder="Search champion or trait..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="text-sm font-base text-foreground">
          Use spaces to search for either of the words. Use + to search for a
          combination of the words.
        </p>
      </div>
      <ScrollArea>
        <ul className="flex flex-row gap-4 flex-wrap p-2">
          {preparedChampions.map((champion) => (
            <li key={champion.name}>
              <ChampionCard
                champion={champion}
                onClick={() => onChampionClick?.(champion)}
              />
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
