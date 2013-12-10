
/** -- USER ----------------------------------------------------------------- */

/**
 * Costruttore dell'oggetto User.
 * Definisce l'utente locale che utilizzera' il database remoto.
 * 
 * userConf (object) : cofigurazioni per istanziare un nuovo utente.
 *     {
 * 	        name:     < username dell'utente >             (string),
 *          password: < password dell'utente >             (string),
 *          nick:     < nick name utilizzato dall'utente > (string),
 *          mail:     <indirizzo e-mail dell'utente >      (string)
 *     }
 */
var User = function (userConf) {
	if (userConfValidator(userConf)){
		this._id = 'org.couchdb.user:' + userConf.name;
		this.name = userConf.name;
		this.password = userConf.password;
		this.type = 'user';
		this.roles = [];
		this.nick = userConf.nick;
		this.mail = userConf.mail;
		this.base64 = Ti.Utils.base64encode(userConf.name + ':' + userConf.password).text;
	}
};

/**
 * Aggiorna localmente le configurazioni di un utente.
 * 
 * newUserConf (object) : nuove cofigurazioni per l'utente.
 *     {
 * 	        name:     < username dell'utente >             (string),
 *          password: < password dell'utente >             (string),
 *          nick:     < nick name utilizzato dall'utente > (string),
 *          mail:     <indirizzo e-mail dell'utente >      (string)
 *     }
 * 
 * Ritorna un oggetto con le vecchie configurazioni.
 */
User.prototype.update = function(newUserConf){
	var oldUserConf = {
		name: this.name,
		password: this.password,
		nick: this.nick,
		mail: this.name
	};
	if (userConfValidator(newUserConf)){
		this._id = 'org.couchdb.user:' + newUserConf.name;
		this.name = newUserConf.name;
		this.password = newUserConf.password;
		this.type = 'user';
		this.roles = [];
		this.nick = newUserConf.nick;
		this.mail = newUserConf.mail;
		this.base64 = Ti.Utils.base64encode(newUserConf.name + ':' + newUserConf.password).text;
		return oldUserConf;
	}
};

exports.User = User;

/** -- Funzioni ausiliare per USER */

/**
 * Verifica la correttezza delle configurazioni per User
 */
var userConfValidator = function (uc) {
	if (!uc)
		throw {
			error: 'a userConf object is required',
			userConf: uc
		};
	else if (!uc.name     || typeof uc.name     != 'string' ||
	         !uc.password || typeof uc.password != 'string' ||
	         !uc.nick     || typeof uc.nick     != 'string' ||
	         !uc.mail     || typeof uc.mail     != 'string'   )
		throw {
			error: 'some userConf properties are invalid',
			userConf: uc
		};
	else
		return true;
};




/** -- DB ------------------------------------------------------------------- */

/**
 * Costruttore per l'oggetto DB
 * Definisce un database CouchDB remoto.
 * 
 * dbConf (object) : configurazioni per istanziare un nuovo database remoto
 *     {
 *         proto: < protocollo di comunicazione (http, https, ...) > (string),
 *         host:  < host name o ip del server >                      (string),
 *         port:  < porta remota in ascolto >                        (number),
 *         name:  < nome del database >                              (string),
 *         admin: < un istanza di Admin >                            (Admin )
 *     }
 */
var DB = function (dbConf) {
	if (dbConfValidator(dbConf)){
		this.name  = dbConf.name;
		this.host  = dbConf.host;
		this.port  = dbConf.port;
		this.proto = dbConf.proto;
		this.admin = dbConf.admin;
	}
};

/**
 * Ritorna l'URL relativo al server.
 */
DB.prototype.getURLServer = function(){
	return this.proto + '://' + this.host + ':' + this.port;
};

/**
 * Ritorna l'URL relativo al database sul server.
 */
DB.prototype.getURLDB = function(){
	return this.proto + '://' + this.host + ':' + this.port + '/' + this.name;
};

exports.DB = DB;

/** -- Funzioni ausiliare per DB */

/**
 * Verifica la correttezza delle configurazioni per DB
 */
