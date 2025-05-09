# TFT Double up companion

A simple, efficient website to share and keep track in real time of champions you and your partner are looking for during Team Fight Tactics Double up games. Especially useful for people that have difficulties memorizing what others are looking for while still playing, or when playing with more people in voice chat than your partner.

Built with:

- [Ably](https://ably.com/) for web sockets
- [CommunityDragon](https://www.communitydragon.org/) for the game assets
- [TanStack Start](https://tanstack.com/start/latest) for the [React](https://react.dev/) framework
- [Neobrutalism](https://www.neobrutalism.dev/) for an opinionated style using [TailwindCSS](https://tailwindcss.com/) and [ShadCN](https://ui.shadcn.com/) registry
- [Vercel](https://vercel.com) for the deployment platform

## Notes

- should use better auth and have anonymous login to have some rate-limiting? probably not needed for now
- since I can't use Ably Realtime in SSR, is Start really needed? I could just deploy a function wherever I can
  - downside of this is that the function will depend on which hosting solution I use
- how the search should behave depending on the filters? and should we filter this way?
- what about SSE using TS Start instead of WebSockets using Ably? would need some kind of history too

## TODO

- eslint, prettier, lint-staged
- drag'n'drop (dnd-kit) for
  - champion priority
  - from grid to list
- larger champion list item
- champion grid selected style

- update colors

- add a quick about page, to state that it's using some riot assets through community dragon
  - probably using the same verbiage btw
    - CommunityDragon was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
  - + some more explanations on how to use the tool perhaps?
  - link in header
