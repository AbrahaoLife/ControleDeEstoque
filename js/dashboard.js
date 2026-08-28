// ==============================
// DATA NO NAVBAR
// ==============================

(function () {

    const navbarData =
        document.getElementById(
            "navbarData"
        );

    if (navbarData) {

        const hoje =
            new Date();

        const opcoes = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        };

        navbarData.textContent =
            hoje.toLocaleDateString(
                "pt-BR",
                opcoes
            );

    }

})();


// ==============================
// NAVEGAÇÃO ENTRE PÁGINAS
// ==============================

(function () {

    const links =
        document.querySelectorAll(
            ".sidebar-link[data-pagina]"
        );

    const paginas =
        document.querySelectorAll(
            ".pagina"
        );

    const navbarTitulo =
        document.getElementById(
            "navbarTitulo"
        );

    const titulos = {
        estoque: "Estoque",
        compras: "Compras",
        financeiro: "Financeiro",
        dashboard: "Dashboard"
    };


    function trocarPagina(
        nomePagina
    ) {

        for (
            const link
            of links
        ) {
            link.classList.remove(
                "ativo"
            );
        }

        for (
            const pagina
            of paginas
        ) {
            pagina.classList.remove(
                "ativo"
            );
        }


        const linkAtivo =
            document.querySelector(
                `.sidebar-link[data-pagina="${nomePagina}"]`
            );

        const paginaAlvo =
            document.getElementById(
                `pagina-${nomePagina}`
            );


        if (linkAtivo) {
            linkAtivo.classList.add(
                "ativo"
            );
        }

        if (paginaAlvo) {
            paginaAlvo.classList.add(
                "ativo"
            );
        }


        if (
            navbarTitulo &&
            titulos[nomePagina]
        ) {
            navbarTitulo.textContent =
                titulos[nomePagina];
        }


        if (
            nomePagina === "compras"
        ) {
            atualizarPaginaCompras();
            if (
                typeof renderizarComprasExtras ===
                    "function"
            ) {
                renderizarComprasExtras();
            }
        }

        if (
            nomePagina === "financeiro"
        ) {
            if (
                typeof atualizarHistorico ===
                    "function"
            ) {
                atualizarHistorico();
            }
            if (
                typeof atualizarResumoFinanceiro ===
                    "function"
            ) {
                atualizarResumoFinanceiro();
            }
        }

        if (
            nomePagina === "dashboard"
        ) {
            if (
                typeof atualizarDashboard ===
                    "function"
            ) {
                atualizarDashboard();
            }
        }


        const sidebar =
            document.getElementById(
                "sidebar"
            );

        if (sidebar) {
            sidebar.classList.remove(
                "aberto"
            );
        }

    }


    for (
        const link
        of links
    ) {

        link.addEventListener(
            "click",
            function () {

                const pagina =
                    this.dataset.pagina;

                if (
                    !this.disabled
                ) {
                    trocarPagina(
                        pagina
                    );
                }

            }
        );

    }

})();


// ==============================
// SIDEBAR - TOGGLE MOBILE
// ==============================

(function () {

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (
        menuToggle && sidebar
    ) {

        menuToggle.addEventListener(
            "click",
            function () {
                sidebar.classList.toggle(
                    "aberto"
                );
            }
        );


        document.addEventListener(
            "click",
            function (evento) {

                if (
                    !sidebar.contains(
                        evento.target
                    ) &&
                    !menuToggle.contains(
                        evento.target
                    )
                ) {
                    sidebar.classList.remove(
                        "aberto"
                    );
                }

            }
        );

    }

})();


// ==============================
// PÁGINA: COMPRAS
// ==============================

