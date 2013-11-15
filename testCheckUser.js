var testOk = {test1: false, test2: false, test3: false};
/* server configurato bene e utente già registrato */
georep.options.user = {};
georep.options.user.base64 = 'cGlwcG86cGlwcG8=';
georep.options.db.proto='http://';
georep.options.db.host='localhost';
georep.options.db.port='5984';
georep.options.db.dbname='places';
georep.checkUser(function(err, data){
	if (!err){
		if (data.isRegistered == true){
			console.log("Test server ok e utente già registrato: SUPERATO");
			testOk.test1= true;
		}
		else {
			throw "Test server ok e utente già registrato: FALLITO";
		}
	}
	else{
		throw 'Test server ok e utente già registrato: FALLITO\nerr: ' +err.err;
	}
});
/* server configurato bene e utente NON registrato */
georep.options.user.base64 = 'cGx1dG86cGx1dG8=';
georep.checkUser(function(err, data){
	if (!err){
		if (data.isRegistered == false){
			console.log("Test server ok e utente NON registrato: SUPERATO");
			testOk.test2= true;
		}
		else {
			throw "Test server ok e utente NON registrato: FALLITO";
		}
	}
	else{
		throw 'Test server ok e utente NON registrato: FALLITO\nerr: ' +err.err;
	}
});

/* server configurato male */
georep.options.db.host='localhostes';
georep.checkUser(function(err, data){
	if (!err){
		throw 'Test server ko FALLITO';
	}
	else{
		console.log('Test server ko SUPERATO');
		testOk.test3= true;
	}
});
