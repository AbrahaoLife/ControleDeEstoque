// ==============================
// MODO ESCURO
// ==============================

(function () {

    const botao =
        document.getElementById(
            "temaToggle"
        );

    const temaSalvo =
        localStorage.getItem(
            "tema"
        ) || "claro";


    function aplicarTema(
        tema
    ) {

        if (tema === "escuro") {
            document.body.classList.add(
                "escuro"
            );
            botao.textContent =
                "☀️";
        }
        else {
            document.body.classList.remove(
                "escuro"
            );
            botao.textContent =
                "🌙";
        }

        localStorage.setItem(
            "tema",
            tema
        );

    }


    aplicarTema(
        temaSalvo
    );


    botao.addEventListener(
        "click",
        function () {

            const atual =
                document.body.classList.contains(
                    "escuro"
                )
                    ? "escuro"
                    : "claro";

            const novo =
                atual === "escuro"
                    ? "claro"
                    : "escuro";

            aplicarTema(
                novo
            );

        }
    );

})();


// ==============================
// EXPORTAR DADOS
// ==============================

(function () {

    const botao =
        document.getElementById(
            "exportarBtn"
        );

    if (botao) {

        botao.addEventListener(
            "click",
            function () {

                const dados =
                    {
                        produtos:
                            produtos || [],

                        despesas:
                            typeof despesas !==
                                "undefined"
                                ? despesas
                                : [],

                        saldoInicial:
                            typeof saldoInicial !==
                                "undefined"
                                ? saldoInicial
                                : 0,

                        mesesLogs:
                            typeof mesesLogs !==
                                "undefined"
                                ? mesesLogs
                                : [],

                        mesAtualRef:
                            typeof mesAtualRef !==
                                "undefined"
                                ? mesAtualRef
                                : "",

                        exportadoEm:
                            new Date().toISOString()
                    };

                const json =
                    JSON.stringify(
                        dados,
                        null,
                        2
                    );

                const nomeArquivo =
                    "estoque-abrahao-" +
                    new Date()
                        .toISOString()
                        .slice(0, 10) +
                    ".json";

                const blob =
                    new Blob(
                        [json],
                        {
                            type:
                                "application/json"
                        }
                    );

                if (
                    navigator.share &&
                    navigator.canShare
                ) {

                    const arquivo =
                        new File(
                            [blob],
                            nomeArquivo,
                            {
                                type:
                                    "application/json"
                            }
                        );

                    if (
                        navigator.canShare(
                            {
                                files:
                                    [arquivo]
                            }
                        )
                    ) {

                        navigator.share(
                            {
                                files:
                                    [arquivo],
                                title:
                                    "Backup Sistema Abrahão",
                                text:
                                    "Backup dos dados do estoque"
                            }
                        ).then(
                            function () {
                                mostrarNotificacao(
                                    "Dados exportados!",
                                    "sucesso"
                                );
                            }
                        ).catch(
                            function () {
                            }
                        );

                        return;

                    }

                }

                const url =
                    URL.createObjectURL(
                        blob
                    );

                const link =
                    document.createElement(
                        "a"
                    );

                link.href =
                    url;

                link.download =
                    nomeArquivo;

                document.body.appendChild(
                    link
                );

                link.click();

                document.body.removeChild(
                    link
                );

                setTimeout(
                    function () {
                        URL.revokeObjectURL(
                            url
                        );
                    },
                    100
                );

                mostrarNotificacao(
                    "Dados exportados com sucesso!",
                    "sucesso"
                );

            }
        );

    }

})();


// ==============================
// IMPORTAR DADOS
// ==============================

(function () {

    const botaoImportar =
        document.getElementById(
            "importarBtn"
        );

    const inputArquivo =
        document.getElementById(
            "importarArquivo"
        );

    if (
        botaoImportar &&
        inputArquivo
    ) {

        botaoImportar.addEventListener(
            "click",
            function () {
                inputArquivo.click();
            }
        );

        inputArquivo.addEventListener(
            "change",
            function (e) {

                const arquivo =
                    e.target.files[0];

                if (!arquivo) {
                    return;
                }

                const leitor =
                    new FileReader();

                leitor.onload =
                    function (evento) {

                        try {

                            const dados =
                                JSON.parse(
                                    evento.target
                                        .result
                                );

                            if (
                                dados.produtos
                            ) {
                                localStorage.setItem(
                                    "produtos",
                                    JSON.stringify(
                                        dados.produtos
                                    )
                                );
                            }

                            if (
                                dados.despesas
                            ) {
                                localStorage.setItem(
                                    "despesas",
                                    JSON.stringify(
                                        dados.despesas
                                    )
                                );
                            }

                            if (
                                typeof dados.saldoInicial !==
                                    "undefined"
                            ) {
                                localStorage.setItem(
                                    "saldoInicial",
                                    JSON.stringify(
                                        dados.saldoInicial
                                    )
                                );
                            }

                            if (
                                dados.mesesLogs
                            ) {
                                localStorage.setItem(
                                    "mesesLogs",
                                    JSON.stringify(
                                        dados.mesesLogs
                                    )
                                );
                            }

                            if (
                                dados.mesAtualRef
                            ) {
                                localStorage.setItem(
                                    "mesAtualRef",
                                    dados.mesAtualRef
                                );
                            }

                            mostrarNotificacao(
                                "Dados importados! Recarregando...",
                                "sucesso"
                            );

                            setTimeout(
                                function () {
                                    location.reload();
                                },
                                1000
                            );

                        }
                        catch (erro) {

                            mostrarNotificacao(
                                "Arquivo inválido!",
                                "erro"
                            );

                        }

                    };

                leitor.readAsText(
                    arquivo
                );

                inputArquivo.value =
                    "";

            }
        );

    }

})();
