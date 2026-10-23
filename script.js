/*
  Comportamentos do portfólio:
  1. Monta projetos e áreas de design a partir de dados.js
  2. Menu no celular
  3. Destaque da seção atual no menu
  4. Remove o service worker da versão anterior do site
*/

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const dados = window.PORTFOLIO || { projetos: [], design: { areas: [], trabalhos: [] } };

  /* Cria um elemento com atributos e filhos (texto ou nós) */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null || value === false) continue;
        if (key === "class") node.className = value;
        else node.setAttribute(key, value === true ? "" : String(value));
      }
    }
    for (const child of [].concat(children || [])) {
      if (child === undefined || child === null || child === false) continue;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return node;
  }

  function preenchido(valor) {
    if (Array.isArray(valor)) return valor.length > 0;
    return typeof valor === "string" ? valor.trim() !== "" : Boolean(valor);
  }

  function externo(url) {
    return /^https?:\/\//.test(url);
  }

  function link(rotulo, url, classe) {
    const abreFora = externo(url);
    return el("a", { class: classe, href: url, target: abreFora && "_blank", rel: abreFora && "noopener noreferrer" }, [
      rotulo,
      abreFora ? el("span", { "aria-hidden": "true" }, "↗") : null,
      abreFora ? el("span", { class: "visually-hidden" }, "(abre em nova aba)") : null,
    ]);
  }

  /* 1a. Projetos ---------------------------------------------------------- */

  /* Um projeto só é exibido quando está publicado e tem conteúdo real nos campos essenciais */
  const camposObrigatorios = {
    estudo: ["titulo", "resumo", "autoria", "stack", "imagens"],
    ficha: ["titulo", "resumo", "autoria", "stack"],
  };

  function projetoCompleto(projeto) {
    if (!projeto || projeto.publicado !== true) return false;
    const campos = camposObrigatorios[projeto.formato];
    if (!campos) return false;
    if (!campos.every((campo) => preenchido(projeto[campo]))) return false;
    return preenchido(projeto.autoria.rotulo);
  }

  function montarImagens(projeto) {
    const figuras = projeto.imagens
      .filter((imagem) => preenchido(imagem.src) && preenchido(imagem.alt))
      .map((imagem) => {
        const img = el("img", {
          src: imagem.src,
          alt: imagem.alt,
          width: imagem.largura,
          height: imagem.altura,
          loading: "lazy",
          decoding: "async",
        });
        if (imagem.tipo === "celular") {
          return el("div", { class: "shot shot-phone" }, img);
        }
        return el("div", { class: "shot shot-desktop" }, [
          imagem.endereco ? el("div", { class: "shot-bar", "aria-hidden": "true" }, el("span", null, imagem.endereco)) : null,
          img,
        ]);
      });

    if (!figuras.length) return null;

    return el("figure", { class: "case-media" }, [
      ...figuras,
      el("figcaption", null, "Telas reais do site publicado, capturadas em computador e celular."),
    ]);
  }

  function montarProjeto(projeto, indice) {
    const idTitulo = "projeto-" + projeto.id + "-titulo";
    const numero = "P." + String(indice + 1).padStart(2, "0");

    const cabecalho = el("header", { class: "case-head grid" }, [
      el("p", { class: "case-number" }, numero),
      el("div", { class: "case-heading" }, [
        preenchido(projeto.categoria) ? el("p", { class: "case-category" }, projeto.categoria) : null,
        el("h3", { class: "case-title", id: idTitulo }, [
          projeto.titulo,
          preenchido(projeto.subtitulo) ? el("span", { class: "case-subtitle" }, projeto.subtitulo) : null,
        ]),
        el("p", { class: "case-summary" }, projeto.resumo),
      ]),
    ]);

    const autoria = el("div", { class: "authorship" }, [
      el("p", { class: "authorship-type" }, [
        el("span", { class: "authorship-mark", "data-tipo": projeto.autoria.tipo, "aria-hidden": "true" }),
        projeto.autoria.rotulo,
      ]),
      preenchido(projeto.autoria.detalhe) ? el("p", null, projeto.autoria.detalhe) : null,
    ]);

    const principal = el("div", { class: "case-main" }, [
      preenchido(projeto.contexto)
        ? el("div", { class: "case-block" }, [el("h4", null, "Contexto"), el("p", null, projeto.contexto)])
        : null,
      preenchido(projeto.contribuicao) || preenchido(projeto.entregas)
        ? el("div", { class: "case-block" }, [
            el("h4", null, projeto.tituloEntregas || "O que fiz"),
            preenchido(projeto.contribuicao) ? el("p", null, projeto.contribuicao) : null,
            preenchido(projeto.entregas)
              ? el("ul", { class: "list-dash" }, projeto.entregas.map((item) => el("li", null, item)))
              : null,
          ])
        : null,
    ]);

    const lateral = el("div", { class: "case-side" }, [
      el("div", { class: "case-block" }, [
        el("h4", null, projeto.tituloStack || "Tecnologias"),
        el("ul", { class: "tags" }, projeto.stack.map((item) => el("li", null, item))),
        preenchido(projeto.notaStack) ? el("p", { class: "case-note" }, projeto.notaStack) : null,
      ]),
      preenchido(projeto.links)
        ? el("div", { class: "case-block" }, [
            el("h4", null, "Links"),
            el(
              "ul",
              { class: "case-links" },
              projeto.links.filter((item) => preenchido(item.url)).map((item) => el("li", null, link(item.rotulo, item.url)))
            ),
          ])
        : null,
    ]);

    return el(
      "article",
      { class: "case case-" + projeto.formato, id: "projeto-" + projeto.id, "aria-labelledby": idTitulo },
      [
        cabecalho,
        projeto.formato === "estudo" ? montarImagens(projeto) : null,
        el("div", { class: "case-body grid" }, [el("div", { class: "case-aside" }, autoria), principal, lateral]),
      ]
    );
  }

  const listaProjetos = document.getElementById("lista-projetos");
  if (listaProjetos) {
    const projetos = (dados.projetos || []).filter(projetoCompleto);
    // Estudos de caso primeiro, fichas curtas depois
    projetos.sort((a, b) => (a.formato === b.formato ? 0 : a.formato === "estudo" ? -1 : 1));
    projetos.forEach((projeto, indice) => listaProjetos.append(montarProjeto(projeto, indice)));
  }

  /* 1b. Design ------------------------------------------------------------ */

  function trabalhoCompleto(trabalho) {
    return (
      trabalho &&
      trabalho.publicado === true &&
      preenchido(trabalho.titulo) &&
      trabalho.imagem &&
      preenchido(trabalho.imagem.src) &&
      preenchido(trabalho.imagem.alt)
    );
  }

  const areasDesign = document.getElementById("areas-design");
  if (areasDesign && dados.design) {
    const trabalhos = (dados.design.trabalhos || []).filter(trabalhoCompleto);

    (dados.design.areas || []).forEach((area, indice) => {
      const daArea = trabalhos.filter((trabalho) => trabalho.area === area.id);

      const obras = daArea.length
        ? el(
            "div",
            { class: "design-works" },
            daArea.map((trabalho) =>
              el("figure", null, [
                el("img", {
                  src: trabalho.imagem.src,
                  alt: trabalho.imagem.alt,
                  width: trabalho.imagem.largura,
                  height: trabalho.imagem.altura,
                  loading: "lazy",
                  decoding: "async",
                }),
                el("figcaption", null, [
                  el("strong", null, trabalho.titulo),
                  preenchido(trabalho.descricao) ? trabalho.descricao : null,
                ]),
              ])
            )
          )
        : el("p", { class: "design-area-status" }, "Imagens em seleção");

      areasDesign.append(
        el("article", { class: "design-area", id: "design-" + area.id }, [
          el("span", { class: "design-area-index", "aria-hidden": "true" }, "D." + String(indice + 1).padStart(2, "0")),
          el("h3", null, area.nome),
          preenchido(area.descricao) ? el("p", null, area.descricao) : null,
          obras,
        ])
      );
    });
  }

  /* 2. Menu no celular ---------------------------------------------------- */

  const botaoMenu = document.querySelector(".nav-toggle");
  const menu = document.getElementById("menu-principal");
  const telaPequena = window.matchMedia("(max-width: 47.99rem)");

  function definirMenu(aberto) {
    if (!botaoMenu || !menu) return;
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.querySelector(".nav-toggle-label").textContent = aberto ? "Fechar" : "Menu";
    menu.classList.toggle("is-open", aberto);
  }

  if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", () => {
      definirMenu(botaoMenu.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", (evento) => {
      if (evento.target.closest("a")) definirMenu(false);
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && botaoMenu.getAttribute("aria-expanded") === "true") {
        definirMenu(false);
        botaoMenu.focus();
      }
    });

    document.addEventListener("click", (evento) => {
      if (menu.classList.contains("is-open") && !evento.target.closest(".site-header")) definirMenu(false);
    });

    telaPequena.addEventListener("change", () => definirMenu(false));
  }

  /* 3. Seção atual no menu ------------------------------------------------ */

  const linksMenu = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const secoes = linksMenu.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  if ("IntersectionObserver" in window && secoes.length) {
    const visiveis = new Map();
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => visiveis.set(entrada.target.id, entrada.isIntersecting));
        const atual = secoes.find((secao) => visiveis.get(secao.id));
        linksMenu.forEach((a) => {
          if (atual && a.getAttribute("href") === "#" + atual.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    secoes.forEach((secao) => observador.observe(secao));
  }

  /* 4. Limpeza da versão anterior ---------------------------------------- */

  // A primeira versão do site registrava um service worker com cache.
  // Esta versão não usa cache offline, então remove o registro e os caches antigos.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registros) => registros.forEach((registro) => registro.unregister()))
      .catch(() => {});
  }
  if ("caches" in window) {
    caches
      .keys()
      .then((chaves) => chaves.filter((chave) => chave.startsWith("pedro-portfolio")).forEach((chave) => caches.delete(chave)))
      .catch(() => {});
  }
})();
