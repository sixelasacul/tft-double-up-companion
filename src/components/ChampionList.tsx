import { SelectedChampion } from "~/lib/types/tft";
import { ChampionCard } from "./SelectedChampionCard";

type ChampionListProps = {
  champions: SelectedChampion[];
};

type YourChampionListProps = ChampionListProps & {
  onMove: (champion: SelectedChampion, index: number) => void;
  onRemove: (champion: SelectedChampion) => void;
  onUpdateStarLavel: (champion: SelectedChampion, starLevel: number) => void;
};

export function YourChampionList({
  champions,
  onMove,
  onRemove,
  onUpdateStarLavel,
}: YourChampionListProps) {
  return (
    <ul className="flex flex-col gap-4 pb-2">
      {champions.map((champion, index) => (
        <li key={champion.name} className="px-2">
          <ChampionCard
            canEdit
            champion={champion}
            canMoveUp={index > 0}
            canMoveDown={index < champions.length - 1}
            onMoveUp={() => onMove(champion, index - 1)}
            onMoveDown={() => onMove(champion, index + 1)}
            onRemove={() => onRemove(champion)}
            onUpdateStarLavel={(starLevel) =>
              onUpdateStarLavel(champion, starLevel)
            }
          />
        </li>
      ))}
    </ul>
  );
}

export function PartnersChampionList({ champions }: ChampionListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {champions.map((champion) => (
        <li key={champion.name}>
          <ChampionCard champion={champion} />
        </li>
      ))}
    </ul>
  );
}
