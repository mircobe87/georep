// Spazio dei nomi
var georep = {};

// il sottospazio delle opzioni
georep.options = {};
georep.options.db = {
	proto: "http://",
	host: "127.0.0.1",
	port: "5984",
	dbname: "georep_db",
	admin: ""
};

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
 *     funczione di callback chiamata sia in caso di errore che di successo;
 *        err: oggetto che descrive l'errore, se si è verificato;
 *       data: oggetto che mostra le opzioni settate se non si sono verificati errori.
 */
georep.config.setURLServer = function(URLServer, callback){
	if (arguments.length < 1){
		throw "setURLServer() richiede almeno 1 argomenti: URLServer (object).";
	}
	else if (!URLServer || typeof URLServer != "object"){
		if(callback) callback({err: 'Impossibile settare "URLServer", parametro non valido.', params: {URLServer: URLServer}},undefined);
	}
	else{
		//fare un controllo sui valori di URLServer.proto, URLServer.host, URLServer.port?
		georep.options.db.proto = URLServer.proto;
		georep.options.db.host = URLServer.host;
		georep.options.db.port = URLServer.port;
		if(callback) callback(undefined, {proto: georep.options.db.proto, host: georep.options.db.host, port: georep.options.db.port});
	}
}

