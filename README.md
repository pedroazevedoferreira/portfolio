# Pedro Azevedo Ferreira · Portfólio

Portfólio pessoal em HTML, CSS e JavaScript, sem framework, etapa de build ou dependências.

Publicado no GitHub Pages: https://pedroazevedoferreira.github.io/portfolio/

## Versões

- `v3` (atual): direção "placa de integração", com abertura em azul capri, tipografia condensada e
  projetos apresentados como placas de entrada e saída.
- `v2`: direção editorial clara, preservada na tag [`v2`](https://github.com/pedroazevedoferreira/portfolio/tree/v2).
- `v1`: primeira versão do portfólio, preservada na tag [`v1`](https://github.com/pedroazevedoferreira/portfolio/tree/v1).

## Visualizar localmente

Abrir o `index.html` direto no navegador funciona, mas a prévia mais fiel é por HTTP:

```bash
python -m http.server 8765
```

Depois, abra http://localhost:8765.

## Estrutura

```
index.html        Página única: apresentação, Sobre, Experiência, Projetos, Design e Contato
styles.css        Tokens de cor e tipografia no início; depois as seções, na ordem da página
dados.js          Conteúdo editável: projetos e trabalhos de design
script.js         Monta projetos e design a partir de dados.js, menu no celular, seção atual no menu
sw.js             Remove o service worker da v1 para quem já visitou o site (não registra cache)
assets/
  favicon.svg, apple-touch-icon.png, og-image.png
  fonts/          Big Shoulders Display, Instrument Sans e JetBrains Mono (SIL Open Font License, textos incluídos)
  img/projetos/   Telas reais dos sites publicados
```

## Sistema visual

Tokens no início de `styles.css`:

- Azul capri `#00BFFF`: só como fundo (abertura, cabeçalho, selos), sempre com texto marinho por cima.
- Marinho `#031A2B`: texto, bordas de 2 px e faixas. Capri escuro `#0077A8` para links sobre fundo claro.
- Big Shoulders Display nos títulos, Instrument Sans no texto e JetBrains Mono só em trechos de código.
- Cada projeto é uma placa: cabeçalho com selo de autoria, telas reais, entrada (contexto), saída
  (o que foi feito) e a stack no rodapé.

## Adicionar ou editar conteúdo

Projetos e trabalhos de design ficam em `dados.js`. Um item só aparece na página quando tem
`publicado: true` e os campos essenciais preenchidos; caso contrário, fica oculto.

**Novo projeto:** copie o modelo `novo-projeto` no fim da lista `projetos`, preencha os campos e troque
`publicado` para `true`.

- `formato: "estudo"` exige imagens; use `"ficha"` para um projeto sem telas.
- `autoria.tipo`: `"individual"`, `"equipe"` ou `"repositorio"`. Em projetos de equipe, descreva só a
  sua contribuição em `autoria.detalhe` e `contribuicao`.
- Imagens em `assets/img/projetos/`, de preferência em WebP, com `largura`, `altura` e `alt`.

**Trabalho de design:** adicione um item em `design.trabalhos` com `area` igual a um dos ids de
`design.areas` (`identidade`, `logotipos`, `catalogos`, `divulgacao`) e a imagem em `assets/img/design/`.
Enquanto uma área não tiver trabalhos, o bloco mostra a descrição e um espaço de mídia reservado.

Textos fixos (apresentação, Sobre, Experiência, Contato) estão direto no `index.html`.

## Acessibilidade e privacidade

- HTML semântico, link para pular ao conteúdo, foco visível e menu operável por teclado (Esc fecha).
- Contraste de texto dentro do nível AA; sem JavaScript, o menu continua visível e a seção de projetos
  mostra um aviso com link para o GitHub.
- Animação única no painel JSON da abertura, desativada com `prefers-reduced-motion`.
- Sem scripts de terceiros, rastreadores ou fontes externas. A política de conteúdo (CSP) fica em uma
  meta tag no `index.html`.
