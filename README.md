# Joice Sebastião — Portfólio

Site pessoal de portefólio e serviços, focado em gestão de informação, data science e ciência atuarial.

Construído em **HTML, CSS e JavaScript puro** — sem frameworks, sem build tools, sem dependências. Qualquer editor de texto chega para o manter.

## Estrutura

```
.
├── index.html                          Página inicial
├── servicos.html                       Listagem de serviços
├── servicos/
│   ├── segmentacao-clientes.html
│   ├── classificacao-risco-credito.html
│   └── previsao-vendas.html
├── projetos.html                       Listagem de projetos/casos
├── projetos/
│   └── segmentacao-centro-comercial.html
├── como-trabalhamos.html
├── sobre.html
├── contactos.html
├── css/style.css                       Todo o design (cores, tipografia, componentes)
├── js/script.js                        Menu mobile + animações de entrada (scroll reveal)
└── assets/                             Imagens
```

## Como ver localmente

Não precisa de instalação. Basta servir a pasta com qualquer servidor estático, por exemplo:

```bash
python -m http.server 5500
```

e abrir `http://localhost:5500`.

## Notas

- As cores e tipografia estão centralizadas em variáveis CSS no topo de `css/style.css` (`:root`).
- Ao editar `css/style.css` ou `js/script.js`, atualiza o parâmetro `?v=` nos `<link>`/`<script>` de cada página HTML para forçar o browser a carregar a versão mais recente.
- Sempre que fizeres alterações e quiseres a mesma cor/estilo, edita o CSS uma vez — reflete-se em todas as páginas.
