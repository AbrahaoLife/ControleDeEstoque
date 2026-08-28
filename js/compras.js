// ==============================
// CARD LISTA DE COMPRAS
// ==============================

function criarCardCompra(
    produto
) {

    const listaCompras =
        document.getElementById(
            "listaCompras"
        );

    const card =
        document.createElement("div");

    card.classList.add(
        "compra"
    );

    card.dataset.categoria =
        produto.categoria;

    const quantidadeAtual =
        Number(
            produto.quantidade
        );

    const estoqueMinimo =
        Number(
            produto.estoqueMinimo
        );

    const quantidadeFaltando =
        estoqueMinimo -
        quantidadeAtual;


    card.innerHTML = `
        <div class="compra-topo">
            <span class="icone-compra">
                🛒
            </span>
            <h3>
                ${escaparHTML(produto.nome)}
            </h3>
        </div>

        <div class="informacoes-compra">
            <div class="info-compra">
                <span>Estoque atual</span>
                <strong class="info-estoque-atual">
                    ${quantidadeAtual}
                </strong>
            </div>

            <div class="info-compra">
                <span>Estoque mínimo</span>
                <strong>
                    ${estoqueMinimo}
                </strong>
            </div>

            <div class="info-compra falta">
                <span>Comprar</span>
                <strong class="info-comprar">
                    ${quantidadeFaltando}
                </strong>
            </div>
        </div>

        <div class="compra-controle">
            <span class="compra-controle-label">
                Estoque
            </span>
            <div class="controle-quantidade"></div>
        </div>

        <button class="comprei">
            ✓ Comprei
        </button>
    `;

    const areaControle =
        card.querySelector(
            ".controle-quantidade"
        );

    const controle =
        criarControleQuantidade(
            quantidadeAtual,
            function (novoValor) {

                if (
                    Number(produto.quantidade) ===
                    novoValor
                ) {
                    return;
                }

                mudarQuantidadeProduto(
                    produto,
                    novoValor,
                    false
                );

                sincronizarCardCompra(
                    card,
                    produto
                );

            }
        );

    areaControle.appendChild(
        controle.controle
    );


    const botaoComprei =
        card.querySelector(
            ".comprei"
        );

    botaoComprei.addEventListener(
        "click",
        function () {

            abrirModalValor(
                produto.nome,
                function (valor) {

                    produto.quantidade =
                        estoqueMinimo;

                    atualizarCardProduto(
                        produto
                    );

                    localStorage.setItem(
                        "produtos",
                        JSON.stringify(
                            produtos
                        )
                    );

                    if (
                        valor !==
                            null
                    ) {
                        registrarDespesaEstoque(
                            produto,
                            valor
                        );
                    }

                    mostrarNotificacao(
                        `${produto.nome} atualizado no estoque!`,
                        "sucesso"
                    );

                    verificarEstoque();

                    atualizarResumo();

                }
            );

        }
    );


    listaCompras.appendChild(
        card
    );
}


// ==============================
// COMPRAS EXTRAS (direto na lista)
// ==============================

