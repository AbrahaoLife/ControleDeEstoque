# Sistema Abrahão — Controle de Estoque

Sistema web completo para gerenciamento de estoque doméstico, lista de compras, controle financeiro e dashboard de análise. PWA responsivo que funciona offline.

**Acesse:** [abrahaolife.github.io/ControleDeEstoque](https://abrahaolife.github.io/ControleDeEstoque/)

## Funcionalidades

### Estoque
- Cadastro, edição e exclusão de produtos
- Controle de quantidade e estoque mínimo
- Botões +/− e edição direta da quantidade nos cards
- Prevenção de produtos duplicados (nomes com espaços/caixa diferentes são iguais)
- Categorias automáticas (Alimentos, Limpeza, Higiene, Bebidas, Outros)
- Busca e filtros por categoria
- Alertas de estoque baixo

### Lista de Compras
- Itens gerados automaticamente a partir do estoque baixo
- Adição manual de itens com quantidade (botões +/− nos cards)
- Merge automático de itens repetidos (aumenta a quantidade)
- Layout em grade responsiva
- Subtags de produtos mais comprados
- Autocomplete com categorias e sugestões ampliadas (frutas, verduras e legumes)

### Financeiro
- Definição de saldo inicial mensal
- Registro de despesas livres com categorias
- Subtags de categorias (Alimentação, Lazer, Transporte, Saúde, Contas, Educação, Vestuário, Outros)
- Autocomplete baseado em despesas anteriores
- Detecção automática de categoria por palavra-chave
- Histórico de despesas com filtros

### Dashboard
- Cards de resumo (saldo, gastos, produtos, estoque baixo)
- Gráfico "Onde foi o dinheiro?" por categoria
- Últimas despesas e atividade recente
- Gráfico de barras de gastos por mês
- Histórico de meses anteriores

### Extras
- Modo escuro
- Exportar/importar dados (JSON)
- Notificações com som
- Splash screen animada
- PWA com funcionamento offline
- Design responsivo (desktop e celular)

## Tecnologias

- HTML5
- CSS8 (modular)
- JavaScript vanilla (modular)
- LocalStorage
- Service Worker (PWA)

## Como usar

### Online
Acesse: [abrahaolife.github.io/ControleDeEstoque](https://abrahaolife.github.io/ControleDeEstoque/)

### Local
1. Clone o repositório
2. Abra `index.html` no navegador

## Estrutura

```
├── index.html
├── manifest.json
├── service-worker.js
├── assets/          # Ícones PWA
├── sons/            # Sons de notificação
├── css/             # Estilos modulares
│   ├── base.css
│   ├── cards.css
│   ├── dashboard.css
│   ├── forms.css
│   ├── modal.css
│   ├── notifications.css
│   ├── responsive.css
│   └── splash.css
└── js/              # Lógica modular
    ├── dados.js
    ├── notificacoes.js
    ├── estoque.js
    ├── filtros.js
    ├── financeiro.js
    ├── modal.js
    ├── compras.js
    ├── polish.js
    ├── dashboard.js
    └── app.js
```
