// ==============================
// NOTIFICAÇÕES
// ==============================

function mostrarNotificacao(
    texto,
    tipo
) {

    const area =
        document.getElementById(
            "notificacoes"
        );

    const card =
        document.createElement("div");

    let icone = "";

    if (tipo === "sucesso") {
        icone = "✅";
    }
    else if (tipo === "atualizado") {
        icone = "✏️";
    }
    else if (tipo === "erro") {
        icone = "❌";
    }

    card.classList.add(
        "notificacao"
    );

    card.classList.add(
        tipo
    );

    card.innerHTML = `
        <div class="conteudo-notificacao">
            <div class="icone-notificacao">
                ${icone}
            </div>
            <div class="texto-notificacao">
                ${escaparHTML(texto)}
            </div>
        </div>
    `;

    const barra =
        document.createElement("div");

    barra.classList.add(
        "barra-tempo"
    );

    card.appendChild(
        barra
    );

    const som =
        new Audio(
            "sons/notificacao.mp3"
        );

    som.play().catch(
        function () {}
    );

    area.appendChild(
        card
    );

    setTimeout(
        function () {

            card.classList.add(
                "saindo"
            );

            setTimeout(
                function () {
                    card.remove();
                },
                500
            );

        },
        2000
    );
}