var dbConfValidator = function (dbc) {
	if (!dbc)
		throw {
			error: 'a dbConf object is required',
			dbConf: dbc
		};
	else if (!dbc.name  || typeof dbc.name  != 'string'   ||
	         !dbc.host  || typeof dbc.host  != 'string'   ||
	         !dbc.proto || typeof dbc.proto != 'string'   ||
	         !dbc.admin || !(dbc.admin instanceof Admin)  ||
	         !dbc.port  || typeof dbc.port  != 'number'   || dbc.port <= 0 || dbc.port >= 65536)
		throw {
			error: 'some dbConf properties are invalid',
			dbConf: dbc
		};
	else
		return true;
};




/** -- ADMIN ---------------------------------------------------------------- */

/**
 * Costruttore per l'oggetto Admin.
 * Definisce le credeziali di accesso per amministrase un DB remoto.
 * 
 * adminConf (object) : configurazioni per istanziare un nuovo admin
 *     {
 * 	        name:     < nome utente amministratore >   (string),
 *          password: < password dell'amministratore > (string)
 *     }
 */
var Admin = function (adminConf) {
	if (adminConfValidator(adminConf))
		this.base64 = Ti.Utils.base64encode(adminConf.name + ':' + adminConf.password).text;
};

exports.Admin = Admin;

/** -- Funzioni ausiliare per ADMIN */

/**
 * Verifica la correttezza delle configurazioni per Admin
 */
var adminConfValidator = function (ac) {
	if (!ac)
		throw {
			error: 'a adminConf object is required',
			adminConf: ac
		};
	else if (!ac.name      || typeof ac.name      != 'string' ||
	         !ac.password  || typeof ac.password  != 'string'  )
		throw {
			error: 'some adminConf properties are invalid',
			georepConf: ac
		};
	else
		return true;
};




/** -- GEOREP --------------------------------------------------------------- */

/**
 * Costruttore per l'oggetto Georep.
 * 
 * Permette ad un utente 'user' di interfacciarsi con un 'db' database CouchDB
 * remoto esteso con Geocouch.
 * 
 * georepConf (object) : oggetto con le configurazioni per inizializzare l'interfaccia
 *     {
 *         db:   < un istanza di DB >   (DB  ),
 *         user: < un istanza di User > (User)
 *     }
 */
var Georep = function (georepConf) {
	if (georepConfValidator(georepConf)){
		this.db = georepConf.db;
		this.user = georepConf.user;
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
Georep.prototype.getDoc = function(docId, attachments, callback){
	if( arguments.length < 2 )
		throw {
			error: 'getDoc() richiede almeno 2 argomenti: docId (string), attachment (boolean).',
			args: arguments
		};
	else if (!docId || typeof docId != 'string' || typeof attachments != 'boolean')
		throw {
			error: 'Uno o piu\' parametri non validi.',
			args: arguments
		};
	else if (callback && typeof callback != 'function'){
		throw {
			error: 'callback deve essere una funzione.',
			args: arguments
		};
	} else {
		var attach = (attachments)?'?attachments=true':'?attachments=false';
		var url = this.db.getURLDB() + '/' + docId + attach;

		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				if(callback)
					// this.responseText contiene la risposta di tipo json
					callback(undefined,this.responseText);
			},
			onerror: function(e){
				if(callback)
					callback(e,undefined);
			}
		});
		
		client.open("GET", url);
		client.setRequestHeader("Authorization", "Basic " + this.user.base64);
		/**
		 * mi assicura che la risposta arrivi con l'allegato in base64
		 * invece che in binario in un oggetto MIME a contenuti multipli
		 */
		client.setRequestHeader("Accept", "application/json");
		client.send();
	}
};
/**
 * Chiede al DB tutti i documenti che sono posizionati in una certa area
 * rettangolare.
 *
 * bl_corner (object): coordinate del vertice in basso a sinistra del
 *     rettangolo.
 * tr_corner (object): coordinate del vertice in alto a destra del
 *     rettangolo.
 * callback ( function(err, data) ): funzione chiamata al termine della
 *     richiesta al server. In caso di errore, 'err' contiene un oggetto
 *     che descrive l'errore altrimenti 'data' contiene il risultato
 *     della query.
 *
 * entrambi i vertici sono oggetti del tipo:
 *     {
 *         lng: (number),
 *         lat: (number)
 *     }
 */
