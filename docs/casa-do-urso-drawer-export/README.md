# Casa do Urso — export para replicar a drawer

Este pacote reúne **texto, dados, componentes e trechos do `HomeSystem.tsx`** usados na drawer do projeto **Casa do Urso** no portfolio Next.js.

## Onde está o código “oficial”

| Ficheiro | Conteúdo |
|----------|----------|
| `app/home/HomeSystem.tsx` | Drawer (layout 2 colunas), `casaDoUrsoContent`, `casaProcessSections`, `renderCasaProcessSections()`, `casaFields`, ramos `selectedProject.id === "casa"`, `SensoryIconSparkles` |
| `app/home/components/DrawerCasaHeader.tsx` | Logo SVG + grelha animada + subtítulo “Casa do Urso® — Grid System” |
| `app/home/components/ClinicImageSlider.tsx` | Slider de imagens (usado em process media tipo `imageSlider`) |
| `app/home/components/MediaSlider.tsx` | Slider imagem/vídeo (Snoezelen / clínica) |
| `app/home/components/CasaDoUrsoFileCaseSection.tsx` | Secção tipo “file case” + painel de filtros (pode não estar importada no `HomeSystem` atual — existe no repo) |
| `app/home/components/CasaUrsoEmbed.tsx` | iframe do case + scroll para âncoras internas |

## Ficheiros nesta pasta (cópias / extracts)

- **`DrawerCasaHeader.tsx`** — componente completo.
- **`CasaUrsoEmbed.tsx`** — componente completo.
- **`CasaDoUrsoFileCaseSection.tsx`** — componente completo.
- **`ClinicImageSlider.tsx`**, **`MediaSlider.tsx`** — completos.
- **`HomeSystem-casa-data-and-renderCasaProcessSections.txt`** — extract de `HomeSystem.tsx` (linhas ~310–651): `casaDoUrsoContent`, `casaProcessSections`, `renderCasaProcessSections`.
- **`HomeSystem-SensoryIconSparkles.txt`** — componente inline sparkles (~linhas 27–152).
- **`HomeSystem-drawer-shell-casa-branches.txt`** — extract da drawer: aside + painel direito com ramos Casa (~linhas 1159–1490).
- **`HomeSystem-casaFields.txt`** — `casaFields`.
- **`HomeSystem-projects-casa-entry.txt`** — entrada do projeto no array `projects` (cover, vídeo).
- **`HomeSystem-activeDrawerCopy-casa.txt`** — ramo `activeDrawerCopy` para `casa`.

## Dependências (stack)

- **React** + **Next.js** (`"use client"` onde aplicável)
- **framer-motion** (`AnimatePresence`, `motion`)
- **Tailwind CSS** (classes `font-mono`, `bg-[#e8dddd]`, etc.)

## Imports relevantes no `HomeSystem.tsx`

```tsx
import { DrawerCasaHeader } from "./components/DrawerCasaHeader";
import { ClinicImageSlider } from "./components/ClinicImageSlider";
import { MediaSlider } from "./components/MediaSlider";
import { CasaUrsoEmbed } from "./components/CasaUrsoEmbed";
import { useDrawerScroll, type DrawerSection } from "./components/useDrawerScroll";
```

## Assets públicos referenciados (copiar para `/public`)

Coloca estes paths na raiz de `public/` (ou ajusta os URLs no código):

- `/casadourso-cover.png`, `/casadourso-scene-2.mp4` — hero overview na drawer
- `/icones.svg` — sparkles na aside
- `/icones_casadourso.svg` — usado em `CasaDoUrsoFileCaseSection`
- `/capa-so-evolucao.png`, `/anderson%20e%20tato.mp4` — secção Problem
- `/Fotos da clinica/_DSCcorredor.png`, `/grafismo-*.png` (emocional, social, comunicação, autonomia)
- `/Fotos e videos clinica/IMG_1738.MOV`, `/Fotos da clinica/_DSC3876-ALTA.JPG`, `_DSC3854-ALTA.JPG`
- `/grovia-cards.html` — iframe no process (System Thinking)
- `/casa-urso-counter.html` — iframe no Outcome
- `/webcasadourso.mp4` — vídeo no Outcome

Opcional (outro ficheiro no repo, não na lista acima): `ProjectDrawerObserver` usa `/casadourso-process-corrected-final.mp4` quando process + casa.

## Comportamento da drawer (Casa)

- **Aside** fundo `#e8dddd`, texto preto: número do projeto, `DrawerCasaHeader`, bloco “Activation → Calm” + `SensoryIconSparkles`, navegação Overview / Problem / Tato / Process / Outcome / Deliverables.
- **Painel direito** mesmo fundo: secções com scroll e animação vertical (`useDrawerScroll`); Process usa `renderCasaProcessSections()` (swatches de cor, grafismos espaciais, media slider, iframe grovia); Problem tem imagem + vídeo; Tato renderiza vídeo com chroma-key; Outcome tem iframe counter + texto + vídeo web; Deliverables tem grid final.

## Como usar com o Claude

1. Anexa esta pasta **inteira** ou cola o conteúdo dos `.tsx` + dos `.txt` num único documento.
2. Indica que queres **Next.js + Tailwind + framer-motion** e o mesmo layout de drawer (70vw / 66.666vw).
3. O hook **`useDrawerScroll.ts`** está incluído nesta pasta (cópia do repo).

---

*Gerado a partir do repo `mari-portfolio`.*
