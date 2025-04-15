import { SelectedChampion } from "~/lib/types/tft";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "lucide-react";
import {
  ChampionCardCost,
  championCardCostClassName,
} from "./ChampionCardCost";
import { StarLevel } from "./StarLevel";

type ActionsProps =
  | {
      canEdit?: false;
      champion: SelectedChampion;
      canMoveUp?: boolean;
      canMoveDown?: boolean;
      onMoveUp?: () => void;
      onMoveDown?: () => void;
      onUpdateStarLavel?: (starLevel: number) => void;
      onRemove?: () => void;
    }
  | {
      canEdit?: true;
      champion: SelectedChampion;
      canMoveUp: boolean;
      canMoveDown: boolean;
      onMoveUp: () => void;
      onMoveDown: () => void;
      onUpdateStarLavel: (starLevel: number) => void;
      onRemove: () => void;
    };

function Actions({
  champion,
  canEdit,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onUpdateStarLavel,
  onRemove,
}: ActionsProps) {
  return (
    <div className="flex flex-row gap-2">
      <StarLevel
        starLevel={champion.starLevel}
        onUpdateStarLevel={canEdit ? onUpdateStarLavel : undefined}
      />
      {canEdit && (
        <>
          <Button
            size="icon"
            variant="neutral"
            disabled={!canMoveUp}
            onClick={onMoveUp}
          >
            <ChevronUpIcon />
          </Button>
          <Button
            size="icon"
            variant="neutral"
            disabled={!canMoveDown}
            onClick={onMoveDown}
          >
            <ChevronDownIcon />
          </Button>
          <Button size="icon" variant="danger" onClick={onRemove}>
            <TrashIcon />
          </Button>
        </>
      )}
    </div>
  );
}

export function ChampionCard(props: ActionsProps) {
  const { cost, tileIcon, name, traits } = props.champion;

  return (
    <div className="relative select-none @container">
      <ChampionCardCost cost={cost} />
      <figure
        data-cost={cost}
        className={cn(
          "overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow flex flex-row items-stretch",
          championCardCostClassName
        )}
      >
        <img
          className="w-24 @2xl:w-16 aspect-1/1"
          src={tileIcon}
          alt="image"
          loading="lazy"
        />
        <figcaption className="border-l-2 text-white border-border p-1 @2xl:p-2 flex flex-col @2xl:flex-row justify-around @2xl:justify-between basis-full">
          <div className="flex flex-row @2xl:flex-col gap-4 @2xl:gap-1">
            <p className="font-bold text-md text-white">{name}</p>
            <ul className="flex flex-row flex-wrap gap-4">
              {traits.map((trait) => (
                <li
                  key={trait.name}
                  className="flex flex-row items-center gap-1"
                >
                  <img
                    src={trait.icon}
                    className="w-4 aspect-square"
                    loading="lazy"
                    alt={name}
                  />
                  <p className="text-white text-sm">{trait.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <Actions {...props} />
        </figcaption>
      </figure>
    </div>
  );
}
