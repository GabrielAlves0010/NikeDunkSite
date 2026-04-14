# NikeDunkSite

Landing page editorial do **Nike Dunk Low — Performance Series**. Experiencia cinematografica inspirada em Apple / Tesla, com scroll-driven frame playback, storytelling em dobras ricas e design system proprio (Playfair Display + Inter + Space Mono, accent teal).

## Stack

- HTML + CSS + JS puros (sem build step)
- Tailwind CSS via CDN
- GSAP 3.12 + ScrollTrigger
- Lenis (smooth scroll)
- Iconify (icones Solar)
- 192 frames JPEG (800x800) para scrub do video no canvas

## Estrutura

```
NikeDunkSite/
├── index.html              # marcacao principal (markup apenas)
├── design_system.html      # documentacao visual (tokens + componentes)
├── src/
│   ├── css/
│   │   └── styles.css      # todos os estilos do projeto
│   └── js/
│       └── main.js         # animacoes GSAP, Lenis, canvas scrub, toast
├── public/
│   ├── images/             # renders e fotos do produto
│   ├── frames/             # 192 frames do video para scrub
│   └── video/              # .mp4 original
├── scripts/
│   └── extract_frames.py   # regera os frames a partir do .mp4
├── vercel.json             # cache headers para assets estaticos
├── .gitignore
└── README.md
```

### Divisao de responsabilidades

| Arquivo | Conteudo |
|---|---|
| `index.html` | Markup + Tailwind config inline + referencias para `src/css` e `src/js` |
| `src/css/styles.css` | Reset, tipografia, glass-panel, animacoes customizadas, cartela dos mestres, ritual timeline, toast |
| `src/js/main.js` | Lenis, GSAP timelines, canvas frame scrub, ScrollTrigger, smooth scroll, handler do toast |

## Rodar localmente

Qualquer servidor estatico serve. Opcoes:

```bash
# Python
python -m http.server 5173

# Node
npx serve .

# PHP
php -S localhost:5173
```

Abra `http://localhost:5173`.

## Deploy (Vercel)

1. Push este repositorio no GitHub
2. Em [vercel.com](https://vercel.com) → **New Project** → importe o repo
3. Framework: **Other** (static)
4. Output Directory: `/` (raiz)
5. Deploy

Vercel serve o `index.html` da raiz automaticamente. As pastas `public/` sao servidas como estaticas.

## Re-extrair frames do video

Se trocar o `.mp4`, rode:

```bash
pip install imageio-ffmpeg
python scripts/extract_frames.py
```

O script gera 192 frames 800x800 em `public/frames/`.

## Secoes

1. **Hero pinado** — frame sequence scrub do video em canvas fullscreen
2. **Specs (DNA do design)** — engenharia, materiais, peso, certificacoes
3. **Ritual do artesao** — timeline horizontal com 6 estacoes + cartela dos mestres
4. **Ecossistema** — bento grid com mapa europeu interativo + tech callouts
5. **Outro** — CTA final de pre-reserva

Todos os botoes placeholder (`data-soon`) disparam um toast "Mais informacoes em breve" enquanto rotas reais nao existem.

## Licenca

Projeto conceitual / portfolio. Nike e Dunk sao marcas da Nike Inc — usadas aqui apenas com fins ilustrativos.
