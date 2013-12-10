YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Admin",
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
            "description": "<p>Fornisce gli oggetti per poter utilizzare un db remoto couchdb esteso con geocouch.</p>\n<p>\n\tSul database è possibile immagazzinare record geo-referenziati che contengono le\n\tseguenti informazioni:\n\t<ul>\n\t\t<li><b><code>title</code></b> - <i>string</i>:\n\t\t\tTitolo per la segnalazione.\n\t\t</li>\n\t\t<li><b><code>msg</code></b> - <i>string</i>:\n\t\t\tDescrizione più dettagliata per la segnalazione.\n\t\t</li>\n\t\t<li><b><code>img</code></b> - <i>object</i>:\n\t\t\tImmagine allegata per documentare la segnalazione.\n\t\t\t<ul>\n\t\t\t\t<li><b><code>content_type</code></b> - <i>string</i>:\n\t\t\t\t\tTipo di contenuto, per esempio <code>\"image/jpg\"</code>.\n\t\t\t\t</li>\n\t\t\t\t<li><b><code>data</code></b> - <i>string</i>:\n\t\t\t\t\tCodifica <code>base64</code> del documento allegato.\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</li>\n\t\t<li><b><code>loc</code></b> - <i>object</i>:\n\t\t\tPosizione geografica della segnalazione.\n\t\t\t<ul>\n\t\t\t\t<li><b><code>latitude</code></b> - <i>number</i>:\n\t\t\t\t\tLatitudine Nord.\n\t\t\t\t</li>\n\t\t\t\t<li><b><code>longitude</code></b> - <i>number</i>:\n\t\t\t\t\tLongitudine Est.\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</li>\n\t</ul>\n</p>"
        }
    ]
} };
});