Georep.prototype.getDocsInBox = function(bl_corner, tr_corner, callback){
	if (arguments.length < 2)
		throw {
			error: 'getDocsInBox() richiede due argomenti: bl_corner (object), tr_corner (object).',
			args: arguments
		};
	else if (!mapPointValidator(bl_corner) || !mapPointValidator(tr_corner))
		throw {
			error: 'Uno o piu\' parametri non validi.',
			args: arguments
		};
	else if (arguments.length > 2 && typeof callback != 'function')
		throw {
			error: 'Parametro opzionale non valido: callback.',
			args: arguments
		};
	else {
		var viewPath = constants.designDocs[0].name + '/' +
		               constants.designDocs[0].handlers[1].name + '/' +
		               constants.designDocs[0].handlers[1].views[0];
		var queryOpts = '?bbox=' +
		                bl_corner.lng + ',' + bl_corner.lat + ',' +
		                tr_corner.lng + ',' + tr_corner.lat;
		                
		var url = this.db.getURLDB() + '/_design/' + viewPath + queryOpts;
		
		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				if(callback)
					callback(undefined, this.responseText);
			},
			onerror: function(e){
				if(callback)
					callback(e,undefined);
			}
		});
		client.open("GET", url);
		client.setRequestHeader("Authorization", 'Basic ' + this.user.base64);
		client.setRequestHeader("Accept", 'application/json');
		client.send();
	}
};
/**
 * Chiede al DB tutti gli ID dei documenti creati da un utente.
 *
 * userId (string): identificatore unico di un utente.
 * callback ( function(err, data) ): funzione chiamata al termine della
 *     richiesta al server. In caso di errore, 'err' contiene un oggetto
 *     che descrive l'errore altrimenti 'data' contiene il risultato
 *     della query.
 */
Georep.prototype.getUserDocs = function(userId, callback){
	var viewPath = constants.designDocs[0].name + '/' +
		           constants.designDocs[0].handlers[0].name + '/' +
		           constants.designDocs[0].handlers[0].views[0];
	var queryOpts = '?key="' + userId + '"';
	
	if (arguments.length < 1)
		throw {
			error: 'getUserDocs() richiede almeno un argomento: userId (string).',
			args: arguments
		};
	else if (!userId || typeof userId != 'string')
		throw {
			error: 'parametro non valido: userId deve essere una stringa non vuota.',
			args: arguments
		};
	else if (arguments.length > 1 && typeof callback != 'function')
		throw {
			error: 'parametro opzionale non valido: callback deve essere una funzione.',
			args: arguments
		};
	else {
		var url = this.db.getURLDB() + '/_design/' + viewPath + queryOpts;
		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				if(callback)
					callback(undefined, this.responseText);
			},
			onerror: function(e){
				if(callback)
					callback(e,undefined);
			}
		});
		client.open("GET", url);
		client.setRequestHeader("Authorization", 'Basic ' + this.user.base64);
		client.setRequestHeader("Accept", 'application/json');
		client.send();
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
Georep.prototype.postDoc = function(doc,callback){
	if( arguments.length < 1 ){
			throw {
				error: 'postDoc() richiede almeno 1 argomento: doc (object).',
				args: arguments
			};
		}
		else if ( typeof doc != 'object' ||
		!doc.title || typeof doc.title != 'string' ||
		!doc.msg   || typeof doc.msg   != 'string' ||
		!doc.img   || typeof doc.img   != 'object' ||
		!doc.img.content_type || typeof doc.img.content_type != 'string' ||
		!doc.img.data         || typeof doc.img.data         != 'string' ||
		!doc.loc || typeof doc.loc != 'object' ||
		!doc.loc.latitude  || typeof doc.loc.latitude  != 'number' || doc.loc.latitude  >  90 || doc.loc.latitude  <  -90 ||
		!doc.loc.longitude || typeof doc.loc.longitude != 'number' || doc.loc.longitude > 180 || doc.loc.longitude < -180 ){
			throw {
				error: 'Parametro "doc" non valido.',
				args: arguments
			};
		}
		else if (typeof callback != 'function'){
			throw {
				error: 'Il paramentro opzionale deve essere una funzione',
				args: arguments
			};
		}
		else {
			var newDoc = {};
			newDoc.userId = this.user._id;
			newDoc.title = doc.title;
			newDoc.msg = doc.msg;
			newDoc.loc = doc.loc;
			newDoc._attachments = {
				img: doc.img
			};
			var url = this.db.getURLDB();
			var client = Ti.Network.createHTTPClient({
				onload: function(data){
					if(callback)
						callback(undefined,data);
				},
				error: function(e){
					if(callback)
						callback(e,undefined);
				}
			});
			client.open("POST", url);
			
			client.setRequestHeader("Authorization", 'Basic ' + this.user.base64);
			client.setRequestHeader("Content-Type", "application/json");
			
			client.send(JSON.stringify(newDoc));
		}
};
/**
 * Controlla se un utente è registrato sul server CouchDB (geocouch).
 * 
 * callback ( function(err, data) ):
 *                 funzione di callback, NON OPZIONALE, chiamata sia in caso di errore che di successo;
 *         err: oggetto che descrive l'errore, se si è verificato;
 *        data: true se l'utente è già registrato, false se non lo è .
 */
