import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../index.css?url";
import { ThemeProvider, useTheme } from "~/contexts/Theme";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TFT Double up Companion",
      },
      {
        name: "description",
        content:
          "A simple, efficient website to share and keep track in real time of champions you and your partner are looking for during Team Fight Tactics Double up games.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
      {
        rel: "stylesheet",
        // can be scaled down to what i need
        href: "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const [theme] = useTheme();
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body data-theme={theme} className="bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
