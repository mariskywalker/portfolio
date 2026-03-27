# BRIEF, Casa do Urso Case Page
## Para o Cursor: construir a página de case `casa-do-urso-case.html`

---

## Contexto

Tenho um portfólio Next.js com um sistema de drawers por projeto (PokerBros, Comics, Trident, Casa do Urso).

**Drawer Casa do Urso (Next.js):** no `HomeSystem.tsx` a navegação lateral usa **6 secções**, Overview, Challenge, Tato, Process, Outcome, Deliverables, alinhadas a este brief (faixa de cor no painel, pull quote, bloco Tato, `casaProcessSections`, outcome com iframes/vídeo, grelha de deliverables).
Cada projeto já tem a sua drawer no `HomeSystem.tsx`.

A Mari já criou pages HTML estáticas de case para os outros projetos (Comics, Trident, PokerBros).
Agora preciso criar a mesma coisa para **Casa do Urso**, uma página HTML standalone, autossuficiente, sem dependências externas, com todas as imagens inline ou referenciadas de `/public`.

O arquivo de output é: `public/casa-do-urso-case.html`  
(ou pode ser uma rota Next.js em `app/projects/casadourso/page.tsx`, ver nota no final)

---

## O que já existe no repo que DEVE ser reaproveitado

### Conteúdo (texto)
Todo o copy já está em `HomeSystem.tsx` como `casaDoUrsoContent`:

```ts
casaDoUrsoContent.overview   // o que é o projeto
casaDoUrsoContent.problem    // o desafio + Tato
casaDoUrsoContent.process    // Color System, Spatial, Interaction, Sensory, System
casaDoUrsoContent.outcome    // resultado final
```

Copiar o texto dessas variáveis diretamente para a página.

### Estrutura visual do processo (`casaProcessSections`)
Também em `HomeSystem.tsx`. Tem estes blocos, nesta ordem:

1. Texto introdutório sem título
2. **Color System**, `colorSwatches` com 4 ícones (Asterisk/School `#f5c042`, Heart/Clinic `#f97472`, House/Family `#44a0c4`, Bear/Methodology `#cd9459`) + nota sobre building toys
3. **Spatial Thinking**, `spatialGrafismos` com:
   - `colorBlocks`: Candy `#E8858A`, Sky Blue `#4497C3`, Yellow `#F5BF42`, Mint `#5DC198`, Navy `#032E4D`
   - `heroImage`: `/Fotos da clinica/_DSCcorredor.png`
   - 4 pilares com grafismos: Emocional `/grafismo-emocional.png`, Social `/grafismo-social.png`, Communication `/grafismo-comunicacao.png` (sem acento no filename), Autonomia `/grafismo-autonomia.png`
4. **Interaction Language**, só texto (sem media no `HomeSystem.tsx`)
5. **Sensory Design**, `mediaSlider` com:
   `/Fotos e videos clinica/IMG_1738.MOV` (vídeo), `/Fotos da clinica/_DSC3876-ALTA.JPG`, `/Fotos da clinica/_DSC3854-ALTA.JPG`
6. **System Thinking**, `customCanvas` com iframe de `/grovia-cards.html`

> **Nota:** O vídeo `/anderson e tato.mp4` e `/capa-so-evolucao.png` estão na secção **Problem** da drawer (não no Sensory slider). Ajustar a página HTML conforme quiseres narrar.

### Assets de mídia (todos em `/public`)
```
/casadourso-cover.png         , hero / overview  
/casadourso-scene-2.mp4       , overview video loop  
/icones.svg                   , sparkles aside (Activation → Calm)
/icones_casadourso.svg        , decoração de fundo (semi-transparente)
/capa-so-evolucao.png         , section Problem (imagem estática)
/anderson e tato.mp4          , section Process / Sensory
/Fotos da clinica/_DSCcorredor.png
/Fotos da clinica/_DSC3876-ALTA.JPG
/Fotos da clinica/_DSC3854-ALTA.JPG
/grafismo-emocional.png
/grafismo-social.png
/grafismo-comunicacao.png
/grafismo-autonomia.png
/grovia-cards.html            , iframe (System Thinking)
/casa-urso-counter.html       , iframe (Outcome)
/webcasadourso.mp4            , vídeo final (Outcome)
```