Georep.prototype.checkRemoteUser = function(callback){
	/* callback è obbligatorio perchè checkUser() esegue una richiesta asincrona */
	if( arguments.length != 1 || typeof callback != 'function'){
		throw {
			error: 'checkUser() richiede un argomento: callback (function(err, data)).',
			args: arguments
		};	
	} else {
		/* richiedo info sul db, usando come credenziali di accesso quelle dell'utente locale, 
		   se l'accesso al db viene negato, significa che l'utente non è registrato
		 */
		var url = this.db.getURLServer();
		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				callback(undefined, {isRegistered: true});
			},
			onerror: function(e){
				if (e.error == '401') {
					callback(undefined, {isRegistered: false});
				} else {
					callback(e, undefined);
				}
			}
		});
		client.open("GET", url);
		client.setRequestHeader("Authorization", 'Basic ' + this.user.base64);
		client.send();
	}
};
/**
 * Registra l'utente sul server CouchDB(questa funzione dovrà essere fatta poi dal server direttamente)
 *
 * callback ( function(err, data) ):
 *     funzione di callback chiamata sia in caso di errore che di successo;
 *         err: oggetto che descrive l'errore, se si e' verificato;
 *        data: oggetto che mostra il messaggio ricevuto se non si sono verificati errori.
 */
Georep.prototype.signupRemoteUser = function(callback){
	if( arguments.length == 1 && typeof callback != 'function' ) {
					throw {
						error: 'Il parametro opzionale deve essere una funzione',
						args: arguments
					};
	} else {
		var url = this.db.getURLServer() + '/_users/' + this.user._id;
		Ti.API.debug(url);		  
		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				/*console.log("Utente registrato con successo! " +data);*/
				if (callback) {
					callback(undefined, data);
				}
			},
			onerror: function(e){
				/*console.log("Utente NON registrato! " + e.err);*/
				if (callback){
					callback(e, undefined);
				}
			}
		});
		client.open("PUT", url);
		
		client.setRequestHeader("Authorization", 'Basic ' + this.db.admin.base64);
		client.setRequestHeader("Content-Type", "application/json");
		
		var usersignup = {
			 name: this.user.name,
			 password: this.user.password,
			 nick: this.user.nick,
			 mail: this.user.mail,
			 type: this.user.type,
			 roles: this.user.roles
		};
		client.send(JSON.stringify(usersignup));
		
	}
};
/**
 * Aggiorna l'utente corrente sia in locale che sul DB.
 *
 * user (object): deve essere un utente valido per 'georep.user.set()'
 * callback ( function(err, data) ):
 *     funzione di callback chiamata sia in caso di errore che di successo;
 *         err: oggetto che descrive l'errore, se si e' verificato;
 *        data: oggetto che mostra il messaggio ricevuto se non si sono verificati errori.
 */
