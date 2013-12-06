
/** -- USER ----------------------------------------------------------------- */
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
var DB = function (dbConf) {
	if (dbConfValidator(dbConf)){
		this.name  = dbConf.name;
		this.host  = dbConf.host;
		this.port  = dbConf.port;
		this.proto = dbConf.proto;
		this.admin = dbConf.admin;
	}
};

exports.DB = DB;

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
var Admin = function (adminConf) {
	if (adminConfValidator(adminConf))
		this.base64 = Ti.Utils.base64encode(adminConf.name + ':' + adminConf.password).text;
};

exports.Admin = Admin;

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
var Georep = function (georepConf) {
	if (georepConfValidator(georepConf)){
		this.db = georepConf.db;
		this.user = georepConf.user;
	}
};


Georep.prototype.getDoc = function(){
	console.log("getDoc()");
	console.log(constants);
};
Georep.prototype.getDocsInBox = function(){
	console.log("getDocsInBox()");
};
Georep.prototype.getUserDocs = function(){
	console.log("getUserDocs()");
};
Georep.prototype.postDoc = function(){
	console.log("postDoc()" + this.user);
	this.getDoc();
};

exports.Georep = Georep;

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

var constants = {
	/* vettore contenente l'elenco dei designDoc usati */
	designDocs: [
		{
			name: 'queries', /* nome di questo design document */
			handlers: [ /* vettore dei gestori delle diverse views */
				{
					name: '_view', /* gestore delle views map-reduce */
					views: ['allDocsByUser'] /* elenco delle views gestite da questo gestore */
				},
				{
					name: '_spatial', /* gestore delle views spaziali di geocouch */
					views: ['allDocsByLoc'] /* elenco delle views spaziali */
				}
			]
		}
	]
};