(function () {

    const campoNome =
        document.getElementById(
            "compraExtraNome"
        );

    const campoCategoria =
        document.getElementById(
            "compraExtraCategoria"
        );

    const botaoAdicionar =
        document.getElementById(
            "compraExtraAdicionar"
        );

    const campoQtd =
        document.getElementById(
            "compraExtraQtd"
        );

    const sugestoesContainer =
        document.getElementById(
            "sugestoesCompraExtra"
        );

    const subtagsContainer =
        document.getElementById(
            "subtagsCompra"
        );

    if (
        !campoNome ||
        !campoCategoria ||
        !botaoAdicionar
    ) {
        return;
    }


    // ==============================
    // MAPA CATEGORIAS
    // ==============================

    const mapa =
        {
            Alimentos: [
                "arroz", "feijão", "macarrão", "farinha",
                "açúcar", "sal", "café", "leite", "óleo",
                "azeite", "margarina", "manteiga", "queijo",
                "presunto", "carne", "frango", "peixe",
                "ovos", "pão", "biscoito", "bolacha",
                "molho", "milho", "ervilha", "batata",
                "cebola", "tomate", "alho", "banana",
                "maçã", "laranja", "limão", "trigo",
                "cereal", "iogurte", "sopa", "ketchup",
                "maionese", "pizza", "massa", "chocolate",
                "requeijão", "creme", "sorvete", "acai"
            ],
            Bebidas: [
                "refrigerante", "coca", "pepsi", "guaraná",
                "água", "suco", "energético", "cerveja",
                "vinho", "drink", "chá", "isotônico",
                "nectar"
            ],
            Higiene: [
                "shampoo", "condicionador", "sabonete",
                "pasta de dente", "creme dental",
                "desodorante", "perfume", "loção",
                "protetor", "fio dental", "escova",
                "colônia"
            ],
            Limpeza: [
                "detergente", "sabão em pó", "amaciante",
                "desinfetante", "papel higiênico",
                "papel toalha", "multiuso", "esponja",
                "saco", "flanelha", "alvejante",
                "vinagre", "água sanitária"
            ]
        };


    // ==============================
    // DETECÇÃO CATEGORIA
    // ==============================

    function detectar(
        texto
    ) {

        const lower =
            texto
                .toLowerCase()
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                );

        const cats =
            Object.keys(mapa);

        for (
            const cat
            of cats
        ) {

            const palavras =
                mapa[cat];

            for (
                const p
                of palavras
            ) {

                const pNorm =
                    p
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(
                            /[\u0300-\u036f]/g,
                            ""
                        );

                if (
                    lower.includes(pNorm)
                ) {
                    return cat;
                }

            }

        }

        return null;

    }


    // ==============================
    // AUTOCOMPLETE
    // ==============================

    function mostrarSugestoesCompra() {

        const texto =
            campoNome.value
                .toLowerCase()
                .trim();

        if (sugestoesContainer) {
            sugestoesContainer.innerHTML = "";
        }

        if (
            texto.length === 0
        ) {

            if (sugestoesContainer) {
                sugestoesContainer.style.display =
                    "none";
            }

            return;

        }

        const produtosCadastrados =
            produtos.map(
                function (p) {
                    return p.nome;
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
                function (nome) {
                    return normalizarBusca(
                        nome
                    ).includes(alvo);
                }
            );

        const limitados =
            resultados.slice(
                0,
                6
            );

        if (
            limitados.length === 0
        ) {

            if (sugestoesContainer) {
                sugestoesContainer.style.display =
                    "none";
            }

            return;

        }

        for (
            const nome
            of limitados
        ) {

            const div =
                document.createElement(
                    "div"
                );

            div.classList.add(
                "sugestao-produto"
            );

            div.textContent =
                nome;

            div.addEventListener(
                "mousedown",
                function (evento) {

                    evento.preventDefault();

                    campoNome.value =
                        nome;

                    const cat =
                        detectar(nome);

                    if (cat) {
                        campoCategoria.value =
                            cat;
                    }

                    if (sugestoesContainer) {
                        sugestoesContainer.innerHTML =
                            "";
                        sugestoesContainer.style.display =
                            "none";
                    }

                }
            );

            sugestoesContainer.appendChild(
                div
            );

        }

        sugestoesContainer.style.display =
            "block";

    }


    campoNome.addEventListener(
        "input",
        function () {

            const texto =
                campoNome.value.trim();

            if (texto.length >= 2) {
                const cat =
                    detectar(texto);

                if (cat) {
                    campoCategoria.value =
                        cat;
                }
            }

            mostrarSugestoesCompra();

        }
    );


    campoNome.addEventListener(
        "focus",
        mostrarSugestoesCompra
    );


    document.addEventListener(
        "click",
        function (evento) {

            if (
                !evento.target.closest(
                    ".campo-compra-extra"
                )
            ) {

                if (sugestoesContainer) {
                    sugestoesContainer.style.display =
                        "none";
                }

            }

        }
    );


    // ==============================
    // SUBTAGS
    // ==============================

    if (subtagsContainer) {

        const botoes =
            subtagsContainer.querySelectorAll(
                ".subtag"
            );

        for (
            const botao
            of botoes
        ) {

            botao.addEventListener(
                "click",
                function () {

                    const nome =
                        botao.dataset.subtag;

                    campoNome.value =
                        nome;

                    const cat =
                        detectar(nome);

                    if (cat) {
                        campoCategoria.value =
                            cat;
                    }

                }
            );

        }

    }


    // ==============================
    // ENTER NO CAMPO NOME
    // ==============================

    campoNome.addEventListener(
        "keydown",
        function (e) {

            if (e.key === "Enter") {
                botaoAdicionar.click();
            }

        }
    );


    // ==============================
    // ADICIONAR ITEM
    // ==============================

    botaoAdicionar.addEventListener(
        "click",
        function () {

            const nome =
                campoNome.value.trim();

            if (nome === "") {
                mostrarNotificacao(
                    "Digite o nome do item!",
                    "erro"
                );
                campoNome.focus();
                return;
            }

            const categoria =
                campoCategoria.value;

            const quantidade =
                Number(
                    campoQtd.value
                ) || 1;

            const nomeNormalizado =
                normalizarNome(nome);

            const itemExistente =
                comprasExtras.find(
                    function (i) {
                        return (
                            normalizarNome(i.nome) ===
                            nomeNormalizado
                        );
                    }
                );

            if (itemExistente) {

                itemExistente.quantidade =
                    Number(itemExistente.quantidade || 1) +
                    quantidade;

                localStorage.setItem(
                    "comprasExtras",
                    JSON.stringify(
                        comprasExtras
                    )
                );

                campoNome.value = "";
                campoQtd.value = "1";

                renderizarComprasExtras();

                destacarCard(
                    document.querySelector(
                        `#listaComprasExtras .compra-extra` +
                        `[data-id="${itemExistente.id}"]`
                    )
                );

                mostrarNotificacao(
                    `"${nome}" já estava na lista! Quantidade aumentada para ${itemExistente.quantidade}.`,
                    "atualizado"
                );

                return;
            }

            const item = {
                id: Date.now(),
                nome: nome,
                categoria: categoria,
                quantidade: quantidade
            };

            comprasExtras.push(item);

            localStorage.setItem(
                "comprasExtras",
                JSON.stringify(
                    comprasExtras
                )
            );

            campoNome.value = "";
            campoQtd.value = "1";

            renderizarComprasExtras();

            mostrarNotificacao(
                `"${nome}" adicionado à lista!`,
                "sucesso"
            );

        }
    );


    // ==============================
    // RENDERIZAR ITENS
    // ==============================

    window.renderizarComprasExtras =
        function () {

            const container =
                document.getElementById(
                    "listaComprasExtras"
                );

            if (!container) {
                return;
            }

            container.innerHTML = "";

            if (comprasExtras.length === 0) {
                atualizarVisibilidadeSubtitulosCompras();
                return;
            }

            for (
                const item
                of comprasExtras
            ) {

                const card =
                    document.createElement("div");

                card.classList.add(
                    "compra",
                    "compra-extra"
                );

                card.dataset.categoria =
                    item.categoria;

                card.dataset.id =
                    item.id;

                const catCores =
                    {
                        Alimentos: "#16a34a",
                        Limpeza: "#9333ea",
                        Higiene: "#e11d48",
                        Bebidas: "#2563eb",
                        Outros: "#6b7280"
                    };

                const cor =
                    catCores[item.categoria] ||
                    "#6b7280";

                card.innerHTML = `
                    <div class="compra-topo">
                        <span class="icone-compra">📝</span>
                        <h3>${escaparHTML(item.nome)}</h3>
                        <span class="compra-extra-badge" style="background: ${cor}">${escaparHTML(item.categoria)}</span>
                    </div>
                    <div class="compra-controle compra-extra-controle">
                        <span class="compra-controle-label">Comprar</span>
                        <div class="controle-quantidade"></div>
                    </div>
                    <div class="compra-botoes">
                        <button class="comprei">
                            ✓ Comprei
                        </button>
                        <button class="compra-excluir">
                            ✕
                        </button>
                    </div>
                `;


                const areaControle =
                    card.querySelector(
                        ".controle-quantidade"
                    );

                const controle =
                    criarControleQuantidade(
                        item.quantidade || 1,
                        function (novoValor) {

                            if (novoValor < 1) {
                                novoValor = 1;
                            }

                            item.quantidade =
                                novoValor;

                            localStorage.setItem(
                                "comprasExtras",
                                JSON.stringify(
                                    comprasExtras
                                )
                            );

                        }
                    );

                areaControle.appendChild(
                    controle.controle
                );


                const botaoComprei =
                    card.querySelector(
                        ".comprei"
                    );

                botaoComprei.addEventListener(
                    "click",
                    function () {

                        abrirModalValor(
                            item.nome,
                            function (valor) {

                                const mapeamentoCat =
                                    {
                                        Alimentos: "Alimentação",
                                        Bebidas: "Alimentação",
                                        Limpeza: "Outros",
                                        Higiene: "Outros",
                                        Outros: "Outros"
                                    };

                                const despesa = {
                                    id: Date.now(),
                                    descricao: item.nome,
                                    valor: valor || 0,
                                    categoria: mapeamentoCat[item.categoria] || "Outros",
                                    tipo: "livre",
                                    data: Date.now()
                                };

                                if (
                                    valor !== null &&
                                    valor > 0
                                ) {
                                    despesas.push(despesa);

                                    localStorage.setItem(
                                        "despesas",
                                        JSON.stringify(despesas)
                                    );
                                }

                                const indice =
                                    comprasExtras.indexOf(item);

                                if (indice > -1) {
                                    comprasExtras.splice(indice, 1);
                                }

                                localStorage.setItem(
                                    "comprasExtras",
                                    JSON.stringify(comprasExtras)
                                );

                                renderizarComprasExtras();

                                mostrarNotificacao(
                                    `"${item.nome}" comprado!`,
                                    "sucesso"
                                );

                            }
                        );

                    }
                );


                const botaoExcluir =
                    card.querySelector(
                        ".compra-excluir"
                    );

                botaoExcluir.addEventListener(
                    "click",
                    function () {

                        const indice =
                            comprasExtras.indexOf(item);

                        if (indice > -1) {
                            comprasExtras.splice(indice, 1);
                        }

                        localStorage.setItem(
                            "comprasExtras",
                            JSON.stringify(comprasExtras)
                        );

                        renderizarComprasExtras();

                        mostrarNotificacao(
                            "Item removido!",
                            "sucesso"
                        );

                    }
                );


                container.appendChild(
                    card
                );

            }

            atualizarVisibilidadeSubtitulosCompras();

        };

})();