### Componentes que podem ser portados para HTML puro
- `DrawerCasaHeader.tsx` → SVG animado do logo com grid lines (animação draw-in via `stroke-dashoffset`)
- `ClinicImageSlider.tsx` → slider simples com `setInterval` + `transform: translateX`
- `MediaSlider.tsx` → slider que suporta `video` e `image`, com play/pause automático
- `SensoryIconSparkles` → efeito de partículas no hover (opcional, se quiser incluir)

---

## Design System da página

### Cores (do `HomeSystem.tsx`, branch `casa`)
```css
--sand:    #e8dddd;   /* fundo principal (aside e painel direito) */
--sand2:   #f0e8e2;   /* fundo hover / secundário */
--sand3:   #f7f2ee;   /* fundo mais claro */
--warm:    #c9a882;   /* accent / labels / regras */
--brown:   #6b3f2a;   /* texto dark / botão primário */
--forest:  #3a5c3a;   /* tag verde */
--navy:    #032E4D;   /* cor do logo SVG */
--border:  rgba(107,63,42,.15);
```

Cores dos 4 pilares / espectro:
```
Amarelo:   #F5BF42  (Asterisk / School)
Rosa:      #F9746E  (Heart / Clinic)
Azul:      #4497C3  (House / Family)
Caramelo:  #CD995B  (Bear / Methodology)
```

### Tipografia
- **DM Serif Display** (serif), títulos grandes, pull quotes, nomes (igual ao `casa-do-urso-case.html` já gerado pelo Claude)
- **DM Sans**, body text
- `font-mono` do Tailwind equivale a `font-family: monospace`, usado em labels uppercase, process sections

### Fonte-tamanho mínimo: 13px em todo o arquivo (regra já aplicada nos outros cases)

### Tom visual
- Quente, orgânico, terapêutico
- Sem arestas duras, `border-radius` suaves
- Background `#e8dddd` (o mesmo da drawer do projeto)
- Transições suaves, nada agressivo

---

## Estrutura da página (seções, nesta ordem)

```
1. NAV fixo
  , logo 🐻 + "Casa do Urso"
  , links de âncora: Challenge / Tato / Process / Outcome
  , ← Portfolio

2. COLOUR STRIP
  , faixa horizontal de 6px com as 4 cores do espectro (como as outras pages)

3. HERO (grid 2 colunas)
  , esquerda: eyebrow, título serif, regra, descrição, tags, scroll
  , direita: /casadourso-cover.png ou o vídeo /casadourso-scene-2.mp4 em loop

4. OVERVIEW
  , DrawerCasaHeader SVG animado (porto do .tsx, ver abaixo)
  , texto de casaDoUrsoContent.overview
  , vídeo /casadourso-scene-2.mp4

5. PROBLEM / CHALLENGE
  , texto de casaDoUrsoContent.problem
  , imagem /capa-so-evolucao.png
  , pull quote: "Tato transforms the brand from something seen into something felt and trusted."

6. TATO BLOCK (grid 2 colunas)
  , esquerda: fundo amarelo-caramelo com padrão halftone, imagem/animação do Tato
  , direita: nome, descrição, lista de traits

7. PROCESS (casaProcessSections, os 6 blocos em sequência)
   - Intro text
   - Color System: 4 swatches com ícones SVG
   - Spatial Thinking: color blocks + corredor + grafismos dos pilares
   - Interaction Language: texto apenas
   - Sensory Design: MediaSlider (vídeo da clínica + 2 fotos, ver `casaProcessSections` no código)
   - System Thinking: iframe /grovia-cards.html

8. OUTCOME
  , iframe /casa-urso-counter.html
  , texto de casaDoUrsoContent.outcome
  , vídeo /webcasadourso.mp4

9. DELIVERABLES (grid 2×3)
  , 6 items: Naming, Visual Identity, Tato, Environmental Design, Inclusive Signage, Emocionário

10. CLOSING
   , 🐻 animado (float)
   , título serif
   , CTAs: "View on Framer ↗" + "← Portfolio"

11. FOOTER
```

---

## Como portar o DrawerCasaHeader SVG

O SVG já está no `DrawerCasaHeader.tsx`, é um SVG inline com o logo completo da Casa do Urso em caminhos SVG (cor `#032E4D` para as letras e complementos coloridos do urso).

