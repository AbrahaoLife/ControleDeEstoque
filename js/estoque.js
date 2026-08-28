// ==============================
// RESUMO
// ==============================

function atualizarResumo() {

    const totalProdutos =
        document.getElementById(
            "totalProdutos"
        );

    const produtosBaixos =
        document.getElementById(
            "produtosBaixos"
        );

    const totalCompras =
        document.getElementById(
            "totalCompras"
        );

    totalProdutos.textContent =
        produtos.length;

    const baixos =
        produtos.filter(
            function (produto) {
                return (
                    Number(produto.quantidade) <
                    Number(produto.estoqueMinimo)
                );
            }
        ).length;

    produtosBaixos.textContent =
        baixos;

    totalCompras.textContent =
        baixos;
}


// ==============================
// MUDAR QUANTIDADE DO PRODUTO
// ==============================

function mudarQuantidadeProduto(
    produto,
    novaQuantidade,
    rerenderListaCompras
) {

    if (
        !Number.isFinite(novaQuantidade)
    ) {
        novaQuantidade = 0;
    }

    if (novaQuantidade < 0) {
        novaQuantidade = 0;
    }

    novaQuantidade =
        Math.floor(novaQuantidade);

    if (
        Number(produto.quantidade) ===
        novaQuantidade
    ) {
        return;
    }

    produto.quantidade =
        novaQuantidade;

    localStorage.setItem(
        "produtos",
        JSON.stringify(
            produtos
        )
    );

    atualizarCardProduto(
        produto
    );

    if (rerenderListaCompras !== false) {

        verificarEstoque();
        verificarEstoqueVazio();

    }

    atualizarResumo();

}


// ==============================
// CRIAR CARD PRODUTO
// ==============================

function criarCardProduto(
    produtoSalvo
) {

    const produto =
        document.createElement("div");

    produto.classList.add(
        "produto"
    );

    produto.dataset.categoria =
        produtoSalvo.categoria;

    produto.dataset.id =
        produtoSalvo.id;

    produto.innerHTML = `
        <h3>
            ${escaparHTML(produtoSalvo.nome)}
        </h3>
        <p>
            Categoria:
            ${escaparHTML(produtoSalvo.categoria)}
        </p>
        <p>
            Mínimo:
            ${escaparHTML(String(produtoSalvo.estoqueMinimo))}
        </p>
        <div class="produto-quantidade">
            <span class="quantidade-label">
                Quantidade
            </span>
            <div class="controle-quantidade"></div>
        </div>
        <div class="produto-botoes">
            <button class="editar">
                Editar
            </button>
            <button class="excluir">
                Excluir
            </button>
        </div>
    `;

    const botaoEditar =
        produto.querySelector(
            ".editar"
        );

    const botaoExcluir =
        produto.querySelector(
            ".excluir"
        );

    const areaControle =
        produto.querySelector(
            ".controle-quantidade"
        );

    const controle =
        criarControleQuantidade(
            produtoSalvo.quantidade,
            function (novoValor) {

                mudarQuantidadeProduto(
                    produtoSalvo,
                    novoValor,
                    true
                );

            }
        );

    areaControle.appendChild(
        controle.controle
    );


    // ==============================
    // EDITAR
    // ==============================

    botaoEditar.addEventListener(
        "click",
        function () {

            produtoEditando =
                produtoSalvo.id;

            cardEditando =
                produto;

            campoNome.value =
                produtoSalvo.nome;

            campoQuantidade.value =
                produtoSalvo.quantidade;

            campoCategoria.value =
                produtoSalvo.categoria;

            campoEstoqueMinimo.value =
                produtoSalvo.estoqueMinimo;

            botao.textContent =
                "Salvar Alterações";

            botao.classList.add(
                "editando"
            );

            botaoCancelar.style.display =
                "inline-block";

            campoNome.focus();

        }
    );


    // ==============================
    // EXCLUIR
    // ==============================

    botaoExcluir.addEventListener(
        "click",
        function () {

            const idProduto =
                produto.dataset.id;

            const novaLista =
                produtos.filter(
                    function (item) {
                        return (
                            item.id !=
                            idProduto
                        );
                    }
                );

            produtos.length = 0;

            produtos.push(
                ...novaLista
            );

            localStorage.setItem(
                "produtos",
                JSON.stringify(
                    produtos
                )
            );

            produto.remove();

            verificarEstoque();
            verificarEstoqueVazio();

            atualizarResumo();

        }
    );


    listaProdutos.appendChild(
        produto
    );
}


// ==============================
// ATUALIZAR CARD (QUANTIDADE)
// ==============================

