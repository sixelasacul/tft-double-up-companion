import { Link } from "@tanstack/react-router";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useClipboard } from "use-clipboard-copy";
import { Button } from "./ui/button";
import { Theme, useTheme } from "~/contexts/Theme";
import { cn } from "~/lib/utils";

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "dark") return <Moon />;
  if (theme === "light") return <Sun />;
  return <Monitor />;
}

function getNextTheme(theme: Theme): Theme {
  if (theme === "system") return "light";
  if (theme === "light") return "dark";
  return "system";
}

export function Header() {
  const [theme, setTheme] = useTheme();
  const { copy, copied } = useClipboard({ copiedTimeout: 750 });

  return (
    <div className="flex flex-row justify-between items-center border-b-2 border-border font-serif p-4">
      <div className="flex flex-row gap-4">
        <Button asChild>
          <Link to="/" reloadDocument>
            New lobby
          </Link>
        </Button>
        {/* using 1 cell grid as an easy way to stack elements without using position,
        to prevent size shift when changing text */}
        <Button
          onClick={() => {
            copy(window.location.href);
          }}
          className="grid grid-cols-1 grid-rows-1"
        >
          <span className={cn("col-1 row-1 visible", copied && "invisible")}>
            Share lobby
          </span>
          <span
            className={cn(
              "col-1 row-1 invisible mx-auto inline-flex flex-row items-center gap-2",
              copied && "visible"
            )}
          >
            <Check />
            Copied
          </span>
        </Button>
      </div>
      <h1 className="text-4xl">TFT Double up Companion</h1>
      <div className="flex flex-row gap-4">
        <Button size="icon" onClick={() => setTheme(getNextTheme(theme))}>
          <ThemeIcon theme={theme} />
        </Button>
        <Button size="icon" asChild>
          <a
            href="https://github.com/sixelasacul/tft-double-up-companion"
            target="_blank"
          >
            <SiGithub />
          </a>
        </Button>
      </div>
    </div>
  );
}