Para a página HTML:
1. Copiar o SVG inline diretamente
2. A animação draw-in usa `stroke-dashoffset` em elementos com `[data-grid-line]`:
   - Pegar todos os elementos com `data-grid-line`
   - Calcular `getTotalLength()`
   - Animar `strokeDashoffset` de `length` → `0` com `CSS animation` ou Web Animations API
   - Stagger: `delay = index * 0.03s`
   - Duração: `2s` por ciclo (draw in + draw out com `alternate`)

---

## Como portar o ClinicImageSlider

```html
<!-- HTML -->
<div class="clinic-slider" style="overflow:hidden;position:relative">
  <div class="clinic-track" style="display:flex;transition:transform 0.5s cubic-bezier(0.22,1,0.36,1)">
    <img src="/Fotos da clinica/_DSC3876-ALTA.JPG" ...>
    <img src="/Fotos da clinica/_DSC3854-ALTA.JPG" ...>
    <!-- etc -->
  </div>
</div>
```
```js
// JS
let idx = 0;
setInterval(() => {
  idx = (idx + 1) % total;
  track.style.transform = `translateX(-${idx * 100}%)`;
}, 4000);
```

---

## Como portar o MediaSlider (vídeo + imagem)

Igual ao ClinicImageSlider, mas com suporte a `<video>`:
- Quando o slide for vídeo: `<video loop muted playsinline autoplay>`
- Pausar vídeos não-ativos, dar play no ativo
- `aspectRatio: 16/9`

---

## Nota sobre entrega: HTML vs Next.js page

**Opção A (preferida para consistência com os outros cases):**
Arquivo `public/casa-do-urso-case.html`, standalone, abrível diretamente.
Referências a assets: caminhos relativos `/assets/...` ou `/...` dependendo de onde servir.

**Opção B (se quiser integração com o router):**
`app/projects/casadourso/page.tsx`, componente React, pode importar os componentes existentes (`DrawerCasaHeader`, `ClinicImageSlider`, `MediaSlider`) diretamente em vez de portá-los.
Vantagem: pode reutilizar o `casaDoUrsoContent` e `casaProcessSections` do `HomeSystem.tsx`, mover essas constantes para `lib/casa-content.ts` e importar em ambos os lugares.

---

## Checklist de qualidade

- [ ] Todas as fontes carregam (DM Serif Display + DM Sans via Google Fonts)
- [ ] Fundo `#e8dddd` consistente com a drawer
- [ ] Font-size mínimo 13px em todo o arquivo
- [ ] DrawerCasaHeader SVG anima no load (grid lines draw-in)
- [ ] ClinicImageSlider funciona (fotos da clínica)
- [ ] MediaSlider com vídeo `/anderson e tato.mp4` funciona
- [ ] iframe `/grovia-cards.html` aparece na seção System Thinking
- [ ] iframe `/casa-urso-counter.html` aparece na seção Outcome
- [ ] Vídeo `/webcasadourso.mp4` aparece no Outcome
- [ ] Vídeo `/casadourso-scene-2.mp4` no hero
- [ ] Progress bar no topo
- [ ] Nav com scroll spy (active section)
- [ ] Smooth scroll nas âncoras
- [ ] Seções animam com IntersectionObserver ao entrar na viewport
- [ ] 4 cores do espectro na colour strip do topo
- [ ] Responsive: mobile 1 coluna

---

## Referência visual

Quando existir, usar `casa-do-urso-case.html` como referência de layout, tipografia e tom.
*(Ainda não está no repo, é o output deste brief.)*

A página dos outros projetos (Comics, Trident, PokerBros) segue o mesmo padrão estrutural
consultar esses arquivos para manter consistência no sistema.

---

*Brief gerado com base nos arquivos: `HomeSystem-casa-data-and-renderCasaProcessSections.txt`, `HomeSystem-drawer-shell-casa-branches.txt`, `DrawerCasaHeader.tsx`, `ClinicImageSlider.tsx`, `MediaSlider.tsx`, `useDrawerScroll.ts`, `HomeSystem-casaFields.txt`, `HomeSystem-projects-casa-entry.txt`, `HomeSystem-activeDrawerCopy-casa.txt`, `README.md`.*
