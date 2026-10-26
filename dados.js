/*
  Conteúdo editável do portfólio.

  Projetos e trabalhos de design são lidos daqui por script.js.
  Um item só aparece na página quando `publicado: true` e os campos
  obrigatórios estiverem preenchidos (veja `camposObrigatorios` em script.js).
  Para preparar um item sem publicá-lo, deixe `publicado: false`.

  Formatos de projeto:
  - "estudo": estudo de caso completo, com imagens, entregas e stack.
  - "ficha":  ficha curta, sem imagens.

  Autoria (`autoria.tipo`):
  - "individual": trabalho feito sozinho.
  - "equipe":     trabalho em grupo; descreva só a sua contribuição em `autoria.detalhe`.
  - "repositorio": projeto publicado no seu GitHub.

  Imagens: use somente telas e fotos reais, salvas em assets/img/.
*/

window.PORTFOLIO = {
  projetos: [
    {
      id: "ferreira",
      publicado: true,
      formato: "estudo",
      titulo: "Ferreira Projetos e Construções",
      categoria: "Site institucional de engenharia civil",
      autoria: {
        tipo: "individual",
        rotulo: "Projeto individual",
        detalhe:
          "Fiz o site sozinho, de ponta a ponta: organização do conteúdo, design da interface, desenvolvimento, testes e publicação.",
      },
      resumo:
        "Site institucional de uma empresa de engenharia civil do Rio de Janeiro, com serviços, portfólio de obras e um caminho direto para pedir orçamento.",
      contexto:
        "O site apresenta a empresa, seus serviços e as obras realizadas, e leva o visitante ao contato. É um site estático em HTML, CSS e JavaScript, sem framework, etapa de build ou dependências de produção.",
      tituloEntregas: "O que fiz",
      entregas: [
        "Estrutura de páginas para serviços, atendimento a empresas, sobre e contato, além de um portfólio de obras com filtros e fichas com galeria ampliável.",
        "Interface responsiva com tema claro e escuro; a preferência fica salva no navegador.",
        "Formulário de orçamento que valida os campos e prepara a mensagem no WhatsApp do visitante. Nada é enviado sem a confirmação dele.",
        "Navegação que continua funcionando sem JavaScript e animações que respeitam a preferência por movimento reduzido.",
        "Política de segurança de conteúdo (CSP) que bloqueia scripts externos. Fontes, imagens e scripts ficam no próprio site.",
        "Testes de fumaça com Playwright em todas as páginas, de telas de celular a 1920 px de largura, nos dois temas e com verificação automatizada de acessibilidade.",
        "Publicação no Cloudflare Workers, com deploy a cada push na branch principal.",
      ],
      tituloStack: "Tecnologias",
      stack: ["HTML", "CSS", "JavaScript", "Cloudflare Workers", "Playwright", "Git e GitHub"],
      links: [
        { rotulo: "Ver o site", url: "https://construcoesferreira-site.pedroazevedoferreira2006.workers.dev/" },
        { rotulo: "Código no GitHub", url: "https://github.com/pedroazevedoferreira/construcoesferreira-site" },
      ],
      imagens: [
        {
          tipo: "desktop",
          src: "assets/img/projetos/ferreira-desktop.webp",
          largura: 1440,
          altura: 900,
          endereco: "construcoesferreira-site.pedroazevedoferreira2006.workers.dev",
          alt: "Página inicial do site da Ferreira Projetos e Construções em tela de computador: título “Engenharia para obras que precisam funcionar”, botão de orçamento e foto de um escritório.",
        },
        {
          tipo: "celular",
          src: "assets/img/projetos/ferreira-mobile.webp",
          largura: 780,
          altura: 1688,
          alt: "A mesma página inicial em tela de celular, com a foto no topo e o título logo abaixo.",
        },
      ],
    },
    {
      id: "sim-aceito",
      publicado: true,
      formato: "estudo",
      titulo: "Sim, Aceito!",
      subtitulo: "Wedding Management",
      categoria: "Plataforma SaaS de gestão de casamentos",
      autoria: {
        tipo: "equipe",
        rotulo: "Projeto em equipe",
        detalhe:
          "O produto foi desenvolvido em grupo. Minha principal contribuição foi no front-end, na parte visual e em UX/UI.",
      },
      resumo:
        "Plataforma para assessorias de casamento que reúne cronograma, finanças, checklists e fornecedores em um só sistema, com um portal para os noivos.",
      contexto:
        "O repositório reúne a API, a aplicação web, a página pública de apresentação e a infraestrutura do produto, com documentação técnica própria. O site público está em simaceito.site.",
      tituloEntregas: "Minha contribuição",
      contribuicao:
        "Atuei principalmente na camada que as pessoas veem e usam: front-end, linguagem visual e experiência de uso (UX/UI). As demais partes do produto foram desenvolvidas pela equipe.",
      tituloStack: "Stack do projeto",
      notaStack: "Tecnologias usadas no projeto como um todo, não apenas na minha parte.",
      stack: [
        "React",
        "TypeScript",
        "Vite",
        "Tailwind CSS",
        "shadcn/ui",
        "Astro",
        "Django",
        "Django Ninja",
        "PostgreSQL",
        "Terraform",
        "GCP Cloud Run",
        "GitHub Actions",
      ],
      links: [
        { rotulo: "Ver o site", url: "https://simaceito.site/" },
        { rotulo: "Repositório da equipe", url: "https://github.com/Rafaelp122/wedding_management" },
      ],
      imagens: [
        {
          tipo: "desktop",
          src: "assets/img/projetos/simaceito-desktop.webp",
          largura: 1440,
          altura: 900,
          endereco: "simaceito.site",
          alt: "Página pública do Sim, Aceito! em tela de computador: título “Gestão impecável para assessorar sem estresse” e um painel financeiro ilustrativo.",
        },
        {
          tipo: "celular",
          src: "assets/img/projetos/simaceito-mobile.webp",
          largura: 780,
          altura: 1688,
          alt: "A mesma página em tela de celular, com o título, o campo de e-mail e o início do painel financeiro.",
        },
      ],
    },
    {
      id: "django-task-manager",
      publicado: true,
      formato: "ficha",
      titulo: "Django Task Manager",
      categoria: "Aplicação web em Django",
      autoria: {
        tipo: "repositorio",
        rotulo: "Repositório no meu GitHub",
      },
      resumo:
        "Aplicação de tarefas com cadastro, consulta, edição e exclusão (CRUD) e autenticação de usuários.",
      tituloEntregas: "Como funciona",
      entregas: [
        "Login e logout com o sistema de autenticação do Django; as páginas de tarefas exigem usuário autenticado.",
        "Cada usuário vê e altera apenas as próprias tarefas: as views conferem o dono antes de exibir, editar ou excluir.",
        "Views baseadas em classe (lista, detalhe, criação, edição e exclusão) e formulário com ModelForm.",
        "Banco SQLite e templates com Bootstrap 5.",
      ],
      tituloStack: "Tecnologias",
      stack: ["Python", "Django", "SQLite", "Bootstrap"],
      links: [{ rotulo: "Código no GitHub", url: "https://github.com/pedroazevedoferreira/django-task-manager" }],
    },

    /*
      Modelo para um novo projeto. Preencha e troque `publicado` para true.
    */
    {
      id: "novo-projeto",
      publicado: false,
      formato: "estudo",
      titulo: "",
      subtitulo: "",
      categoria: "",
      autoria: { tipo: "individual", rotulo: "", detalhe: "" },
      resumo: "",
      contexto: "",
      tituloEntregas: "O que fiz",
      entregas: [],
      tituloStack: "Tecnologias",
      notaStack: "",
      stack: [],
      links: [],
      imagens: [],
    },
  ],

  design: {
    /*
      Áreas de atuação em design gráfico. Cada área vira um bloco na seção Design.
      Enquanto uma área não tiver trabalhos publicados, o bloco mostra só o texto.
    */
    areas: [
      { id: "identidade", nome: "Identidade visual", descricao: "Cores, tipografia e aplicações que formam a imagem de uma marca." },
      { id: "logotipos", nome: "Logotipos", descricao: "Símbolos e assinaturas que identificam uma marca." },
      { id: "catalogos", nome: "Catálogos", descricao: "Peças editoriais que organizam produtos e informações." },
      { id: "divulgacao", nome: "Materiais de divulgação", descricao: "Peças que comunicam uma marca, um produto ou um serviço." },
    ],

    /*
      Trabalhos de design. Exemplo:
      {
        publicado: true,
        area: "logotipos",              // um dos ids acima
        titulo: "Nome do trabalho",
        descricao: "Uma frase sobre o que foi feito.",
        imagem: { src: "assets/img/design/arquivo.webp", largura: 1600, altura: 1200, alt: "Descrição da imagem" }
      }
    */
    trabalhos: [],
  },
};