(function () {

    let categoriaCompra =
        "Todos";


    function atualizarResumoCompras() {

        const itens =
            produtos.filter(
                function (p) {
                    return (
                        Number(p.quantidade) <
                        Number(p.estoqueMinimo)
                    );
                }
            );

        const totalItens =
            document.getElementById(
                "comprasTotalItens"
            );

        const estoqueBaixo =
            document.getElementById(
                "comprasEstoqueBaixo"
            );

        const totalEstoque =
            document.getElementById(
                "comprasTotalEstoque"
            );


        if (totalItens) {
            totalItens.textContent =
                itens.length;
        }

        if (estoqueBaixo) {
            estoqueBaixo.textContent =
                itens.length;
        }

        if (totalEstoque) {
            totalEstoque.textContent =
                produtos.length;
        }

    }


    function criarCardCompraPagina(
        produto
    ) {

        const lista =
            document.getElementById(
                "listaComprasPagina"
            );

        const card =
            document.createElement("div");

        card.classList.add(
            "compra"
        );

        card.dataset.categoria =
            produto.categoria;

        const qtdAtual =
            Number(
                produto.quantidade
            );

        const estoqueMin =
            Number(
                produto.estoqueMinimo
            );

        const faltando =
            estoqueMin - qtdAtual;


        card.innerHTML = `
            <div class="compra-topo">
                <span class="icone-compra">🛒</span>
                <h3>${escaparHTML(produto.nome)}</h3>
            </div>

            <div class="informacoes-compra">
                <div class="info-compra">
                    <span>Estoque atual</span>
                    <strong class="info-estoque-atual">${qtdAtual}</strong>
                </div>
                <div class="info-compra">
                    <span>Estoque mínimo</span>
                    <strong class="info-estoque-minimo">${estoqueMin}</strong>
                </div>
                <div class="info-compra falta">
                    <span>Comprar</span>
                    <strong class="info-comprar">${faltando}</strong>
                </div>
            </div>

            <div class="compra-controle">
                <span class="compra-controle-label">Estoque</span>
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
                qtdAtual,
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

                    if (
                        Number(produto.quantidade) >=
                        Number(produto.estoqueMinimo)
                    ) {
                        atualizarPaginaCompras();
                    }

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
                            estoqueMin;

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
                        atualizarPaginaCompras();

                    }
                );

            }
        );


        lista.appendChild(
            card
        );

    }


    function filtrarComprasPagina() {

        const cards =
            document.querySelectorAll(
                "#listaComprasPagina .compra"
            );

        for (
            const card
            of cards
        ) {

            const cat =
                card.dataset.categoria;

            const corresponde =
                categoriaCompra === "Todos" ||
                cat === categoriaCompra;

            card.style.display =
                corresponde ? "" : "none";

        }

    }


    window.atualizarPaginaCompras =
        function () {

            const lista =
                document.getElementById(
                    "listaComprasPagina"
                );

            if (!lista) {
                return;
            }

            lista.innerHTML = "";

            const paraComprar =
                produtos.filter(
                    function (p) {
                        return (
                            Number(p.quantidade) <
                            Number(p.estoqueMinimo)
                        );
                    }
                );

            const filtrados =
                categoriaCompra === "Todos"
                    ? paraComprar
                    : paraComprar.filter(
                        function (p) {
                            return (
                                p.categoria ===
                                categoriaCompra
                            );
                        }
                    );


            if (
                filtrados.length === 0
            ) {

                const extrasVazios =
                    comprasExtras.length === 0;

                if (extrasVazios) {

                    const vazio =
                        document.createElement("div");

                    vazio.classList.add(
                        "lista-compras-vazia"
                    );

                    vazio.innerHTML = `
                        <div class="icone-lista-vazia">🛒</div>
                        <h3>Nenhum item para comprar!</h3>
                        <p>Todos os produtos estão com estoque suficiente.</p>
                    `;

                    lista.appendChild(
                        vazio
                    );

                }

            }
            else {

                for (
                    const produto
                    of filtrados
                ) {
                    criarCardCompraPagina(
                        produto
                    );
                }

            }

            atualizarResumoCompras();

            atualizarVisibilidadeSubtitulosCompras();

        };


    const botoesCompra =
        document.querySelectorAll(
            ".cat-compra"
        );

    for (
        const botao
        of botoesCompra
    ) {

        botao.addEventListener(
            "click",
            function () {

                categoriaCompra =
                    this.dataset.categoriaCompra;

                for (
                    const b
                    of botoesCompra
                ) {
                    b.classList.remove(
                        "ativo"
                    );
                }

                this.classList.add(
                    "ativo"
                );

                filtrarComprasPagina();

            }
        );

    }

})();


// ==============================
// PÁGINA: DASHBOARD
// ==============================

(function () {

    const categorias =
        [
            "Alimentação",
            "Lazer",
            "Transporte",
            "Saúde",
            "Contas",
            "Educação",
            "Vestuário",
            "Outros"
        ];

    const cores =
        {
            "Alimentação": "#16a34a",
            "Lazer": "#a855f7",
            "Transporte": "#f59e0b",
            "Saúde": "#e11d48",
            "Contas": "#2563eb",
            "Educação": "#0891b2",
            "Vestuário": "#ec4899",
            "Outros": "#6b7280"
        };


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


    function obterDespesasMesAtual() {

        const mesAtual =
            new Date().getMonth();

        const anoAtual =
            new Date().getFullYear();

        if (
            typeof despesas ===
                "undefined"
        ) {
            return [];
        }

        return despesas.filter(
            function (d) {
                const data =
                    new Date(d.data);

                return (
                    data.getMonth() ===
                        mesAtual &&
                    data.getFullYear() ===
                        anoAtual
                );
            }
        );

    }


    function atualizarCardsDashboard() {

        const elProdutos =
            document.getElementById(
                "dashTotalProdutos"
            );

        const elBaixos =
            document.getElementById(
                "dashEstoqueBaixo"
            );

        const elGasto =
            document.getElementById(
                "dashGastoMes"
            );

        const elSaldo =
            document.getElementById(
                "dashSaldoMes"
            );

        if (elProdutos) {
            elProdutos.textContent =
                produtos.length;
        }

        if (elBaixos) {
            const baixos =
                produtos.filter(
                    function (p) {
                        return (
                            Number(p.quantidade) <
                            Number(p.estoqueMinimo)
                        );
                    }
                ).length;

            elBaixos.textContent =
                baixos;
        }

        const despesasMes =
            obterDespesasMesAtual();

        const gastoMes =
            despesasMes.reduce(
                function (soma, d) {
                    return soma +
                        Number(d.valor);
                },
                0
            );

        if (elGasto) {
            elGasto.textContent =
                formatarMoeda(gastoMes);
        }

        if (elSaldo && typeof saldoInicial !== "undefined") {
            const restante =
                saldoInicial - gastoMes;

            elSaldo.textContent =
                formatarMoeda(restante);

            if (restante < 0) {
                elSaldo.style.color =
                    "var(--cor-erro)";
            }
            else {
                elSaldo.style.color =
                    "var(--cor-sucesso)";
            }
        }

    }


    function renderizarGastosPorCategoria() {

        const container =
            document.getElementById(
                "dashGraficoCategorias"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        const despesasMes =
            obterDespesasMesAtual();

        if (despesasMes.length === 0) {

            container.innerHTML = `
                <div class="dash-vazio">
                    <p>Nenhuma despesa este mês.</p>
                </div>
            `;

            return;

        }

        const totais =
            {};

        let totalGeral =
            0;

        for (
            const cat
            of categorias
        ) {
            totais[cat] =
                0;
        }

        for (
            const despesa
            of despesasMes
        ) {
            const valor =
                Number(
                    despesa.valor
                );

            if (
                totais.hasOwnProperty(
                    despesa.categoria
                )
            ) {
                totais[despesa.categoria] +=
                    valor;
            }
            else {
                totais[despesa.categoria] =
                    valor;
            }

            totalGeral +=
                valor;
        }


        if (totalGeral === 0) {

            container.innerHTML = `
                <div class="dash-vazio">
                    <p>Nenhuma despesa este mês.</p>
                </div>
            `;

            return;

        }


        for (
            const cat
            of categorias
        ) {

            if (
                !totais[cat] ||
                totais[cat] === 0
            ) {
                continue;
            }

            const percentual =
                (
                    (totais[cat] / totalGeral) *
                    100
                ).toFixed(1);

            const cor =
                cores[cat] || "#6b7280";

            const barra =
                document.createElement("div");

            barra.classList.add(
                "dash-barra-item"
            );

            barra.innerHTML = `
                <div class="dash-barra-info">
                    <span class="dash-barra-cor" style="background: ${cor}"></span>
                    <span class="dash-barra-nome">${cat}</span>
                    <span class="dash-barra-valor">${formatarMoeda(totais[cat])}</span>
                    <span class="dash-barra-pct">${percentual}%</span>
                </div>
                <div class="dash-barra-trilha">
                    <div class="dash-barra-preenchimento" style="width: ${percentual}%; background: ${cor}"></div>
                </div>
            `;

            container.appendChild(
                barra
            );

        }

    }


    function renderizarDespesasRecentes() {

        const container =
            document.getElementById(
                "dashDespesasRecentes"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        const despesasMes =
            obterDespesasMesAtual();

        if (despesasMes.length === 0) {

            container.innerHTML = `
                <div class="dash-vazio">
                    <p>Nenhuma despesa registrada este mês.</p>
                </div>
            `;

            return;

        }

        const recentes =
            despesasMes
                .slice()
                .reverse()
                .slice(0, 10);

        for (
            const despesa
            of recentes
        ) {

            const item =
                document.createElement("div");

            item.classList.add(
                "dash-atividade-item"
            );

            const cor =
                cores[despesa.categoria] || "#6b7280";

            const data =
                new Date(
                    despesa.data
                );

            const dataFormatada =
                data.toLocaleDateString(
                    "pt-BR",
                    {
                        day: "2-digit",
                        month: "short"
                    }
                );

            item.innerHTML = `
                <span class="dash-ativ-icone">💸</span>
                <span class="dash-ativ-texto">
                    <strong>${escaparHTML(despesa.descricao)}</strong>
                    <small>${escaparHTML(despesa.categoria)} · ${dataFormatada}</small>
                </span>
                <span class="dash-ativ-valor" style="color: ${cor}">${formatarMoeda(despesa.valor)}</span>
            `;

            container.appendChild(
                item
            );

        }

    }


    function renderizarAtividadeRecente() {

        const container =
            document.getElementById(
                "dashAtividade"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (
            typeof despesas ===
                "undefined" ||
            despesas.length === 0
        ) {

            container.innerHTML = `
                <div class="dash-vazio">
                    <p>Nenhuma atividade recente.</p>
                </div>
            `;

            return;

        }

        const recentes =
            despesas
                .slice()
                .reverse()
                .slice(0, 8);

        for (
            const despesa
            of recentes
        ) {

            const item =
                document.createElement("div");

            item.classList.add(
                "dash-atividade-item"
            );

            const icone =
                despesa.tipo === "estoque"
                    ? "🛒"
                    : "💸";

            const data =
                new Date(
                    despesa.data
                );

            const hora =
                data.toLocaleTimeString(
                    "pt-BR",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

            item.innerHTML = `
                <span class="dash-ativ-icone">${icone}</span>
                <span class="dash-ativ-texto">
                    <strong>${escaparHTML(despesa.descricao)}</strong>
                    <small>${escaparHTML(despesa.categoria)} · ${hora}</small>
                </span>
                <span class="dash-ativ-valor">${formatarMoeda(despesa.valor)}</span>
            `;

            container.appendChild(
                item
            );

        }

    }


    function renderizarEstoquePorCategoria() {

        const container =
            document.getElementById(
                "dashEstoqueCat"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (produtos.length === 0) {

            container.innerHTML = `
                <div class="dash-vazio">
                    <p>Nenhum produto no estoque.</p>
                </div>
            `;

            return;

        }

        const categoriasEstoque =
            [
                "Alimentos",
                "Limpeza",
                "Higiene",
                "Bebidas",
                "Outros"
            ];

        const coresEstoque =
            {
                Alimentos: "#16a34a",
                Limpeza: "#9333ea",
                Higiene: "#e11d48",
                Bebidas: "#2563eb",
                Outros: "#6b7280"
            };

        const contagem =
            {};

        let maximo =
            0;

        for (
            const cat
            of categoriasEstoque
        ) {
            contagem[cat] =
                0;
        }

        for (
            const produto
            of produtos
        ) {
            if (
                contagem.hasOwnProperty(
                    produto.categoria
                )
            ) {
                contagem[produto.categoria]++;

                if (
                    contagem[produto.categoria] >
                    maximo
                ) {
                    maximo =
                        contagem[produto.categoria];
                }
            }
        }


        for (
            const cat
            of categoriasEstoque
        ) {

            if (contagem[cat] === 0) {
                continue;
            }

            const percentual =
                maximo > 0
                    ? (
                        (contagem[cat] / maximo) *
                        100
                    ).toFixed(0)
                    : 0;

            const barra =
                document.createElement("div");

            barra.classList.add(
                "dash-barra-item"
            );

            barra.innerHTML = `
                <div class="dash-barra-info">
                    <span class="dash-barra-cor" style="background: ${coresEstoque[cat]}"></span>
                    <span class="dash-barra-nome">${cat}</span>
                    <span class="dash-barra-valor">${contagem[cat]} itens</span>
                </div>
                <div class="dash-barra-trilha">
                    <div class="dash-barra-preenchimento" style="width: ${percentual}%; background: ${coresEstoque[cat]}"></div>
                </div>
            `;

            container.appendChild(
                barra
            );

        }

    }


    function renderizarHistoricoMeses() {

        const container =
            document.getElementById(
                "dashHistoricoMeses"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        const logs =
            carregarDado("mesesLogs", []);

        if (logs.length === 0) {

            container.innerHTML = `
                <div class="dash-vazio">
                    <p>Nenhum mês anterior registrado.</p>
                </div>
            `;

            return;

        }

        const invertido =
            logs.slice().reverse();

        for (
            const log
            of invertido
        ) {

            const item =
                document.createElement("div");

            item.classList.add(
                "dash-mes-item"
            );

            const pctUsado =
                log.saldoInicial > 0
                    ? (
                        (log.totalDespesas /
                            log.saldoInicial) *
                        100
                    ).toFixed(0)
                    : 0;

            const status =
                log.totalDespesas <=
                    log.saldoInicial
                    ? "dentro"
                    : "acima";

            item.innerHTML = `
                <div class="dash-mes-topo">
                    <span class="dash-mes-nome">
                        📅 ${escaparHTML(log.nome)}
                    </span>
                    <span class="dash-mes-status dash-mes-${status}">
                        ${status === "dentro"
                            ? "Dentro do orçamento"
                            : "Acima do orçamento"}
                    </span>
                </div>
                <div class="dash-mes-info">
                    <span>Saldo: ${formatarMoeda(log.saldoInicial)}</span>
                    <span>Gasto: ${formatarMoeda(log.totalDespesas)}</span>
                    <span>Restante: ${formatarMoeda(log.saldoInicial - log.totalDespesas)}</span>
                </div>
                <div class="dash-barra-trilha">
                    <div class="dash-barra-preenchimento" style="width: ${Math.min(pctUsado, 100)}%; background: ${status === "dentro" ? "#16a34a" : "#dc2626"}"></div>
                </div>
                <div class="dash-mes-pct">${pctUsado}% utilizado</div>
            `;

            container.appendChild(
                item
            );

        }

    }


    function renderizarGraficoMeses() {

        const container =
            document.getElementById(
                "dashGraficoMeses"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        const logs =
            carregarDado("mesesLogs", []);


        const mesAtualRefLocal =
            localStorage.getItem(
                "mesAtualRef"
            ) || "";

        const despesasAtuais =
            typeof despesas !== "undefined"
                ? despesas
                : [];

        const saldoAtualVal =
            typeof saldoInicial !== "undefined"
                ? saldoInicial
                : 0;

        const totalAtual =
            despesasAtuais.reduce(
                function (s, d) {
                    return s +
                        Number(d.valor);
                },
                0
            );


        const todosMeses =
            [];

        for (
            const log
            of logs
        ) {
            todosMeses.push(
                {
                    nome:
                        log.nome,

                    gasto:
                        log.totalDespesas,

                    saldo:
                        log.saldoInicial
                }
            );
        }


        if (
            mesAtualRefLocal !== "" &&
            (totalAtual > 0 || saldoAtualVal > 0)
        ) {

            const partes =
                mesAtualRefLocal.split("-");

            const ano =
                Number(partes[0]);

            const mes =
                Number(partes[1]) - 1;

            const nomeMes =
                nomesMeses[mes] +
                " " +
                ano;

            todosMeses.push(
                {
                    nome:
                        nomeMes,

                    gasto:
                        totalAtual,

                    saldo:
                        saldoAtualVal,

                    atual:
                        true
                }
            );

        }


        if (todosMeses.length === 0) {

            container.innerHTML = `
                <div class="dash-vazio">
                    <p>Nenhum dado de meses anteriores.</p>
                </div>
            `;

            return;

        }


        let maximo =
            0;

        for (
            const m
            of todosMeses
        ) {

            if (m.gasto > maximo) {
                maximo =
                    m.gasto;
            }

            if (m.saldo > maximo) {
                maximo =
                    m.saldo;
            }

        }

        if (maximo === 0) {
            maximo =
                1;
        }


        const abreviarMes =
            function (nome) {

                const partes =
                    nome.split(" ");

                return (
                    partes[0].slice(0, 3) +
                    " " +
                    (partes[1] || "")
                        .slice(2, 4)
                );

            };


        const grafico =
            document.createElement("div");

        grafico.classList.add(
            "dash-chart"
        );


        for (
            const m
            of todosMeses
        ) {

            const coluna =
                document.createElement("div");

            coluna.classList.add(
                "dash-chart-coluna"
            );

            if (m.atual) {
                coluna.classList.add(
                    "dash-chart-atual"
                );
            }

            const altGasto =
                (
                    (m.gasto / maximo) *
                    100
                ).toFixed(0);

            const altSaldo =
                (
                    (m.saldo / maximo) *
                    100
                ).toFixed(0);


            coluna.innerHTML = `
                <div class="dash-chart-barras">
                    <div class="dash-chart-barra dash-chart-gasto" style="height: ${altGasto}%">
                        <span class="dash-chart-valor">${formatarMoeda(m.gasto)}</span>
                    </div>
                    <div class="dash-chart-barra dash-chart-saldo" style="height: ${altSaldo}%"></div>
                </div>
                <span class="dash-chart-label">${escaparHTML(abreviarMes(m.nome))}</span>
            `;

            grafico.appendChild(
                coluna
            );

        }


        const legenda =
            document.createElement("div");

        legenda.classList.add(
            "dash-chart-legenda"
        );

        legenda.innerHTML = `
            <span class="dash-chart-leg-item">
                <span class="dash-chart-leg-cor" style="background: #dc2626"></span>
                Gasto
            </span>
            <span class="dash-chart-leg-item">
                <span class="dash-chart-leg-cor" style="background: #2563eb"></span>
                Saldo Inicial
            </span>
        `;


        container.appendChild(
            grafico
        );

        container.appendChild(
            legenda
        );

    }


    window.atualizarDashboard =
        function () {
            atualizarCardsDashboard();
            renderizarGastosPorCategoria();
            renderizarDespesasRecentes();
            renderizarAtividadeRecente();
            renderizarEstoquePorCategoria();
            renderizarGraficoMeses();
            renderizarHistoricoMeses();
        };

})();
