import { PlayableChampion } from "~/lib/types/tft";
import { cn } from "~/lib/utils";
import {
  ChampionCardCost,
  championCardCostClassName,
} from "./ChampionCardCost";

type ChampionCardProps = {
  champion: PlayableChampion;
  onClick?: () => void;
};

export function ChampionCard({ champion, onClick }: ChampionCardProps) {
  const { cost, tileIcon, name, traits } = champion;
  return (
    // champion image is a 128px square
    <div
      className="relative group cursor-pointer select-none"
      role="button"
      onClick={onClick}
    >
      <ChampionCardCost cost={cost} />
      <figure
        data-cost={cost}
        className={cn(
          "overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow",
          "transition-all group-hover:translate-x-boxShadowX group-hover:translate-y-boxShadowY group-hover:shadow-none",
          championCardCostClassName
        )}
      >
        <div className="relative">
          <img
            className="w-32 aspect-1/1"
            src={tileIcon}
            alt={name}
            loading="lazy"
          />
          <ul className="flex flex-col flex-wrap absolute bottom-0 left-0 right-0 px-1 bg-black/50">
            {traits.map((trait) => (
              <li key={trait.name} className="flex flex-row items-center gap-1">
                <img
                  src={trait.icon}
                  className="w-4 aspect-square"
                  loading="lazy"
                />
                <p className="text-white font-bold text-sm">{trait.name}</p>
              </li>
            ))}
          </ul>
        </div>
        <figcaption className="border-t-2 text-white border-border p-1 w-32">
          <p className="font-bold text-md text-center">{name}</p>
        </figcaption>
      </figure>
    </div>
  );
}