function atualizarCardProduto(
    produto
) {

    const card =
        document.querySelector(
            `.produto[data-id="${produto.id}"]`
        );

    if (!card) {
        return;
    }

    const quantidade =
        card.querySelector(
            ".qtd-numero"
        );

    if (
        quantidade &&
        Number(quantidade.textContent) !==
        Number(produto.quantidade)
    ) {
        quantidade.textContent =
            produto.quantidade;
    }
}


// ==============================
// ATUALIZAR CARD COMPLETO
// ==============================

function atualizarCardProdutoCompleto(
    produto
) {

    const card =
        document.querySelector(
            `.produto[data-id="${produto.id}"]`
        );

    if (!card) {
        return;
    }

    card.dataset.categoria =
        produto.categoria;

    const nome =
        card.querySelector("h3");

    const quantidade =
        card.querySelector(
            ".qtd-numero"
        );

    const categoria =
        card.querySelector(
            "p:nth-of-type(1)"
        );

    const minimo =
        card.querySelector(
            "p:nth-of-type(2)"
        );

    nome.textContent =
        produto.nome;

    if (
        quantidade &&
        Number(quantidade.value) !==
        Number(produto.quantidade)
    ) {
        quantidade.value =
            produto.quantidade;
    }

    categoria.textContent =
        `Categoria: ${produto.categoria}`;

    minimo.textContent =
        `Mínimo: ${produto.estoqueMinimo}`;
}


// ==============================
// MOSTRAR PRODUTOS
// ==============================

function mostrarProdutos() {

    if (produtos.length === 0) {

        const vazio =
            document.createElement("div");

        vazio.classList.add(
            "estoque-vazio"
        );

        vazio.innerHTML = `
            <div class="icone-estoque-vazia">
                📦
            </div>
            <h3>
                Seu estoque está vazio!
            </h3>
            <p>
                Adicione produtos usando o formulário acima.
            </p>
        `;

        listaProdutos.appendChild(
            vazio
        );

        return;
    }

    for (
        const produto
        of produtos
    ) {
        criarCardProduto(
            produto
        );
    }
}


// ==============================
// VERIFICAR ESTOQUE VAZIO
// ==============================

function verificarEstoqueVazio() {

    const vazio =
        listaProdutos.querySelector(
            ".estoque-vazio"
        );

    const cards =
        listaProdutos.querySelectorAll(
            ".produto"
        );

    if (
        cards.length === 0 && !vazio
    ) {

        const mensagem =
            document.createElement("div");

        mensagem.classList.add(
            "estoque-vazio"
        );

        mensagem.innerHTML = `
            <div class="icone-estoque-vazia">
                📦
            </div>
            <h3>
                Seu estoque está vazio!
            </h3>
            <p>
                Adicione produtos usando o formulário acima.
            </p>
        `;

        listaProdutos.appendChild(
            mensagem
        );

    }
    else if (
        cards.length > 0 && vazio
    ) {
        vazio.remove();
    }
}


// ==============================
// VERIFICAR ESTOQUE (COMPRAS)
// ==============================

function verificarEstoque() {

    const listaCompras =
        document.getElementById(
            "listaCompras"
        );

    listaCompras.innerHTML = "";

    let produtosParaComprar = 0;

    for (
        const produto
        of produtos
    ) {

        if (
            Number(produto.quantidade) <
            Number(produto.estoqueMinimo)
        ) {

            criarCardCompra(
                produto
            );

            produtosParaComprar++;

        }

    }

    if (produtosParaComprar === 0) {

        const vazio =
            document.createElement("div");

        vazio.classList.add(
            "lista-compras-vazia"
        );

        vazio.innerHTML = `
            <div class="icone-lista-vazia">
                🛒
            </div>
            <h3>
                Sua lista de compras está vazia!
            </h3>
            <p>
                Todos os produtos estão com estoque suficiente. 🎉
            </p>
        `;

        listaCompras.appendChild(
            vazio
        );

    }
}


// ==============================
// LIMPAR FORMULÁRIO
// ==============================

function limparFormulario() {

    campoNome.value = "";

    campoQuantidade.value = "";

    campoCategoria.value =
        "Alimentos";

    campoEstoqueMinimo.value = "";

    esconderSugestoes();
}


// ==============================
// CANCELAR EDIÇÃO
// ==============================

function cancelarEdicao() {

    produtoEditando = null;

    cardEditando = null;

    limparFormulario();

    botao.textContent =
        "Adicionar Produto";

    botao.classList.remove(
        "editando"
    );

    botaoCancelar.style.display =
        "none";
}


botaoCancelar.addEventListener(
    "click",
    cancelarEdicao
);


// ==============================
// CATEGORIA AUTOMÁTICA
// ==============================

