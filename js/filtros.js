// ==============================
// FILTRAR PRODUTOS
// ==============================

function filtrarProdutos(
    categoria
) {

    const cardsProdutos =
        document.querySelectorAll(
            ".produto"
        );

    const pesquisa =
        document
            .getElementById(
                "pesquisaProduto"
            )
            .value
            .toLowerCase()
            .trim();

    let visiveis = 0;

    for (
        const produto
        of cardsProdutos
    ) {

        const nome =
            produto
                .querySelector("h3")
                .textContent
                .toLowerCase();

        const categoriaProduto =
            produto.dataset.categoria;

        const correspondeCategoria =
            categoria === "Todos" ||
            categoriaProduto === categoria;

        const correspondePesquisa =
            nome.includes(
                pesquisa
            );

        if (
            correspondeCategoria &&
            correspondePesquisa
        ) {

            produto.style.display =
                "block";

            visiveis++;

        }
        else {

            produto.style.display =
                "none";

        }

    }


    const mensagemFiltro =
        document.getElementById(
            "mensagemFiltro"
        );

    if (visiveis === 0) {

        if (!mensagemFiltro) {

            const aviso =
                document.createElement("div");

            aviso.id =
                "mensagemFiltro";

            aviso.classList.add(
                "estoque-vazio"
            );

            aviso.innerHTML = `
                <div class="icone-estoque-vazia">
                    🔍
                </div>
                <h3>
                    Nenhum produto encontrado!
                </h3>
                <p>
                    Nenhum produto corresponde a esta busca ou categoria.
                </p>
            `;

            listaProdutos.appendChild(
                aviso
            );

        }

    }
    else {

        if (mensagemFiltro) {
            mensagemFiltro.remove();
        }

    }


    const cardsCompras =
        document.querySelectorAll(
            ".compra"
        );

    let comprasVisiveis = 0;

    for (
        const compra
        of cardsCompras
    ) {

        const catCompra =
            compra.dataset.categoria;

        const corresponde =
            categoria === "Todos" ||
            catCompra === categoria;

        if (corresponde) {
            compra.style.display = "";
            comprasVisiveis++;
        }
        else {
            compra.style.display = "none";
        }

    }


    const vazioCompras =
        document.getElementById(
            "mensagemComprasVazia"
        );

    if (
        comprasVisiveis === 0 &&
        cardsCompras.length > 0
    ) {

        if (!vazioCompras) {

            const aviso =
                document.createElement("div");

            aviso.id =
                "mensagemComprasVazia";

            aviso.classList.add(
                "lista-compras-vazia"
            );

            aviso.innerHTML = `
                <div class="icone-lista-vazia">
                    🔍
                </div>
                <h3>
                    Nenhum item nesta categoria!
                </h3>
                <p>
                    Nenhum produto com estoque baixo nesta categoria.
                </p>
            `;

            document
                .getElementById("listaCompras")
                .appendChild(aviso);

        }

    }
    else {

        if (vazioCompras) {
            vazioCompras.remove();
        }

    }

}


// ==============================
// CATEGORIAS
// ==============================

function configurarBotao(
    botaoCategoria,
    categoria
) {

    botaoCategoria.addEventListener(
        "click",
        function () {

            categoriaSelecionada =
                categoria;

            const botoes =
                document.querySelectorAll(
                    ".Categorias button"
                );

            for (
                const botao
                of botoes
            ) {
                botao.classList.remove(
                    "ativo"
                );
            }

            botaoCategoria.classList.add(
                "ativo"
            );

            filtrarProdutos(
                categoriaSelecionada
            );

        }
    );
}


configurarBotao(
    document.getElementById("todos"),
    "Todos"
);

configurarBotao(
    document.getElementById("alimentos"),
    "Alimentos"
);

configurarBotao(
    document.getElementById("limpeza"),
    "Limpeza"
);

configurarBotao(
    document.getElementById("higiene"),
    "Higiene"
);

configurarBotao(
    document.getElementById("bebidas"),
    "Bebidas"
);

configurarBotao(
    document.getElementById("outros"),
    "Outros"
);


// ==============================
// PESQUISA
// ==============================

const campoPesquisa =
    document.getElementById(
        "pesquisaProduto"
    );

campoPesquisa.addEventListener(
    "input",
    function () {

        filtrarProdutos(
            categoriaSelecionada
        );

    }
);


// ==============================
// AUTOCOMPLETE
// ==============================

function mostrarSugestoes() {

    const texto =
        campoNome.value
            .toLowerCase()
            .trim();

    sugestoesProdutos.innerHTML = "";

    if (
        texto.length === 0
    ) {

        esconderSugestoes();

        return;
    }

    const produtosCadastrados =
        produtos.map(
            function (produto) {
                return produto.nome;
            }
        );

    const lista =
        [
            ...sugestoes,
            ...produtosCadastrados
        ];

    const vistos =
        {};

    const listaUnica =
        lista.filter(
            function (nome) {

                const chave =
                    normalizarBusca(nome);

                if (vistos[chave]) {
                    return false;
                }

                vistos[chave] =
                    true;

                return true;

            }
        );

    const alvo =
        normalizarBusca(texto);

    const resultados =
        listaUnica.filter(
            function (produto) {
                return normalizarBusca(
                    produto
                ).includes(alvo);
            }
        );

    const resultadosLimitados =
        resultados.slice(
            0,
            6
        );

    if (
        resultadosLimitados.length === 0
    ) {

        esconderSugestoes();

        return;
    }

    for (
        const nome
        of resultadosLimitados
    ) {

        const sugestao =
            document.createElement(
                "div"
            );

        sugestao.classList.add(
            "sugestao-produto"
        );

        sugestao.textContent =
            nome;

        sugestao.addEventListener(
            "mousedown",
            function (evento) {

                evento.preventDefault();

                campoNome.value =
                    nome;

                campoNome.dispatchEvent(
                    new Event("input")
                );

                esconderSugestoes();

            }
        );

        sugestoesProdutos.appendChild(
            sugestao
        );

    }

    sugestoesProdutos.style.display =
        "block";
}


function esconderSugestoes() {

    sugestoesProdutos.innerHTML = "";

    sugestoesProdutos.style.display =
        "none";
}


campoNome.addEventListener(
    "input",
    mostrarSugestoes
);


campoNome.addEventListener(
    "focus",
    mostrarSugestoes
);


document.addEventListener(
    "click",
    function (evento) {

        if (
            !evento.target.closest(
                ".campo-produto"
            )
        ) {

            esconderSugestoes();

        }

    }
);
