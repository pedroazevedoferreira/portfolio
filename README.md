# Pedro Azevedo — Portfólio

Portfólio pessoal feito com **HTML, CSS e JavaScript puros** (zero dependências externas).

🔗 **Live:** https://pedroazevedoferreira.github.io/portfolio/

## 🚀 Stack

- HTML5 semântico
- CSS3 (custom properties, grid, flex, animações)
- JavaScript vanilla (zero frameworks)
- PWA (manifest + service worker)
- Devicon e Simple Icons para logos via CDN

## ✨ Features

- 🎨 Tema dark/light com persistência
- 🌐 Suporte PT/EN
- ⌨️ Busca rápida `Ctrl+K`
- 📱 Responsivo + PWA instalável
- ♿ Acessível (`prefers-reduced-motion`, focus states)
- 🎯 Modal de detalhes dos projetos
- 🪄 Cursor customizado + magnetic buttons (desktop)
- 📊 GitHub stats embed
- 🎉 Confete ao enviar formulário
- 📈 Indicador de progresso de leitura

## 📂 Estrutura

```
portfolio/
├── index.html       # Página principal
├── style.css        # Estilos
├── script.js        # Interatividade
├── sw.js            # Service worker (PWA)
├── manifest.json    # Manifest PWA
└── img/             # Imagens e ícones
    ├── pedro.png
    ├── og-image.svg
    ├── icon-192.svg
    └── icon-512.svg
```

## 🛠️ Rodando localmente

Como é HTML/CSS/JS puros, basta abrir o `index.html` no navegador.

Para testar o **service worker (PWA)**, é preciso servir via HTTP:

```bash
# Python 3
python -m http.server 8000

# Node
npx serve
```

E abrir `http://localhost:8000`.

## 📝 Personalização

- **Formspree**: substituir `YOUR_FORMSPREE_ID` em `index.html` pelo ID gerado em [formspree.io](https://formspree.io)
- **WhatsApp**: trocar `5521999999999` pelo número real
- **Imagens dos projetos**: substituir os divs `.project-preview` por `<img src="img/...">` quando tiver os prints

---

Feito por **Pedro Azevedo** · 2026
