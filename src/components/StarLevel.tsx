import { cn } from "~/lib/utils";
import Star8 from "./stars/s8";

type StarProps = {
  className?: string;
  canEdit?: boolean;
  isEnabled?: boolean;
  onClick: () => void;
};

function Star({ className, canEdit, isEnabled, onClick }: StarProps) {
  return (
    <Star8
      data-state={isEnabled ? "on" : "off"}
      className={cn(
        "h-10 stroke-black stroke-8 text-main data-[state=on]:text-star",
        canEdit && "hover:text-star-muted",
        className
      )}
      onClick={onClick}
    />
  );
}

type StarLevelProps = {
  starLevel?: number;
  canEdit?: boolean;
  onUpdateStarLevel?: (starLevel: number) => void;
};

export function StarLevel({
  starLevel = 1,
  canEdit = false,
  onUpdateStarLevel,
}: StarLevelProps) {
  return (
    <div className="flex flex-row">
      <Star
        isEnabled={starLevel >= 1}
        onClick={() => onUpdateStarLevel?.(1)}
        className={cn(canEdit && "peer/1")}
      />
      <Star
        isEnabled={starLevel >= 2}
        onClick={() => onUpdateStarLevel?.(2)}
        // peer are used to apply style based on previous elements
        // e.g.: when star level is 3, and we want 1, then 2 and 3 will change colors
        // [&:has(~:hover)] is used to apply style based on next elements
        // e.g.: when star level is 1, and we want 3, then 2 and 3 will change
        className={cn(
          canEdit &&
            "peer/2 peer-hover/1:data-[state=on]:text-star-muted [&:has(~:hover)]:data-[state=off]:text-star-muted"
        )}
      />
      <Star
        isEnabled={starLevel >= 3}
        onClick={() => onUpdateStarLevel?.(3)}
        className={cn(
          canEdit &&
            "peer-hover/1:data-[state=on]:text-star-muted peer-hover/2:data-[state=on]:text-star-muted"
        )}
      />
    </div>
  );
}
