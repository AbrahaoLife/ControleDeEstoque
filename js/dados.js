// ==============================
// DADOS GLOBAIS
// ==============================

function carregarDado(
    chave,
    padrao
) {
    try {
        var valor =
            JSON.parse(
                localStorage.getItem(
                    chave
                )
            );
        return valor !== null
            ? valor
            : padrao;
    } catch (e) {
        return padrao;
    }
}

function escaparHTML(
    texto
) {
    var div =
        document.createElement("div");
    div.appendChild(
        document.createTextNode(
            texto
        )
    );
    return div.innerHTML;
}


// ==============================
// NORMALIZAÇÃO DE NOMES
// ==============================

function normalizarNome(
    nome
) {
    return String(nome)
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
}


function normalizarBusca(
    texto
) {
    return normalizarNome(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


// ==============================
// PRODUTO DUPLICADO
// ==============================

function encontrarProdutoDuplicado(
    nome,
    ignorarId
) {
    const alvo =
        normalizarNome(nome);

    for (
        const produto
        of produtos
    ) {
        if (
            ignorarId !== undefined &&
            produto.id === ignorarId
        ) {
            continue;
        }

        if (
            normalizarNome(produto.nome) ===
            alvo
        ) {
            return produto;
        }
    }

    return null;
}


// ==============================
// CONTROLE DE QUANTIDADE (+/−)
// ==============================

function criarControleQuantidade(
    valorInicial,
    aoAlterar
) {

    const controle =
        document.createElement("div");

    controle.classList.add(
        "controle-quantidade"
    );

    const botaoMenos =
        document.createElement("button");

    botaoMenos.type =
        "button";

    botaoMenos.classList.add(
        "qtd-btn",
        "qtd-menos"
    );

    botaoMenos.textContent =
        "−";

    botaoMenos.setAttribute(
        "aria-label",
        "Diminuir quantidade"
    );

    const campoSaida =
        document.createElement("span");

    campoSaida.classList.add(
        "qtd-numero"
    );

    campoSaida.setAttribute(
        "aria-live",
        "polite"
    );

    const botaoMais =
        document.createElement("button");

    botaoMais.type =
        "button";

    botaoMais.classList.add(
        "qtd-btn",
        "qtd-mais"
    );

    botaoMais.textContent =
        "+";

    botaoMais.setAttribute(
        "aria-label",
        "Aumentar quantidade"
    );

    let valorAtual =
        Math.max(
            0,
            Math.floor(
                Number(valorInicial) || 0
            )
        );

    campoSaida.textContent =
        valorAtual;


    function setValor(
        novoValor
    ) {

        let v =
            Math.floor(
                Number(novoValor) || 0
            );

        if (v < 0) {
            v = 0;
        }

        valorAtual = v;

        campoSaida.textContent = v;

    }


    botaoMenos.addEventListener(
        "click",
        function () {

            const novo =
                valorAtual - 1;

            if (novo < 0) {
                return;
            }

            setValor(novo);

            aoAlterar(valorAtual);

        }
    );


    botaoMais.addEventListener(
        "click",
        function () {

            setValor(valorAtual + 1);

            aoAlterar(valorAtual);

        }
    );


    controle.appendChild(
        botaoMenos
    );

    controle.appendChild(
        campoSaida
    );

    controle.appendChild(
        botaoMais
    );


    return {
        controle: controle,
        setValor: setValor
    };

}


// ==============================
// DESTACAR CARD EXISTENTE
// ==============================

function destacarCard(
    card
) {

    if (!card) {
        return;
    }

    card.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    card.classList.remove(
        "card-destaque"
    );

    void card.offsetWidth;

    card.classList.add(
        "card-destaque"
    );

}


// ==============================
// SUBTITULOS LISTA COMPRAS
// ==============================

function atualizarVisibilidadeSubtitulosCompras() {

    const listaPagina =
        document.getElementById(
            "listaComprasPagina"
        );

    const listaExtras =
        document.getElementById(
            "listaComprasExtras"
        );

    const subs =
        document.querySelectorAll(
            ".lista-compras-sub"
        );

    const paginaVazia =
        !listaPagina ||
        listaPagina.querySelector(
            ".compra"
        ) === null;

    const extrasVazios =
        !listaExtras ||
        listaExtras.children.length === 0;

    for (
        const sub
        of subs
    ) {
        const ehEstoque =
            sub.classList.contains(
                "adicionados"
            ) === false;

        const deveMostrar =
            ehEstoque
                ? !paginaVazia
                : !extrasVazios;

        sub.style.display =
            deveMostrar
                ? ""
                : "none";
    }

}


// ==============================
// SINCRONIZAR CARD COMPRA (ESTOQUE)
// ==============================

function sincronizarCardCompra(
    card,
    produto
) {

    const elAtual =
        card.querySelector(
            ".info-estoque-atual"
        );

    const elComprar =
        card.querySelector(
            ".info-comprar"
        );

    const campoQtd =
        card.querySelector(
            ".qtd-numero"
        );

    const atual =
        Number(produto.quantidade);

    const minimo =
        Number(produto.estoqueMinimo);

    const faltando =
        Math.max(0, minimo - atual);

    if (elAtual) {
        elAtual.textContent =
            atual;
    }

    if (elComprar) {
        elComprar.textContent =
            faltando;
    }

    if (
        campoQtd &&
        Number(campoQtd.textContent) !== atual
    ) {
        campoQtd.textContent =
            atual;
    }

}

const botao =
    document.getElementById("adicionar");

const botaoCancelar =
    document.getElementById("cancelarEdicao");

const listaProdutos =
    document.getElementById("listaProdutos");

const campoNome =
    document.getElementById("nomeProduto");

const campoQuantidade =
    document.getElementById("quantidadeProduto");

const campoCategoria =
    document.getElementById("categoriaProduto");

const campoEstoqueMinimo =
    document.getElementById("estoqueMinimo");

const sugestoesProdutos =
    document.getElementById("sugestoesProdutos");


const produtos =
    carregarDado("produtos", []);


const comprasExtras =
    carregarDado("comprasExtras", []);


let produtoEditando = null;

let cardEditando = null;

let categoriaSelecionada = "Todos";


// ==============================
// LOGS MENSAIS
// ==============================

const mesesLogs =
    carregarDado("mesesLogs", []);

const mesAtualRef =
    localStorage.getItem(
        "mesAtualRef"
    ) || "";


// ==============================
// SUGESTÕES
// ==============================

const sugestoes = [
    "Arroz",
    "Arroz integral",
    "Arroz parboilizado",
    "Feijão",
    "Feijão preto",
    "Feijão carioca",
    "Macarrão",
    "Farinha de trigo",
    "Farinha de mandioca",
    "Açúcar",
    "Sal",
    "Café",
    "Leite",
    "Óleo",
    "Azeite",
    "Margarina",
    "Manteiga",
    "Queijo",
    "Presunto",
    "Carne",
    "Frango",
    "Peixe",
    "Ovos",
    "Pão",
    "Biscoito",
    "Bolacha",
    "Molho de tomate",
    "Milho",
    "Ervilha",

    "Maçã",
    "Banana",
    "Laranja",
    "Limão",
    "Mamão",
    "Melancia",
    "Melão",
    "Uva",
    "Morango",
    "Abacaxi",
    "Manga",
    "Goiaba",
    "Pera",
    "Pêssego",
    "Kiwi",
    "Amora",
    "Ameixa",
    "Tangerina",
    "Mexerica",
    "Maracujá",
    "Coco",
    "Caju",

    "Batata",
    "Batata doce",
    "Batata inglesa",
    "Cenoura",
    "Cebola",
    "Tomate",
    "Alho",
    "Alface",
    "Couve",
    "Espinafre",
    "Brócolis",
    "Couve-flor",
    "Repolho",
    "Abobrinha",
    "Abóbora",
    "Berinjela",
    "Pimentão",
    "Pepino",
    "Salsinha",
    "Cebolinha",
    "Coentro",
    "Mandioca",
    "Inhame",
    "Beterraba",
    "Chuchu",
    "Vagem",

    "Feijão carioca",
    "Feijão preto",
    "Lentilha",
    "Grão de bico",
    "Ervilha",
    "Milho verde",
    "Soja",
    "Amendoim",
    "Castanha",
    "Pipoca",

    "Refrigerante",
    "Coca-Cola",
    "Pepsi",
    "Guaraná",
    "Água",
    "Suco",
    "Energético",
    "Isotônico",
    "Shampoo",
    "Condicionador",
    "Sabonete",
    "Pasta de dente",
    "Detergente",
    "Sabão em pó",
    "Amaciante",
    "Desinfetante",
    "Papel higiênico",
    "Papel toalha"
];


// ==============================
// CATEGORIA AUTOMÁTICA
// ==============================

const categoriaAutomatica =
    {
        Alimentos:
            [
                "arroz", "feijão", "macarrão", "farinha",
                "açúcar", "sal", "café", "leite", "óleo",
                "azeite", "margarina", "manteiga", "queijo",
                "presunto", "carne", "frango", "peixe",
                "ovos", "pão", "biscoito", "bolacha",
                "molho", "milho", "ervilha", "batata",
                "cebola", "tomate", "alho", "banana",
                "maçã", "laranja", "limão", "trigo",
                "mandioca", "cereal", "iogurte", "requeijão",
                "creme", "sopa", "molho", "ketchup",
                "maionese", "mostarda", "pimenta", "tempero",
                "ervas", "chá", "chá",
                "cenoura", "alface", "couve", "espinafre",
                "brócolis", "couve-flor", "repolho",
                "abobrinha", "abóbora", "berinjela",
                "pimentão", "pepino", "salsinha", "cebolinha",
                "coentro", "inhame", "beterraba", "chuchu",
                "vagem", "lentilha", "grão de bico",
                "milho verde", "mamão", "melancia", "melão",
                "uva", "morango", "abacaxi", "manga",
                "goiaba", "pera", "pêssego", "kiwi",
                "amora", "ameixa", "tangerina", "maracujá",
                "coco", "caju", "soja", "amendoim",
                "castanha", "pipoca", "verdura", "fruta",
                "legume", "folhas", "acelga", "rúcula",
                "scallion", "cebolinha", "salsão",
                "batata doce"
            ],

        Bebidas:
            [
                "refrigerante", "coca", "pepsi", "guaraná",
                "água", "suco", "energético", "isotônico",
                "cerveja", "vinho", "café", "chá",
                "drink", "NECTAR"
            ],

        Higiene:
            [
                "shampoo", "condicionador", "sabonete",
                "pasta de dente", "creme dental",
                "escova", "fio dental", "desodorante",
                "perfume", "colônia", "loção",
                "protetor solar", "alvejante"
            ],

        Limpeza:
            [
                "detergente", "sabão em pó", "amaciante",
                "desinfetante", "papel higiênico",
                "papel toalha", "limpa", "multiuso",
                "água sanitária", "vinagre",
                "esponja", "luva", "saco",
                "lixeira", "flanelha"
            ],

        Outros:
            []
    };


function detectarCategoria(
    nome
) {

    const nomeLower =
        nome
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    const categorias =
        Object.keys(
            categoriaAutomatica
        );

    for (
        const cat
        of categorias
    ) {

        const palavras =
            categoriaAutomatica[cat];

        for (
            const palavra
            of palavras
        ) {

            const palavraNormalizada =
                palavra
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(
                        /[\u0300-\u036f]/g,
                        ""
                    );

            if (
                nomeLower.includes(
                    palavraNormalizada
                )
            ) {
                return cat;
            }

        }

    }

    return null;

}


// ==============================
// DETECÇÃO CATEGORIA DESPESA
// ==============================

const categoriaDespesaMap =
    {
        "Alimentação":
            [
                "ifood", "uber eats", "rappi", "pedidos",
                "mercado", "supermercado", "feira",
                "padaria", "acougue", "restaurante",
                "lanchonete", "pizzaria", "hamburguer",
                "sushi", "churrasco", "marmitex",
                "comida", "almoço", "jantar", "cafe",
                "lanche", "refrigerante", "suco",
                "arroz", "feijão", "macarrão", "carne",
                "frango", "peixe", "ovo", "leite",
                "pão", "queijo", "presunto", "óleo",
                "açúcar", "café", "sal", "farinha",
                "banana", "maçã", "laranja", "tomate",
                "cebola", "alho", "batata", "cenoura",
                "cenoura", "massa", "molho", "tempero",
                "pizza", "esfirra", "pastel", "empada",
                "acai", "sorvete", "chocolate"
            ],

        "Lazer":
            [
                "cinema", "filme", "netflix", "spotify",
                "amazon prime", "disney", "hbomax",
                "show", "concerto", "ingresso",
                "parque", "balada", "bar", "cerveja",
                "churrasco", "festas", "aniversário",
                "presente", "brinquedo", "jogo",
                "steam", "playstation", "xbox",
                "psn", "game", "viagem", "hotel",
                "passagem", "passeio", "tourismo"
            ],

        "Transporte":
            [
                "gasolina", "combustível", "alcool",
                "etanol", "gas", "gnv", "uber",
                "99", "taxi", "onibus", "ônibus",
                "metrô", "metro", "estacionamento",
                "pedágio", "pedagio", "ipva",
                "seguro auto", "seguro carro",
                "mecânico", "mecanico", "pneu",
                "óleo do carro", "carro", "revisao",
                "revisão", "placa", "multa"
            ],

        "Saúde":
            [
                "remédio", "remedio", "remedios",
                "farmácia", "farmacia", "drogaria",
                "médico", "medico", "consulta",
                "exame", "laboratório", "laboratorio",
                "hospital", "dentista", "óculos",
                "oculos", "vacina", "academia",
                "suplemento", "vitamina", "whey",
                "plano de saúde", "plano de saude",
                "enfermeiro", "fisioterapia",
                "psicólogo", "psicologo", "terapia"
            ],

        "Contas":
            [
                "luz", "energia", "elétrica", "eletrica",
                "água", "agua", "saneamento",
                "internet", "wi-fi", "wifi",
                "telefone", "celular", "conta",
                "aluguel", "condomínio", "condominio",
                "iptu", "taxa", "boleto",
                "empréstimo", "emprestimo", "financiamento",
                "cartão", "cartao", "fatura",
                "seguro", "previdência", "previdencia",
                "condominio", "taxa de condominio"
            ],

        "Educação":
            [
                "escola", "faculdade", "universidade",
                "curso", "aula", "professor",
                "material escolar", "caderno", "livro",
                "cola", "caneta", "lápis",
                "matrícula", "matricula", "mensalidade",
                "vestibular", "concurso", "curso online",
                "udemy", "alura", "coursera"
            ],

        "Vestuário":
            [
                "roupa", "camisa", "calça", "calca",
                "bermuda", "vestido", "saia",
                "tênis", "tenis", "sapato",
                "chinelo", "sandália", "sandalia",
                "jaqueta", "casaco", "moletom",
                "meia", "cueca", "sutiã",
                "marvel", "zara", "renner",
                "c&a", "riachuelo", "centauro",
                "nike", "adidas", "puma"
            ]
    };


function detectarCategoriaDespesa(
    nome
) {

    const nomeLower =
        nome
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    const categorias =
        Object.keys(
            categoriaDespesaMap
        );

    for (
        const cat
        of categorias
    ) {

        const palavras =
            categoriaDespesaMap[cat];

        for (
            const palavra
            of palavras
        ) {

            const palavraNormalizada =
                palavra
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(
                        /[\u0300-\u036f]/g,
                        ""
                    );

            if (
                nomeLower.includes(
                    palavraNormalizada
                )
            ) {
                return cat;
            }

        }

    }

    return null;

}
