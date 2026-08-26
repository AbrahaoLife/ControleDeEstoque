// ==============================
// INICIAR APP
// ==============================

mostrarProdutos();

verificarEstoque();

atualizarResumo();

botaoCancelar.style.display =
    "none";

initFinanceiro();


// ==============================
// SPLASH SCREEN
// ==============================

(function () {

    const splash =
        document.getElementById(
            "splash"
        );

    if (!splash) return;

    document.body.classList.add(
        "app-oculto"
    );

    setTimeout(
        function () {
            splash.classList.add(
                "saindo"
            );

            document.body.classList.remove(
                "app-oculto"
            );

            setTimeout(
                function () {
                    splash.remove();
                },
                500
            );
        },
        1600
    );

})();
