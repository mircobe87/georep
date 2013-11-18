// Spazio dei nomi
var georep = {};

// sezione relativa a costanti utilizzate nel resto del codice
georep.constants = {};

// sezione relativa al database remoto
georep.db = {
	admin: {
		base64: undefined,
		configured: false
	},
	configured: false,
	name: undefined,
	host: undefined,
	port: undefined,
	proto: undefined
};
/**
 * controlla se tutte le properties del DB sono state configurate e ritorna
 * tale risultate.
 */
georep.db.isConfigured = function(){
	if (this.configured)
		return true;
	else {
		this.configured = (
			this.admin.configured == true &&
			this.name  !=  undefined && this.host  != undefined &&
			this.port  !=  undefined && this.proto != undefined
		);
		return this.configured;
	}
};

/**
 * Setta l'utente amministratore del server.
 *
 * name ( string ):
 * passwd: ( string ):
 */
georep.db.setAdmin = function(name, passwd){
	if (arguments.length != 2) {
		throw 'setAdmin() richiede esattamente 2 argomenti: name (string), passwd (string).';
	} else if (!name || !passwd || typeof name != 'string' || typeof passwd != 'string') {
		throw 'Impossibile settare l\'amministratore, parametri non validi.';
	} else {
		georep.db.admin.base64 = btoa(name+':'+passwd);
		georep.db.admin.configured = true;
		georep.db.isConfigured();
	}
};
/**
 * Setta il nome del database all'interno del server.
 *
 * DBName ( string ):
 */
georep.db.setDBName = function(DBName){
	if (arguments.length != 1) {
		throw 'setDBName() richiede un argomento: DBName (string).';
	} else if (!DBName || typeof DBName != 'string' ) {
		throw 'Impossibile settare il nome del database, parametro non valido.';
	} else {
		georep.db.name = DBName;
		georep.db.isConfigured();
	}
};
/**
 * Configura lo URL del server CouchDB (geocouch)
 *
 * URLServer ( object ):
 *     {
 *         proto: "http://",
 *         host:  "127.0.0.1",
 *         port:  5984
 *     }
 */
georep.db.setURLServer = function(URLServer){
	if (arguments.length != 1){
		throw 'setURLServer() richiede un argomento: URLServer (object).';
	} else if (typeof URLServer != 'object'){
		throw 'Impossibile settare "URLServer", parametro non valido.';
	} else if (
	!URLServer.proto || typeof URLServer.proto != 'string' ||
	!URLServer.host  || typeof URLServer.host  != 'string' ||
	!URLServer.port  || typeof URLServer.port  != 'number' ||
	URLServer.port < 1 || URLServer.port > 65535){
		throw 'Impossibile settare "URLServer", uno o piu\' properties non valide.';
	} else {
		georep.db.proto = URLServer.proto;
		georep.db.host = URLServer.host;
		georep.db.port = URLServer.port;
		georep.db.isConfigured();
	}
};
/**
 * Recupera un doc dal database tramite il relativo ID
 * 
 * docId: (string) "l'ID del documento",
 * attachments: (boolean)
 *     true  - recupera il documento completo di allegato;
 *     false - recupera il semplice documento senza allegato.
 * callback ( function(err, data) ):
 *     funzione di callback chiamata sia in caso di errore che di successo;
 *        err:  oggetto che descrive l'errore, se si e' verificato;
 *        data: oggetto che mostra le opzioni settate se non si sono verificati errori.
 */ 
georep.db.getDoc = function(docId, attachments, callback){
	if( arguments.length < 2 )
		throw 'getDoc() richiede almeno 2 argomenti: docId (string), attachment (boolean).';
	else if (!docId || typeof docId != 'string' || typeof attachments != 'boolean')
		throw 'Uno o piu\' parametri non validi.'
	else {
		var attach = (attachments)?'?attachments=true':'?attachments=false';
		$.ajax({
			url: georep.db.proto +
			     georep.db.host + ':' +
			     georep.db.port + '/' +
			     georep.db.name + '/' + docId +
			     attach,
			headers: {
				Authorization: 'Basic ' + georep.user.base64,
				/* mi assicura che la risposta arrivi con l'allegato in base64
                   invece che in binario in un oggetto MIME a contenuti multipli
                */ 
				Accept: 'application/json'	
			},
			success: function(data){
				if(callback)
					callback(undefined,data);
			},
			error: function(jqXHR, textStatus, errorThrown){
				if(callback)
					callback({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown},undefined);
			}
		});
	}
};
/**
 * Invia un nuovo documento sul database remoto
 * 
 * doc (object) :
 *     {
 *         title: (string) "titolo del documento",
 *         msg: (string) "qualche dettaglio in piu'",
 *         img: (object) {
 *                           content_type: "image/...",
 *                           data: "... data in base64 ..."
 *                       }
 *         loc: (object) {
 *                           latitude:  (number) latitudine nord,
 *                           longitude: (number) longitudine est
 *                       }
 *     }
 * callback ( function(err, data) ):
 *     funzione di callback chiamata sia in caso di errore che di successo;
 *        err:  oggetto che descrive l'errore, se si e' verificato;
 *        data: oggetto che mostra le opzioni settate se non si sono verificati errori.
 */ 
georep.db.postDoc = function(doc,callback){
	if( arguments.length < 1 )
		throw 'postDoc() richiede almeno 1 argomento: doc (object).';
	else if ( typeof doc != 'object' ||
	!doc.title || typeof doc.title != 'string' ||
	!doc.msg   || typeof doc.msg   != 'string' ||
	!doc.img   || typeof doc.img   != 'object' ||
	!doc.img.content_type || typeof doc.img.content_type != 'string' ||
	!doc.img.data         || typeof doc.img.data         != 'string' ||
	!doc.loc || typeof doc.loc != 'object' ||
	!doc.loc.latitude  || typeof doc.loc.latitude  != 'number' || doc.loc.latitude  >  90 || doc.loc.latitude  <  -90 ||
	!doc.loc.longitude || typeof doc.loc.longitude != 'number' || doc.loc.longitude > 180 || doc.loc.longitude < -180 ){
		throw 'Parametro "doc" non valido.'
	} else {
		var newDoc = {};
		newDoc.user = georep.user._id;
		newDoc.title = doc.title;
		newDoc.msg = doc.msg;
		newDoc.loc = doc.loc;
		newDoc._attachments = {
			img: doc.img
		};
		$.ajax({
			url: georep.db.proto + georep.db.host + ':' +
			     georep.db.port + '/' + georep.db.name,
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(newDoc),
			headers: {Authorization: 'Basic ' + georep.user.base64},
			success: function(data){
				if(callback)
					callback(undefined,data);
			},
			error: function(jqXHR, textStatus, errorThrown){
				if(callback)
					callback({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown},undefined);
			}
		});
	}
};

// sezione relativa all'utente che utilizza il DB
georep.user = {
	_id: undefined,
	base64: undefined,
	configured: false,
	mail: undefined,
	nick: undefined,
	password: undefined,
	roles: [],
	type: 'user'
};

// ----------------------------------------------------------------------------------------------------------------------

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
