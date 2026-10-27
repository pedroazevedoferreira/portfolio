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

    return el("figure", { class: "project-media" }, [
      el("div", { class: "project-shots" }, figuras),
      el("figcaption", null, "Telas reais do site publicado, capturadas em computador e celular."),
    ]);
  }

  /* Bloco de entrada/saída da placa: um título, um parágrafo e/ou uma lista */
  function blocoIO(direcao, titulo, texto, itens) {
    return el("div", { class: "io" }, [
      el("h4", { class: "io-title" }, [direcao ? el("span", { class: "io-dir" }, direcao) : null, titulo]),
      preenchido(texto) ? el("p", null, texto) : null,
      preenchido(itens) ? el("ul", { class: "list-bar" }, itens.map((item) => el("li", null, item))) : null,
    ]);
  }

  function montarProjeto(projeto) {
    const idTitulo = "projeto-" + projeto.id + "-titulo";

    const cabecalho = el("header", { class: "project-head" }, [
      el("div", null, [
        preenchido(projeto.categoria) ? el("p", { class: "project-category" }, projeto.categoria) : null,
        el("h3", { class: "project-title", id: idTitulo }, [
          projeto.titulo,
          preenchido(projeto.subtitulo) ? el("span", { class: "project-subtitle" }, projeto.subtitulo) : null,
        ]),
      ]),
      el("p", { class: "seal", "data-tipo": projeto.autoria.tipo }, projeto.autoria.rotulo),
    ]);

    const resumo = el("div", { class: "project-summary" }, [
      el("p", null, projeto.resumo),
      preenchido(projeto.autoria.detalhe) ? el("p", { class: "project-authorship" }, projeto.autoria.detalhe) : null,
    ]);

    // Com contexto, a placa mostra entrada (contexto) e saída (o que foi feito); sem ele, só o resultado
    const temSaida = preenchido(projeto.contribuicao) || preenchido(projeto.entregas);
    const tituloSaida = projeto.tituloEntregas || "O que fiz";
    const io = preenchido(projeto.contexto)
      ? el("div", { class: "project-io" }, [
          blocoIO("Entrada", "Contexto", projeto.contexto),
          temSaida ? blocoIO("Saída", tituloSaida, projeto.contribuicao, projeto.entregas) : null,
        ])
      : temSaida
      ? el("div", { class: "project-io project-io-single" }, [
          blocoIO(null, tituloSaida, projeto.contribuicao, projeto.entregas),
        ])
      : null;

    const links = (projeto.links || []).filter((item) => preenchido(item.url));
    const rodape = el("footer", { class: "project-foot" }, [
      el("div", { class: "stack" }, [
        el("p", { class: "stack-line" }, [
          el("span", { class: "stack-key" }, (projeto.tituloStack || "Tecnologias") + ":"),
          " " + projeto.stack.join(", "),
        ]),
        preenchido(projeto.notaStack) ? el("p", { class: "stack-note" }, projeto.notaStack) : null,
      ]),
      links.length
        ? el("ul", { class: "project-links" }, links.map((item) => el("li", null, link(item.rotulo, item.url, "button button-outline"))))
        : null,
    ]);

    return el(
      "article",
      { class: "project project-" + projeto.formato, id: "projeto-" + projeto.id, "aria-labelledby": idTitulo },
      [cabecalho, resumo, projeto.formato === "estudo" ? montarImagens(projeto) : null, io, rodape]
    );
  }

  const listaProjetos = document.getElementById("lista-projetos");
  if (listaProjetos) {
    const projetos = (dados.projetos || []).filter(projetoCompleto);
    // Estudos de caso primeiro, fichas curtas depois
    projetos.sort((a, b) => (a.formato === b.formato ? 0 : a.formato === "estudo" ? -1 : 1));
    projetos.forEach((projeto) => listaProjetos.append(montarProjeto(projeto)));
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

    (dados.design.areas || []).forEach((area) => {
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
        : el("div", { class: "media-slot" }, el("p", null, "Imagens em seleção"));

      areasDesign.append(
        el("article", { class: "design-plate", id: "design-" + area.id }, [
          el("h3", { class: "design-plate-title" }, area.nome),
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

  // A primeira versão do site registrava um service worker que guardava CSS e JS sem prazo
  // e os entregava antes da rede: quem visitou a v1 podia ver o HTML novo com o CSS antigo.
  // Esta versão não usa cache offline: remove o registro, apaga os caches e, se a página
  // ainda estava sendo servida por esse service worker, recarrega uma única vez.
  const controlada = "serviceWorker" in navigator && Boolean(navigator.serviceWorker.controller);

  const removerRegistros = "serviceWorker" in navigator
    ? navigator.serviceWorker.getRegistrations().then((registros) => Promise.all(registros.map((r) => r.unregister())))
    : Promise.resolve();

  const apagarCaches = "caches" in window
    ? caches.keys().then((chaves) => Promise.all(chaves.map((chave) => caches.delete(chave))))
    : Promise.resolve();

  Promise.all([removerRegistros, apagarCaches])
    .then(() => {
      if (!controlada) return;
      let jaRecarregou = false;
      try {
        jaRecarregou = sessionStorage.getItem("portfolio-cache-limpo") === "1";
        sessionStorage.setItem("portfolio-cache-limpo", "1");
      } catch (erro) {
        jaRecarregou = true; // sem sessionStorage, não arrisca recarregar em laço
      }
      if (!jaRecarregou) location.reload();
    })
    .catch(() => {});
})();
