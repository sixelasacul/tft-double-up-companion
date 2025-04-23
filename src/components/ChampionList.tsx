import { SelectedChampion } from "~/lib/types/tft";
import { SelectedChampionCard } from "./SelectedChampionCard";
import { PropsWithChildren } from "react";

type ChampionListProps = {
  champions: SelectedChampion[];
};

type YourChampionListProps = ChampionListProps & {
  onMove: (champion: SelectedChampion, index: number) => void;
  onRemove: (champion: SelectedChampion) => void;
  onUpdateStarLavel: (champion: SelectedChampion, starLevel: number) => void;
};

function ChampionListContainer({ children }: PropsWithChildren) {
  return <ul className="flex flex-col gap-4 pb-2">{children}</ul>;
}
function ChampionListItemContainer({ children }: PropsWithChildren) {
  return <li className="px-2">{children}</li>;
}

export function YourChampionList({
  champions,
  onMove,
  onRemove,
  onUpdateStarLavel,
}: YourChampionListProps) {
  return (
    <ChampionListContainer>
      {champions.map((champion, index) => (
        <ChampionListItemContainer key={champion.name}>
          <SelectedChampionCard
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
        </ChampionListItemContainer>
      ))}
    </ChampionListContainer>
  );
}

export function PartnersChampionList({ champions }: ChampionListProps) {
  return (
    <ChampionListContainer>
      {champions.map((champion) => (
        <ChampionListItemContainer key={champion.name}>
          <SelectedChampionCard champion={champion} />
        </ChampionListItemContainer>
      ))}
    </ChampionListContainer>
  );
}

export function LoadingChampionList() {
  return (
    <ChampionListContainer>
      <ChampionListItemContainer>
        <SelectedChampionCard.Loading />
      </ChampionListItemContainer>
    </ChampionListContainer>
  );
}
