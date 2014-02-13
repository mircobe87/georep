YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "DB",
        "Georep",
        "User"
    ],
    "modules": [
        "georep"
    ],
    "allModules": [
        {
            "displayName": "georep",
            "name": "georep",
            "description": "<p>Fornisce gli oggetti per poter utilizzare un db remoto couchdb esteso con geocouch.</p>\n<p>\nSul database è possibile immagazzinare record geo-referenziati che contengono le\nseguenti informazioni:\n<ul>\n<li><b><code>title</code></b> - <i>string</i>:\nTitolo per la segnalazione.\n</li>\n<li><b><code>msg</code></b> - <i>string</i>:\nDescrizione più dettagliata per la segnalazione.\n</li>\n<li><b><code>img</code></b> - <i>object</i>:\nImmagine allegata per documentare la segnalazione.\n<ul>\n<li><b><code>content_type</code></b> - <i>string</i>:\nTipo di contenuto, per esempio <code>\"image/jpg\"</code>.\n</li>\n<li><b><code>data</code></b> - <i>string</i>:\nCodifica <code>base64</code> del documento allegato.\n</li>\n</ul>\n</li>\n<li><b><code>loc</code></b> - <i>object</i>:\nPosizione geografica della segnalazione.\n<ul>\n<li><b><code>latitude</code></b> - <i>number</i>:\nLatitudine Nord.\n</li>\n<li><b><code>longitude</code></b> - <i>number</i>:\nLongitudine Est.\n</li>\n</ul>\n</li>\n</ul>\n</p>"
        }
    ]
} };
});