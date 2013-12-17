var testOk = {test1: false, test2: false, test3: false};
/* server configurato bene e utente già registrato */
var db = {
	proto: "http", 
	host: "pram.homepc.it", 
	port: 5984
};

var usr = {
	name: "ale",
	password: "ale",
	nick:"mora",
	mail:"mora@mail.com"
};
georep.db.setDBName("testdb");
georep.db.setURLServer(db);
georep.user.set(usr);

georep.user.signup(function(err,data){
	if (!err)
		console.log(data);
	else
		console.log(err);
});
