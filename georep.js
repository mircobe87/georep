// Spazio dei nomi
var georep = {};

// il sottospazio delle opzioni
georep.options = {};
/**
 * Memorizza le specifiche per raggiungere un server geocouch.
 * Una volta configurato l'oggetto sara del tipo:
 * {
 *     proto: "protocollo di comunicazione (http://, https://, ecc...)",
 *     host:   "IP o Hostname della macchina",
 *     port:   "porta sulla quale il server e' in ascolto",
 *     dbname: "nome del db",
 *     admin:  "user name e password dell'admin in base64"
 * }
 */
georep.options.db = {};


// il sottospazio dei metodi di configurazione
georep.config = {};

/**
 * Setta l'utente amministratore del  server.
 *
 * name ( string ):
 * passwd: ( string ):
 * callback ( function(err, data) ):
 */
georep.config.setAdmin = function(name, passwd, callback){
	if (arguments.length < 2) {
		throw "setAdmin() richiede almeno 2 argomenti: name (string), passwd (string).";
	} else if (!name || !passwd || typeof name != "string" || typeof passwd != "string") {
		if (callback) callback({err: 'Impossibile settare "admin", parametri non validi.',params: {name: name, passwd: passwd}}, undefined);
	} else {
		georep.options.db.admin = btoa(name+":"+passwd);
		if (callback) callback(undefined,{admin: georep.options.db.admin});
	}
};

/**
 * Setta il nome del database all'interno del server.
 *
 * DBName ( string ):
 * callback ( function(err, data) ):
 */
georep.config.setDBName = function(DBName, callback){
	if (arguments.length < 1) {
		throw "setDBName() richiede almeno 1 argomenti: DBName (string).";
	} else if (!DBName || typeof DBName != "string" ) {
		if (callback) callback({err: 'Impossibile settare "dbname", parametro non valido.', params: {DBName: DBName}},undefined);
	} else {
		georep.options.db.dbname = DBName;
		if (callback) callback(undefined, {dbname: georep.options.db.name});
	}
};

/**
 * Configura lo URL del server CouchDB (geocouch)
 *
 * URLServer ( object ):
 *     {
 *         proto: "http://",
 *         host:  "127.0.0.1",
 *         port:  "5984"
 *     }
 * callback ( function(err, data) ):
 *     funzione di callback chiamata sia in caso di errore che di successo;
 *        err: oggetto che descrive l'errore, se si è verificato;
 *       data: oggetto che mostra le opzioni settate se non si sono verificati errori.
 */
georep.config.setURLServer = function(URLServer, callback){
	if (arguments.length < 1){
		throw "setURLServer() richiede almeno 1 argomento: URLServer (object).";
	}
	else if (!URLServer || typeof URLServer != "object"){
		if(callback)
			callback({
				err: 'Impossibile settare "URLServer", parametro non valido.',
				params: {
					URLServer: URLServer
				}
			},undefined);
	}
	else if (
	!URLServer.proto || typeof URLServer.proto != "string" ||
	!URLServer.host  || typeof URLServer.host  != "string" ||
	!URLServer.port  || typeof URLServer.port  != "string" ){
		if (callback)
			callback({
				err: 'Impossibile settare "URLServer", uno o piu\' properties non valide.',
				params: {
					proto: URLServer.proto,
					host: URLServer.host,
					port: URLServer.port
				}
			},undefined);
	} else {
		georep.options.db.proto = URLServer.proto;
		georep.options.db.host = URLServer.host;
		georep.options.db.port = URLServer.port;
		if( callback )
			callback(undefined, {
				proto: georep.options.db.proto,
				host: georep.options.db.host,
				port: georep.options.db.port
			});
	}
};

