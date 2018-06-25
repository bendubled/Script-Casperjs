var casper = require('casper').create({
	
	verbose:true,
	logLevel: 'debug',
    pageSettings: {
      // On charge les images, vous pouvez accélerer le chargement des pages en changeant true en false
      // Mais Linkedin ou les autres plateformes pourront vous détecter car les images ne sont pas chargées.
      // Faites vos tests, honnêtement je n'ai pas encore esssaye.
      loadImages:  true,         
      loadPlugins: true         // use these settings
    },
    onDie: function(){
        console.log('Page is died');
    },
    onPageInitialized: function(){
        console.log("Page Initialized");
    }
});

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});
var url_connexion = 'http://www.mon-ip.com/';
//var fs = requiere('fs');
//casperjs --proxy="91.219.236.186:10273";
//var casper = requiere('casper').create({
//	proxy: "91.219.236.186:10273"
//});
casper.start(url_connexion, function() {
  // On peut afficher des messages dans la console avec console.log('mon message ici');
  console.log("*************************");
  console.log(" Page de connexion chargee");
  console.log("*************************");
  casper.wait(20000,function(){ 
      // casper.wait correspond à setTimeOut en javascript qui permet de différent une action d'un certain temps
      // ici 100 = 100 ms
      // Pour attendre 10 secondes, remplacez 100 par 10000
      casper.capture("./screenshots/proxy.png");
    });
  
   }); 
   
   casper.run();