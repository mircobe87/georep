
/** -- USER ----------------------------------------------------------------- */
var User = function (userConf) {
	this._id = 'org.couchdb.user:' + userConf.name;
	this.name = userConf.name;
	this.password = userConf.password;
	this.type = 'user';
	this.roles = [];
	this.nick = userConf.nick;
	this.mail = userConf.mail;
	this.base64 = Ti.Utils.base64encode(userConf.name + ':' + userConf.password).text;
};

User.prototype.update = function(newUserConf){
	var oldUserConf = {
		name: this.name,
		password: this.password,
		nick: this.nick,
		mail: this.name
	};
	this._id = 'org.couchdb.user:' + newUserConf.name;
	this.name = newUserConf.name;
	this.password = newUserConf.password;
	this.type = 'user';
	this.roles = [];
	this.nick = newUserConf.nick;
	this.mail = newUserConf.mail;
	this.base64 = Ti.Utils.base64encode(newUserConf.name + ':' + newUserConf.password).text;
	return oldUserConf;
};

exports.User = User;




/** -- DB ------------------------------------------------------------------- */
var DB = function (dbConf) {
	this.name  = dbConf.name;
	this.host  = dbConf.host;
	this.port  = dbConf.port;
	this.proto = dbConf.proto;
	this.admin = dbConf.admin;  
};

exports.DB = DB;




/** -- ADMIN ---------------------------------------------------------------- */
var Admin = function (adminConf) {
	this.base64 = Ti.Utils.base64encode(adminConf.name + ':' + adminConf.password).text;
};

exports.Admin = Admin;




/** -- GEOREP --------------------------------------------------------------- */
var Georep = function (georepConf) {
	this.db = georepConf.db;
	this.user = georepConf.user;
};

Georep.prototype.getDoc = function(){
	console.log("getDoc()");
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

