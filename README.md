# Pedro Azevedo · Portfólio

Portfólio pessoal em HTML, CSS e JavaScript, sem framework, etapa de build ou dependências.

Publicado no GitHub Pages: https://pedroazevedoferreira.github.io/portfolio/

## Versões

- `v4` (atual): abertura composta a partir de uma imagem de referência: fundo marinho, azul como luz
  do fluxo processo → API → dados → interface, telas reais em perspectiva sobre uma laje de pedra.
- `v3`: direção "placa de integração", preservada na tag [`v3`](https://github.com/pedroazevedoferreira/portfolio/tree/v3).
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
  fonts/          Inter Tight, Instrument Sans e JetBrains Mono (SIL Open Font License, textos incluídos)
  img/projetos/   Telas reais dos sites publicados (a da abertura é a Ferreira no tema escuro, em proporção de tablet)
```

## Sistema visual

Tokens no início de `styles.css`:

- Fundo marinho `#04111F` (faixas em `#0A1E33`), divisórias de 1 px em `#17324D`.
- A abertura é posicionada em "unidades da referência" (`--k`, 1 px de uma imagem de 1586 × 912) com
  container queries, então mantém a mesma composição em qualquer largura de desktop. A pedra é
  desenhada em SVG (ruído e iluminação), sem fotografia.
- Azul `#1E8FF5` é a luz; o botão principal usa `#0073E6` para o texto branco passar no contraste AA. O azul é usado em: linha do fluxo, nós, títulos em destaque e
  destaques. `#7FDBFF` para links e rótulos; texto em `#EAF4FB` e secundário em `#9DB4C6`.
- Inter Tight nos títulos, Instrument Sans no texto e JetBrains Mono só na linha de stack.
- Telas reais em perspectiva (`perspective` + `rotateY`), na abertura e em cada projeto; o lado das
  telas alterna entre os estudos de caso.
- Cada projeto é uma estação: selo de autoria, telas, entrada (contexto), saída (o que foi feito) e stack.

## Animação da abertura

Só CSS, uma vez, em cerca de 1,6 s (seção 14 de `styles.css`): a linha acende de "Processo" a
"Interface", cada nó liga em sequência e a tela da Ferreira entra em perspectiva até se encaixar, com
o celular logo depois. O estado final é o CSS normal; a animação anima apenas o ponto de partida
(`animation-fill-mode: backwards`) e só existe com `prefers-reduced-motion: no-preference`. Texto e
botões aparecem imediatamente e podem ser usados durante a animação.

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

**Ao publicar:** se mudar `styles.css`, `script.js` ou `dados.js`, aumente o `?v=` desses arquivos no
`index.html` (por exemplo, de `?v=4.4` para `?v=4.5`). O GitHub Pages deixa o navegador guardar os
arquivos por 10 minutos; sem trocar o endereço, o visitante pode ver o HTML novo com o CSS antigo.

## Acessibilidade e privacidade

- HTML semântico, link para pular ao conteúdo, foco visível e menu operável por teclado (Esc fecha).
- Contraste de texto dentro do nível AA; sem JavaScript, o menu continua visível e a seção de projetos
  mostra um aviso com link para o GitHub.
- Animação única na abertura (linha e telas), desativada com `prefers-reduced-motion`.
- Sem scripts de terceiros, rastreadores ou fontes externas. A política de conteúdo (CSP) fica em uma
  meta tag no `index.html`.