campoNome.addEventListener(
    "input",
    function () {

        const nome =
            campoNome.value.trim();

        if (nome.length < 2) {
            return;
        }

        const detectada =
            detectarCategoria(
                nome
            );

        if (detectada) {
            campoCategoria.value =
                detectada;
        }

    }
);


// ==============================
// ADICIONAR / EDITAR
// ==============================

botao.addEventListener(
    "click",
    function () {

        const nome =
            campoNome.value.trim();

        const quantidadeTexto =
            campoQuantidade.value;

        const categoria =
            campoCategoria.value;

        const estoqueTexto =
            campoEstoqueMinimo.value;


        // NOME

        if (nome === "") {

            mostrarNotificacao(
                "Digite o nome do produto!",
                "erro"
            );

            campoNome.focus();

            return;
        }


        // QUANTIDADE

        if (
            quantidadeTexto.trim() === ""
        ) {

            mostrarNotificacao(
                "Digite a quantidade do produto!",
                "erro"
            );

            campoQuantidade.focus();

            return;
        }


        // ESTOQUE MÍNIMO

        if (
            estoqueTexto.trim() === ""
        ) {

            mostrarNotificacao(
                "Digite o estoque mínimo!",
                "erro"
            );

            campoEstoqueMinimo.focus();

            return;
        }


        const quantidade =
            Number(
                quantidadeTexto
            );

        const estoque =
            Number(
                estoqueTexto
            );


        // NÚMEROS VÁLIDOS

        if (
            !Number.isFinite(
                quantidade
            ) ||
            !Number.isFinite(
                estoque
            )
        ) {

            mostrarNotificacao(
                "Digite números válidos!",
                "erro"
            );

            return;
        }


        // NEGATIVOS

        if (
            quantidade < 0 ||
            estoque < 0
        ) {

            mostrarNotificacao(
                "Os valores não podem ser negativos!",
                "erro"
            );

            return;
        }


        // INTEIROS

        if (
            !Number.isInteger(
                quantidade
            ) ||
            !Number.isInteger(
                estoque
            )
        ) {

            mostrarNotificacao(
                "Use apenas números inteiros!",
                "erro"
            );

            return;
        }


        // ADICIONAR

        if (
            produtoEditando === null
        ) {

            const nomeNormalizado =
                normalizarNome(nome);

            const produtoNormalizadoEncontrado =
                produtos.some(
                    function (item) {
                        return (
                            normalizarNome(item.nome) ===
                            nomeNormalizado
                        );
                    }
                );

            if (produtoNormalizadoEncontrado) {

                const existente =
                    encontrarProdutoDuplicado(
                        nome
                    );

                mostrarNotificacao(
                    `"${nome}" já existe no estoque! (Quantidade: ${existente.quantidade}, Categoria: ${existente.categoria})`,
                    "erro"
                );

                destacarCard(
                    document.querySelector(
                        `.produto[data-id="${existente.id}"]`
                    )
                );

                return;
            }

            const produtoSalvo = {

                id: Date.now(),

                nome: nome,

                quantidade:
                    quantidade,

                categoria:
                    categoria,

                estoqueMinimo:
                    estoque

            };

            produtos.push(
                produtoSalvo
            );

            criarCardProduto(
                produtoSalvo
            );

            mostrarNotificacao(
                "Produto adicionado com sucesso!",
                "sucesso"
            );

        }


        // EDITAR

        else {

            const produto =
                produtos.find(
                    function (item) {
                        return (
                            item.id ===
                            produtoEditando
                        );
                    }
                );

            if (!produto) {

                mostrarNotificacao(
                    "Produto não encontrado!",
                    "erro"
                );

                return;
            }

            const outroNome =
                encontrarProdutoDuplicado(
                    nome,
                    produto.id
                );

            if (outroNome) {

                mostrarNotificacao(
                    `"${nome}" já existe no estoque! (Quantidade: ${outroNome.quantidade}, Categoria: ${outroNome.categoria})`,
                    "erro"
                );

                destacarCard(
                    document.querySelector(
                        `.produto[data-id="${outroNome.id}"]`
                    )
                );

                return;
            }

            produto.nome =
                nome;

            produto.quantidade =
                quantidade;

            produto.categoria =
                categoria;

            produto.estoqueMinimo =
                estoque;

            atualizarCardProdutoCompleto(
                produto
            );

            mostrarNotificacao(
                "Produto atualizado com sucesso!",
                "atualizado"
            );

            produtoEditando = null;

            cardEditando = null;

            botao.textContent =
                "Adicionar Produto";

            botao.classList.remove(
                "editando"
            );

            botaoCancelar.style.display =
                "none";

        }


        localStorage.setItem(
            "produtos",
            JSON.stringify(
                produtos
            )
        );

        limparFormulario();

        verificarEstoque();

        verificarEstoqueVazio();

        atualizarResumo();

    }
);
