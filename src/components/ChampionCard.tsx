import { PlayableChampion } from "~/lib/types/tft";
import { cn } from "~/lib/utils";
import {
  ChampionCardCost,
  championCardCostClassName,
} from "./ChampionCardCost";
import { useState } from "react";

type ChampionCardProps = {
  champion: PlayableChampion;
  onClick?: () => void;
};

export function ChampionCard({ champion, onClick }: ChampionCardProps) {
  const { cost, tileIcons, name, traits } = champion;
  const [tileIconIndex, setTileIconIndex] = useState(0)

  function loadNextTileIcon() {
    if (tileIconIndex < tileIcons.length - 1) {
      setTileIconIndex(prev => prev + 1)
    }
  }

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
            src={tileIcons[tileIconIndex]}
            alt={name}
            loading="lazy"
            onError={loadNextTileIcon}
          />
          <ul className="flex flex-col flex-wrap gap-1 absolute bottom-0 left-0 right-0 py-1 bg-black/50">
            {traits.map((trait) => (
              <li key={trait.name} className="flex flex-row items-center gap-1">
                <img
                  src={trait.icon}
                  className="w-4 aspect-square"
                  loading="lazy"
                />
                <p className="text-white font-bold text-sm leading-none">
                  {trait.name}
                </p>
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
