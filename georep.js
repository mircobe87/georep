// Spazio dei nomi
var georep = {};

// il sottospazio delle opzioni
georep.options = {};
/**
 * Memorizza le specifiche per raggiungere un server geocouch.
 * Una volta configurato l'oggetto sara' del tipo:
 * {
 *     proto: "protocollo di comunicazione (http://, https://, ecc...)",
 *     host:   "IP o Hostname della macchina",
 *     port:   "porta sulla quale il server e' in ascolto",
 *     dbname: "nome del db",
 *     admin:  "user name e password dell'admin in base64"
 * }
 */
georep.options.db = {};
/**
 * Memorizza le specifiche dell'utente che avra' accesso al db.
 * Una volta configurato l'oggetto sara' del tipo:
 * {
 *     _id:      "org.couchdb.user:nomeUtente",
 *     name:     "nomeUtente",
 *     password: "laPassword",
 *     base64:   "nomeUtente:laPassword in base64",
 *     nick:     "nickname usato dall'utente",
 *     mail:     "email usata dall'utente",
 *     type:     "user",
 *     roles:    []
 * }
 */
georep.options.user = {};

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
		if (callback) callback(undefined, {dbname: georep.options.db.dbname});
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
 *        err:  oggetto che descrive l'errore, se si e' verificato;
 *        data: oggetto che mostra le opzioni settate se non si sono verificati errori.
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

/**
 * Configura l'utente client.
 * 
 * user ( object ):
 *     {
 *         name:     (string) nome utilizzato per il login,
 *         password: (string) password utlizzata per il login,
 *         nick:     (string) nome arbitrario scelto dall'utente,
 *         mail:     (string) indirizzo e-mail dell'utente
 *     }
 * callback ( function(err, data) ):
 *     funzione di callback chiamata sia in caso di errore che di successo;
 *        err:  oggetto che descrive l'errore, se si e' verificato;
 *        data: oggetto che mostra le opzioni settate se non si sono verificati errori.
 */ 
georep.config.setUser = function(user, callback){
	if (arguments.length < 1){
		throw "setUser() richiede almeno 1 argomento: user (object).";
	} else if (!user || typeof user != "object") {
		if(callback)
			callback({
				err: 'Impossibile settare "user", parametro non valido.',
				params: {
					user: user
				}
			},undefined);
	} else if (
	!user.name      || typeof user.name      != "string" ||
	!user.password  || typeof user.password  != "string" ||
	!user.nick      || typeof user.nick      != "string" ||
	!user.mail      || typeof user.mail      != "string" ){
		if (callback)
			callback({
				err: 'Impossibile settare "user", uno o piu\' properties non valide.',
				params: {
					name:     user.name,
					password: user.password,
					nick:     user.nick,
					mail:     user.mail
				}
			},undefined);
	} else {
		georep.options.user._id  = "org.couchdb.user:"+user.name;
		georep.options.user.name = user.name;
		georep.options.user.password = user.password;
		georep.options.user.base64 = btoa(user.name+":"+user.password);
		georep.options.user.nick = user.nick;
		georep.options.user.mail = user.mail;
		georep.options.user.type = "user";
		georep.options.user.roles = [];
		if(callback)
			callback(undefined,{
				user: georep.options.user
			});
	}
};


/**
 * Controlla se un utente è registrato sul server CouchDB (geocouch).
 * 
 * callback ( function(err, data) ):
 * 		funzione di callback, NON OPZIONALE, chiamata sia in caso di errore che di successo;
 *         err: oggetto che descrive l'errore, se si è verificato;
 *        data: true se l'utente è già registrato, false se non lo è .
 */
georep.checkUser = function(callback){
	/* callback è obbligatorio perchè checkUser() chiama $.ajax() che è asincrona */	
	if (!callback){
		throw "checkUser() richiede il paramentro callback OBBLIGATORIO."
	}
	else{
		/* richiedo info sul db, usando come credenziali di accesso quelle dell'utente georep.options.user, 
           se l'accesso al db viene negato, significa che l'utente non è registrato */
		$.ajax({
			url: georep.options.db.proto+georep.options.db.host+':'+georep.options.db.port,
			type: 'GET',
			headers: {
				'Authorization': 'Basic '+georep.options.user.base64
			},
			success: function(data){
				/*console.log("Utente gia' registrato "+ data);*/
				callback(undefined, {isRegistered: true});
			},
			error: function(jqXHR, textStatus, errorThrown){
				/*console.log('jqXHR: '+ jqXHR + '\ntextStatus: '+textStatus + '\nerrorThrown: '+errorThrown);*/
				if (errorThrown == 'Unauthorized'){
					/*console.log("Utente NON registrato");*/
					callback(undefined, {isRegistered: false});
				}
				else{
					callback({err: "Impossibile capire se l'utente e' registrato", jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown}, undefined);
				}
			},			
		});
	}
}

/**
 * Registra l'utente sul server CouchDB(questa funzione dovrà essere fatta poi dal server direttamente)
 *
 * callback ( function(err, data) ):
 *     funzione di callback chiamata sia in caso di errore che di successo;
 *        err:  oggetto che descrive l'errore, se si e' verificato;
 *        data: oggetto che mostra il messaggio ricevuto se non si sono verificati errori.
 */
 
 georep.signup = function(callback){
 	var usr = georep.options.user;
 	$.ajax({
 		url: georep.options.db.proto+georep.options.db.host+':'+georep.options.db.port+'/_users/'+usr._id,
 		type: 'PUT',
 		data: JSON.stringify({name: usr.name, password: usr.password, nick: usr.nick, mail: usr.mail, type: usr.type, roles: usr.roles}),
 		headers: {
 			'Authorization': 'Basic '+georep.options.db.admin
 		},
 		success: function(data){
 			console.log("Utente registrato con successo! " +data);
 			if (callback) {
 				callback(undefined, data);
 			}
 		},
 		error: function(jqXHR, textStatus, errorThrown){
 			console.log("Utente NON registrato! " + jqXHR + textStatus + errorThrown);
 			if (callback){
 				callback({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown}, undefined);
 			}
 		}
 	});	
 }