Georep.prototype.updateRemoteUser = function(user, callback){
		if (arguments.length < 1){
		throw {
			error: 'update() richiede un argomento: user (object).',
			args: arguments
		};
	} else if (typeof user != 'object') {
		throw {
			error: 'Impossibile aggiornare l\'utente, parametro non valido.',
			args: arguments
		};
	} else if (
	!user.nick      || typeof user.nick      != 'string' ||
	!user.mail      || typeof user.mail      != 'string' ){
		throw {
			error: 'Impossibile settare "user", uno o piu\' properties non valide.',
			args: arguments
		};
	} else if (arguments.length > 1 && typeof callback != 'function') {
		throw {
			error: 'Il parametro opzionale deve essere una funzione',
			args: arguments
		};
	} else {
		var tmpService = this; // serve perchè dentro la funzione di callback this è window anzichè Georep
		this.getRemoteUser(function(err,data){					
			if(!err){
				var rev = JSON.parse(data)._rev;
				var url = tmpService.db.getURLServer() + '/_users/' + tmpService.user._id +
					  '?rev=' + rev;
				
				var client = Ti.Network.createHTTPClient({
					onload: function(data){
						tmpService.user.update(user);
						if (callback) {
							callback(undefined, data);
						}
					},
					onerror: function(e){
						if (callback){
							callback(e, undefined);
						}
					}
				});
				client.open("PUT", url);
		
				client.setRequestHeader("Authorization", 'Basic ' + tmpService.db.admin.base64);
				client.setRequestHeader("Content-Type", "application/json");
				
				user.type = tmpService.user.type;
				user.roles = tmpService.user.roles;
				user._id = tmpService.user._id;
				user.name = tmpService.user.name;
				user.password = tmpService.user.password;
				
				client.send(JSON.stringify(user));
			}else{
				if (callback){
					callback(err, undefined);
				}
			}
		});
	}
};
/** 
 * Recupera le informazioni d'utente dal server.
 *
 * callback ( function(err, data) ):
 *                 funzione di callback, NON OPZIONALE, chiamata sia in caso di errore che di successo;
 *         err: oggetto che descrive l'errore, se si è verificato;
 *        data: (object) le info sull'utente
 *              {
 *                  _id:             (string)
 *                  _rev:            (string)
 *                  derived_key:     (string)
 *                  iterations:      (number)
 *                  mail:            (string)
 *                  name:            (string)
 *                  nick:            (string)
 *                  password_scheme: (string)
 *                  roles:           (array)
 *                  salt:            (string)
 *                  type:            (string)
 *              }
 */
Georep.prototype.getRemoteUser = function(callback){
		/* callback è obbligatorio perchè getRemote usa una funzione asincrona */
	if( arguments.length != 1){
		throw {
			error: 'getRemote() richiede un argomento: callback (function(err, data)).',
		};	
	} else if (typeof callback != 'function'){
		throw {
			error: 'Parametro non valido: callback deve essere \'function\'.',
			args: arguments
		};
	} else {
		var url = this.db.getURLServer() + '/_users/' + this.user._id;
		var client = Ti.Network.createHTTPClient({
			onload: function(data){
				callback(undefined, this.responseText);
			},
			onerror: function(e){
				callback(e, undefined);
			}
		});
		client.open("GET", url);
		
		client.setRequestHeader("Authorization", 'Basic ' + this.user.base64);
		client.setRequestHeader("Accept", 'application/json');
		
		client.send();
	}
};

exports.Georep = Georep;

/** -- Funzioni ausiliare per GEOREP */

/**
 * Verifica la correttezza delle configurazioni per Georep
 */
var georepConfValidator = function (gc) {
	if (!gc)
		throw {
			error: 'a georepConf object is required',
			georepConf: gc
		};
	else if (!gc.db   || !(gc.db   instanceof DB)   ||
	         !gc.user || !(gc.user instanceof User)  )
		throw {
			error: 'some georepConf properties are invalid',
			georepConf: gc
		};
	else
		return true;
};
/**
 * Verifica la correttezza dell'oggetto che descrive un punto nella mappa.
 */
var mapPointValidator = function (point) {
	return !(typeof point != 'object' ||
	!point.lng || typeof point.lng != 'number'|| point.lng < -180 || point.lng > 180 ||
	!point.lat || typeof point.lat != 'number'|| point.lat <  -90 || point.lat >  90  );
};



/** -- COSTANTI utilizzate nel resto del codice ---------------------------------------- */

var constants = {
	/** vettore contenente l'elenco dei designDoc usati */
	designDocs: [
		{
			name: 'queries', /** nome di questo design document */
			handlers: [ /** vettore dei gestori delle diverse views */
				{
					name: '_view', /** gestore delle views map-reduce */
					views: ['allDocsByUser'] /** elenco delle views gestite da questo gestore */
				},
				{
					name: '_spatial', /** gestore delle views spaziali di geocouch */
					views: ['allDocsByLoc'] /** elenco delle views spaziali */
				}
			]
		}
	]
};
