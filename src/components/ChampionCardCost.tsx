import { cn } from "~/lib/utils";

export const championCardCostClassName =
  "data-[cost=1]:bg-cost-1 data-[cost=2]:bg-cost-2 data-[cost=3]:bg-cost-3 data-[cost=4]:bg-cost-4 data-[cost=5]:bg-cost-5";

type ChampionCostProps = {
  cost: number;
};

export function ChampionCardCost({ cost }: ChampionCostProps) {
  return (
    <div
      data-cost={cost}
      className={cn(
        "absolute top-0 left-0 z-10 text-white font-bold rounded-br-base rounded-tl-base w-6 h-6 flex items-center justify-center border-2 border-border transition-all group-hover:translate-x-boxShadowX group-hover:translate-y-boxShadowY",
        championCardCostClassName
      )}
    >
      {cost}
    </div>
  );
}
