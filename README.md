# Pedro Azevedo Ferreira · Portfólio

Portfólio pessoal em HTML, CSS e JavaScript, sem framework, etapa de build ou dependências.

Publicado no GitHub Pages: https://pedroazevedoferreira.github.io/portfolio/

## Versões

- `v2` (atual): direção editorial clara, estudos de caso com telas reais e conteúdo em `dados.js`.
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
  fonts/          Newsreader, IBM Plex Sans e IBM Plex Mono (SIL Open Font License, textos incluídos)
  img/projetos/   Telas reais dos sites publicados
```

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
Enquanto uma área não tiver trabalhos, o bloco mostra apenas a descrição.

Textos fixos (apresentação, Sobre, Experiência, Contato) estão direto no `index.html`.

## Acessibilidade e privacidade

- HTML semântico, link para pular ao conteúdo, foco visível e menu operável por teclado (Esc fecha).
- Contraste de texto dentro do nível AA; sem JavaScript, o menu continua visível e a seção de projetos
  mostra um aviso com link para o GitHub.
- Animação única nos conectores do fluxo, desativada com `prefers-reduced-motion`.
- Sem scripts de terceiros, rastreadores ou fontes externas. A política de conteúdo (CSP) fica em uma
  meta tag no `index.html`.
