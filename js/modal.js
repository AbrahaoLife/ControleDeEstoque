// ==============================
// MODAL VALOR COMPRA
// ==============================

(function () {

    const overlay =
        document.getElementById(
            "modalValor"
        );

    const campoNome =
        document.getElementById(
            "modalProdutoNome"
        );

    const campoValor =
        document.getElementById(
            "modalValorInput"
        );

    const botaoConfirmar =
        document.getElementById(
            "modalConfirmar"
        );

    const botaoCancelar =
        document.getElementById(
            "modalCancelar"
        );

    let callbackAtual =
        null;


    function abrirModal(
        nomeProduto,
        callback
    ) {

        callbackAtual =
            callback;

        campoNome.textContent =
            nomeProduto;

        campoValor.value =
            "";

        overlay.classList.add(
            "aberto"
        );

        setTimeout(
            function () {
                campoValor.focus();
            },
            100
        );

    }


    function fecharModal() {

        overlay.classList.remove(
            "aberto"
        );

        callbackAtual =
            null;

    }


    function confirmarModal() {

        const valorTexto =
            campoValor.value;

        let valor =
            0;

        let informouValor =
            false;

        if (
            valorTexto.trim() !== ""
        ) {

            valor =
                Number(
                    valorTexto
                );

            if (
                Number.isFinite(
                    valor
                ) &&
                valor > 0
            ) {
                informouValor =
                    true;
            }

        }

        if (
            callbackAtual
        ) {
            callbackAtual(
                informouValor
                    ? valor
                    : null
            );
        }

        fecharModal();

    }


    botaoConfirmar.addEventListener(
        "click",
        confirmarModal
    );


    botaoCancelar.addEventListener(
        "click",
        fecharModal
    );


    overlay.addEventListener(
        "click",
        function (e) {
            if (
                e.target === overlay
            ) {
                fecharModal();
            }
        }
    );


    campoValor.addEventListener(
        "keydown",
        function (e) {
            if (
                e.key === "Enter"
            ) {
                confirmarModal();
            }
            if (
                e.key === "Escape"
            ) {
                fecharModal();
            }
        }
    );


    window.abrirModalValor =
        abrirModal;

})();
