// ==============================
// FINANCEIRO - DADOS
// ==============================

let saldoInicial =
    carregarDado(
        "saldoInicial",
        0
    );

let despesas =
    carregarDado(
        "despesas",
        []
    );

let categoriaFinanceiro =
    "Todos";


// ==============================
// NOMES DOS MESES
// ==============================

const nomesMeses =
    [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];


function obterRefMes() {

    const agora =
        new Date();

    return (
        agora.getFullYear() +
        "-" +
        String(
            agora.getMonth() + 1
        ).padStart(2, "0")
    );

}


// ==============================
// ARQUIVAR MÊS ANTERIOR
// ==============================

function verificarTrocaMes() {

    const refAtual =
        obterRefMes();

    const refSalva =
        localStorage.getItem(
            "mesAtualRef"
        ) || "";

    if (
        refSalva === ""
    ) {

        localStorage.setItem(
            "mesAtualRef",
            refAtual
        );

        return;

    }

    if (
        refSalva === refAtual
    ) {
        return;
    }


    // Mês mudou — arquivar

    const antigoSaldo =
        carregarDado(
            "saldoInicial",
            0
        );

    const antigoDespesas =
        carregarDado(
            "despesas",
            []
        );

    const totalGasto =
        antigoDespesas.reduce(
            function (s, d) {
                return s +
                    Number(d.valor);
            },
            0
        );


    if (
        antigoSaldo > 0 ||
        antigoDespesas.length > 0
    ) {

        const partes =
            refSalva.split("-");

        const ano =
            Number(partes[0]);

        const mes =
            Number(partes[1]) - 1;

        const nomeMes =
            nomesMeses[mes] +
            " " +
            ano;

        const log =
            {
                ref:
                    refSalva,

                nome:
                    nomeMes,

                saldoInicial:
                    antigoSaldo,

                totalDespesas:
                    totalGasto,

                despesas:
                    antigoDespesas
            };


        const logsExistentes =
            carregarDado("mesesLogs", []);

        logsExistentes.push(
            log
        );

        localStorage.setItem(
            "mesesLogs",
            JSON.stringify(
                logsExistentes
            )
        );

    }


    // Resetar para o mês novo

    localStorage.setItem(
        "saldoInicial",
        JSON.stringify(0)
    );

    localStorage.setItem(
        "despesas",
        JSON.stringify([])
    );

    localStorage.setItem(
        "mesAtualRef",
        refAtual
    );

    saldoInicial = 0;

    despesas.length = 0;

}


// ==============================
// FORMATAR MOEDA
// ==============================

