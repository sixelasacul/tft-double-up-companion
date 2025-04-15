import * as Ably from "ably";
import { AblyProvider } from "ably/react";
import { createFileRoute } from "@tanstack/react-router";
import { ChannelProvider } from "ably/react";
import { useRef } from "react";
import { createServerFn } from "@tanstack/react-start";
import {
  getAllDataForCurrentSet,
  getChampionImage,
  getTraitImage,
} from "~/lib/api/tft";
import { useLobbyState } from "~/lib/hooks/useLobbyState";
import {
  PartnersChampionList,
  YourChampionList,
} from "~/components/ChampionList";
import { Header } from "~/components/Header";
import { ChampionGrid } from "~/components/ChampionGrid";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SwapProvider, useSwap } from "~/contexts/Swap";

const getChampionsFn = createServerFn().handler(async () => {
  const result = await getAllDataForCurrentSet();
  if (result.isErr()) {
    throw result.error;
  }
  const { champions } = result.value;
  // remove unnecessary properties, less data to send
  const mappedChampions = champions
    .map((champion) => {
      const { cost, name, role, traits } = champion;
      return {
        cost,
        name,
        role,
        tileIcon: getChampionImage(champion),
        traits: traits.map((trait) => ({
          name: trait.name,
          icon: getTraitImage(trait),
        })),
      };
    })
    .sort((first, second) => first.name.localeCompare(second.name));
  return { champions: mappedChampions };
});

export const Route = createFileRoute("/$id")({
  component: LobbyWrapper,
  loader: async () => await getChampionsFn(),
  // I have to disable SSR for Ably, otherwise it causes a lot of warnings,
  // though I could use the Rest API to prefetch the content in SSR
  ssr: false,
});

function LobbyWrapper() {
  const { id } = Route.useParams();
  const ably = useRef(new Ably.Realtime({ authUrl: `/api/${id}/auth` }));
  return (
    <AblyProvider client={ably.current}>
      {/* rewind to get the last sent message and rehydrate state when (re-)joining a lobby */}
      <ChannelProvider channelName={id} options={{ params: { rewind: "1" } }}>
        <SwapProvider>
          <Lobby />
        </SwapProvider>
      </ChannelProvider>
    </AblyProvider>
  );
}

function Lobby() {
  const { id } = Route.useParams();
  const { champions } = Route.useLoaderData();
  const {
    lobbyState,
    updateSelectedChampions,
    updateChampionPriority,
    updateChampionStarLevel,
  } = useLobbyState(id);
  const [shouldSwap] = useSwap();

  const playersPanel = (
    <ResizablePanel defaultSize={33} minSize={33}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50} minSize={33}>
          <div className="flex flex-col h-full">
            <h2 className="text-center text-2xl">Yours</h2>
            <ScrollArea>
              <YourChampionList
                champions={lobbyState.you.champions}
                onMove={(champion, index) =>
                  updateChampionPriority(champion, index)
                }
                onRemove={(champion) => updateSelectedChampions(champion)}
                onUpdateStarLavel={(champion, starLevel) =>
                  updateChampionStarLevel(champion, starLevel)
                }
              />
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={33}>
          <div className="flex flex-col h-full">
            <h2 className="text-center text-2xl">Partner's</h2>
            <ScrollArea>
              <PartnersChampionList champions={lobbyState.partner.champions} />
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );

  const gridPanel = (
    <ResizablePanel defaultSize={67} minSize={33}>
      <ChampionGrid
        champions={champions}
        onChampionClick={(champion) =>
          updateSelectedChampions({
            ...champion,
            starLevel: 1,
          })
        }
      />
    </ResizablePanel>
  );

  const leftPanel = shouldSwap ? gridPanel : playersPanel;
  const rightPanel = shouldSwap ? playersPanel : gridPanel;

  return (
    <div className="h-screen flex flex-col font-mono">
      <Header />
      <ResizablePanelGroup direction="horizontal" autoSaveId="layout-sizes">
        {leftPanel}
        <ResizableHandle withHandle />
        {rightPanel}
      </ResizablePanelGroup>
    </div>
  );
}
