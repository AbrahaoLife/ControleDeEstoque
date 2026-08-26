const CACHE_NAME =
    "estoque-abrahao-v13";

const ARQUIVOS =
    [
        "./",
        "./index.html",
        "./css/base.css",
        "./css/splash.css",
        "./css/forms.css",
        "./css/cards.css",
        "./css/modal.css",
        "./css/dashboard.css",
        "./css/notifications.css",
        "./css/responsive.css",
        "./js/dados.js",
        "./js/notificacoes.js",
        "./js/estoque.js",
        "./js/filtros.js",
        "./js/financeiro.js",
        "./js/modal.js",
        "./js/compras.js",
        "./js/polish.js",
        "./js/dashboard.js",
        "./js/app.js",
        "./manifest.json",
        "./assets/icon-192.png",
        "./assets/icon-512.png",
        "./sons/notificacao.mp3"
    ];


// INSTALAR

self.addEventListener(
    "install",
    function (evento) {

        evento.waitUntil(
            caches.open(
                CACHE_NAME
            ).then(
                function (cache) {
                    return cache.addAll(
                        ARQUIVOS
                    );
                }
            )
        );

        self.skipWaiting();

    }
);


// ATIVAR

self.addEventListener(
    "activate",
    function (evento) {

        evento.waitUntil(
            caches.keys().then(
                function (chaves) {
                    return Promise.all(
                        chaves
                            .filter(
                                function (chave) {
                                    return (
                                        chave !== CACHE_NAME
                                    );
                                }
                            )
                            .map(
                                function (chave) {
                                    return caches.delete(
                                        chave
                                    );
                                }
                            )
                    );
                }
            )
        );

        self.clients.claim();

    }
);


// BUSCAR (cache first, network fallback)

self.addEventListener(
    "fetch",
    function (evento) {

        evento.respondWith(
            caches.match(
                evento.request
            ).then(
                function (resposta) {
                    return resposta ||
                        fetch(
                            evento.request
                        );
                }
            )
        );

    }
);
