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
    "Batata",
    "Cebola",
    "Tomate",
    "Alho",
    "Banana",
    "Maçã",
    "Laranja",
    "Limão",
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
                "ervas", "chá", "chá"
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