function formatarMoeda(
    valor
) {
    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


// ==============================
// FORMATAR DATA
// ==============================

function formatarData(
    timestamp
) {
    const data =
        new Date(timestamp);

    return data.toLocaleDateString(
        "pt-BR"
    );
}


// ==============================
// ATUALIZAR RESUMO FINANCEIRO
// ==============================

function atualizarResumoFinanceiro() {

    const totalDespesas =
        despesas.reduce(
            function (soma, desp) {
                return soma +
                    Number(
                        desp.valor
                    );
            },
            0
        );

    const saldoAtual =
        saldoInicial -
        totalDespesas;

    const elSaldoInicial =
        document.getElementById(
            "finSaldoInicial"
        );

    const elTotalDespesas =
        document.getElementById(
            "finTotalDespesas"
        );

    const elSaldoAtual =
        document.getElementById(
            "finSaldoAtual"
        );

    if (elSaldoInicial) {
        elSaldoInicial.textContent =
            formatarMoeda(
                saldoInicial
            );
    }

    if (elTotalDespesas) {
        elTotalDespesas.textContent =
            formatarMoeda(
                totalDespesas
            );
    }

    if (elSaldoAtual) {
        elSaldoAtual.textContent =
            formatarMoeda(
                saldoAtual
            );

        if (saldoAtual < 0) {
            elSaldoAtual.style.color =
                "var(--cor-erro)";
        }
        else {
            elSaldoAtual.style.color =
                "";
        }
    }
}


// ==============================
// SALVAR SALDO INICIAL
// ==============================

(function () {

    const botaoSalvar =
        document.getElementById(
            "finSalvarSaldo"
        );

    const campoSaldo =
        document.getElementById(
            "finSaldoInput"
        );

    if (botaoSalvar) {

        if (saldoInicial > 0) {
            campoSaldo.value =
                saldoInicial;
        }

        botaoSalvar.addEventListener(
            "click",
            function () {

                const valor =
                    Number(
                        campoSaldo.value
                    );

                if (
                    campoSaldo.value
                        .trim() === ""
                ) {
                    mostrarNotificacao(
                        "Digite o valor do saldo!",
                        "erro"
                    );
                    campoSaldo.focus();
                    return;
                }

                if (
                    !Number.isFinite(
                        valor
                    ) ||
                    valor < 0
                ) {
                    mostrarNotificacao(
                        "Digite um valor válido!",
                        "erro"
                    );
                    return;
                }

                localStorage.setItem(
                    "saldoInicial",
                    JSON.stringify(
                        valor
                    )
                );

                location.reload();

            }
        );

    }

})();


// ==============================
// CRIAR CARD DESPESA
// ==============================

function criarCardDespesa(
    despesa
) {

    const lista =
        document.getElementById(
            "finHistorico"
        );

    const card =
        document.createElement("div");

    card.classList.add(
        "despesa-item"
    );

    card.dataset.categoria =
        despesa.categoria;

    const icone =
        despesa.tipo === "estoque"
            ? "🛒"
            : "💸";

    card.innerHTML = `
        <span class="despesa-icone">
            ${icone}
        </span>
        <span class="despesa-nome">
            ${escaparHTML(despesa.descricao)}
        </span>
        <span class="despesa-valor">
            ${formatarMoeda(
                despesa.valor
            )}
        </span>
        <span class="despesa-cat cat-${escaparHTML(despesa.categoria.toLowerCase())}">
            ${escaparHTML(despesa.categoria)}
        </span>
        <span class="despesa-data">
            ${formatarData(
                despesa.data
            )}
        </span>
        <button class="despesa-excluir">
            ✕
        </button>
    `;


    const botaoExcluir =
        card.querySelector(
            ".despesa-excluir"
        );

    botaoExcluir.addEventListener(
        "click",
        function () {

            const indice =
                despesas.indexOf(
                    despesa
                );

            if (indice > -1) {
                despesas.splice(
                    indice,
                    1
                );
            }

            localStorage.setItem(
                "despesas",
                JSON.stringify(
                    despesas
                )
            );

            card.remove();

            atualizarResumoFinanceiro();

            mostrarNotificacao(
                "Despesa excluída!",
                "sucesso"
            );

        }
    );


    lista.appendChild(
        card
    );
}


// ==============================
// FILTRAR DESPESAS POR CATEGORIA
// ==============================

function filtrarDespesasFinanceiro() {

    const items =
        document.querySelectorAll(
            "#finHistorico .despesa-item"
        );

    for (
        const item
        of items
    ) {

        const cat =
            item.dataset.categoria;

        const corresponde =
            categoriaFinanceiro ===
                "Todos" ||
            cat ===
                categoriaFinanceiro;

        item.style.display =
            corresponde ? "" : "none";

    }
}


// ==============================
// ATUALIZAR HISTÓRICO
// ==============================

function atualizarHistorico() {

    const lista =
        document.getElementById(
            "finHistorico"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    const despesasFiltradas =
        categoriaFinanceiro ===
            "Todos"
            ? despesas
            : despesas.filter(
                function (d) {
                    return (
                        d.categoria ===
                        categoriaFinanceiro
                    );
                }
            );

    if (
        despesasFiltradas.length === 0
    ) {

        const vazio =
            document.createElement("div");

        vazio.classList.add(
            "lista-compras-vazia"
        );

        vazio.innerHTML = `
            <div class="icone-lista-vazia">
                💰
            </div>
            <h3>
                Nenhuma despesa registrada!
            </h3>
            <p>
                Registre despesas livres ou compre itens da lista.
            </p>
        `;

        lista.appendChild(
            vazio
        );

    }
    else {

        const invertido =
            despesasFiltradas.slice()
                .reverse();

        for (
            const despesa
            of invertido
        ) {
            criarCardDespesa(
                despesa
            );
        }

    }
}


// ==============================
// ADICIONAR DESPESA LIVRE
// ==============================

(function () {

    const botaoAdicionar =
        document.getElementById(
            "finAdicionarDespesa"
        );

    const campoDescricao =
        document.getElementById(
            "finDescricao"
        );

    const campoValor =
        document.getElementById(
            "finValor"
        );

    const campoCategoria =
        document.getElementById(
            "finCategoriaDespesa"
        );

    const sugestoesDespesa =
        document.getElementById(
            "sugestoesDespesa"
        );

    const subtagsDespesa =
        document.getElementById(
            "subtagsDespesa"
        );

    function atualizarSubtagsAtivas() {

        if (!subtagsDespesa) {
            return;
        }

        const catAtual =
            campoCategoria.value;

        const botoes =
            subtagsDespesa.querySelectorAll(
                ".subtag"
            );

        for (
            const b
            of botoes
        ) {

            if (
                b.dataset.catDespesa ===
                catAtual
            ) {
                b.classList.add(
                    "subtag-ativo"
                );
            }
            else {
                b.classList.remove(
                    "subtag-ativo"
                );
            }

        }

    }

    window.atualizarSubtagsAtivas =
        atualizarSubtagsAtivas;


    // ==============================
    // AUTOCOMPLETE DESPESA
    // ==============================

    function mostrarSugestoesDespesa() {

        if (!sugestoesDespesa) {
            return;
        }

        const texto =
            campoDescricao.value
                .toLowerCase()
                .trim();

        sugestoesDespesa.innerHTML = "";

        if (
            texto.length === 0
        ) {

            sugestoesDespesa.style.display =
                "none";

            return;

        }

        const listaGastos =
            despesas.map(
                function (d) {
                    return d.descricao;
                }
            );

        const lista =
            [...listaGastos];

        const listaUnica =
            [
                ...new Set(
                    lista
                )
            ];

        const resultados =
            listaUnica.filter(
                function (nome) {
                    return nome
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(
                            /[\u0300-\u036f]/g,
                            ""
                        )
                        .includes(
                            texto
                                .normalize("NFD")
                                .replace(
                                    /[\u0300-\u036f]/g,
                                    ""
                                )
                        );
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

            sugestoesDespesa.style.display =
                "none";

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

                    campoDescricao.value =
                        nome;

                    const cat =
                        detectarCategoriaDespesa(
                            nome
                        );

                    if (cat) {
                        campoCategoria.value =
                            cat;
                    }

                    sugestoesDespesa.innerHTML =
                        "";
                    sugestoesDespesa.style.display =
                        "none";

                }
            );

            sugestoesDespesa.appendChild(
                div
            );

        }

        sugestoesDespesa.style.display =
            "block";

    }


    campoDescricao.addEventListener(
        "input",
        function () {

            const nome =
                campoDescricao.value.trim();

            if (nome.length < 2) {
                return;
            }

            const detectada =
                detectarCategoriaDespesa(
                    nome
                );

            if (detectada) {
                campoCategoria.value =
                    detectada;
                atualizarSubtagsAtivas();
            }

            mostrarSugestoesDespesa();

        }
    );


    campoDescricao.addEventListener(
        "focus",
        mostrarSugestoesDespesa
    );


    document.addEventListener(
        "click",
        function (evento) {

            if (
                !evento.target.closest(
                    ".campo-compra-extra"
                )
            ) {

                if (sugestoesDespesa) {
                    sugestoesDespesa.style.display =
                        "none";
                }

            }

        }
    );


    // ==============================
    // SUBTAGS DESPESA
    // ==============================

    if (subtagsDespesa) {

        const botoesSubtag =
            subtagsDespesa.querySelectorAll(
                ".subtag"
            );

        for (
            const botao
            of botoesSubtag
        ) {

            botao.addEventListener(
                "click",
                function () {

                    for (
                        const b
                        of botoesSubtag
                    ) {
                        b.classList.remove(
                            "subtag-ativo"
                        );
                    }

                    botao.classList.add(
                        "subtag-ativo"
                    );

                    const cat =
                        botao.dataset.catDespesa;

                    if (cat) {
                        campoCategoria.value =
                            cat;
                        atualizarSubtagsAtivas();
                    }

                    campoDescricao.focus();

                }
            );

        }

    }


    // ==============================
    // ADICIONAR
    // ==============================

    if (botaoAdicionar) {

        botaoAdicionar.addEventListener(
            "click",
            function () {

                const descricao =
                    campoDescricao.value
                        .trim();

                const valorTexto =
                    campoValor.value;

                const categoria =
                    campoCategoria.value;


                if (
                    descricao === ""
                ) {
                    mostrarNotificacao(
                        "Digite a descrição!",
                        "erro"
                    );
                    campoDescricao.focus();
                    return;
                }

                if (
                    valorTexto.trim() ===
                        ""
                ) {
                    mostrarNotificacao(
                        "Digite o valor!",
                        "erro"
                    );
                    campoValor.focus();
                    return;
                }

                const valor =
                    Number(
                        valorTexto
                    );

                if (
                    !Number.isFinite(
                        valor
                    ) ||
                    valor <= 0
                ) {
                    mostrarNotificacao(
                        "Digite um valor válido!",
                        "erro"
                    );
                    return;
                }


                const novaDespesa = {

                    id: Date.now(),

                    descricao:
                        descricao,

                    valor:
                        valor,

                    categoria:
                        categoria,

                    tipo:
                        "livre",

                    data:
                        Date.now()

                };


                despesas.push(
                    novaDespesa
                );

                localStorage.setItem(
                    "despesas",
                    JSON.stringify(
                        despesas
                    )
                );

                campoDescricao.value =
                    "";

                campoValor.value = "";

                atualizarResumoFinanceiro();

                atualizarHistorico();

                mostrarNotificacao(
                    "Despesa registrada!",
                    "sucesso"
                );

            }
        );

    }

})();


// ==============================
// FILTROS DE CATEGORIA
// ==============================

(function () {

    const botoes =
        document.querySelectorAll(
            ".cat-financeiro"
        );

    for (
        const botao
        of botoes
    ) {

        botao.addEventListener(
            "click",
            function () {

                categoriaFinanceiro =
                    this.dataset
                        .categoriaFinanceiro;

                for (
                    const b
                    of botoes
                ) {
                    b.classList.remove(
                        "ativo"
                    );
                }

                this.classList.add(
                    "ativo"
                );

                filtrarDespesasFinanceiro();

            }
        );

    }

})();


// ==============================
// REGISTRAR DESPESA VIA COMPRA
// ==============================

function registrarDespesaEstoque(
    produto,
    valor
) {

    const mapeamentoCat =
        {
            Alimentos: "Alimentação",
            Bebidas: "Alimentação",
            Limpeza: "Outros",
            Higiene: "Outros",
            Outros: "Outros"
        };

    const categoriaDespesa =
        mapeamentoCat[produto.categoria] ||
        "Outros";

    const despesa = {

        id: Date.now(),

        descricao:
            produto.nome,

        valor:
            valor,

        categoria:
            categoriaDespesa,

        tipo:
            "estoque",

        data:
            Date.now()

    };

    despesas.push(
        despesa
    );

    localStorage.setItem(
        "despesas",
        JSON.stringify(
            despesas
        )
    );

    atualizarResumoFinanceiro();

}


// ==============================
// INIT
// ==============================

function initFinanceiro() {

    verificarTrocaMes();

    atualizarResumoFinanceiro();

    atualizarHistorico();

    if (
        typeof atualizarSubtagsAtivas ===
        "function"
    ) {
        atualizarSubtagsAtivas();
    }

}
