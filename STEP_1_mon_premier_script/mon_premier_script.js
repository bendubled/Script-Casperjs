// ———————————————————————————————————————————————————————————————
// ———————————————————————————————————————————————————————————————
// Title : Mon premier script
// ———————————————————————————————————————————————————————————————
// ***************************************************************
// Description 
// On va faire decouvrir comment fonctionne casperjs et faire notre premiere capture d'ecran
// ***************************************************************
// ———————————————————————————————————————————————————————————————

// ***************************************************************
// On charge la librairie
// ***************************************************************
var casper = require('casper').create({
	verbose:true,
	logLevel: 'debug',
    pageSettings: {
      loadImages:  true,         // On charge les images, vous pouvez accélerer le chargement des pages en changeant true en false.
      loadPlugins: true         // use these settings
    },
    onDie: function(){
        console.log('Page is died');
    },
    onPageInitialized: function(){
        console.log("Page Initialized");
    }
});

// ***************************************************************
// On affiche les messages d'erreur. Honnêtement ce n'est pas important
// si vous ne comprenez pas cette partie, en fait il n'y a rien à comprendre.
// On affiche juste les messages d'erreur voila :-)
// ***************************************************************
  // print out all the messages in the headless browser context
  casper.on('remote.message', function(msg) {
      this.echo('remote message caught: ' + msg);
  });

  // print out all the messages in the headless browser context
  casper.on("page.error", function(msg, trace) {
      this.echo("Page Error: " + msg, "ERROR");
  });


// Url de connexion à Linkedin
var url_connexion = 'https://www.facebook.com/';

// ————————————————————————————————————————————————————————————————————————————
// Ok, ici il faut comprendre comment fonctionne casper. 
// Casperjs fonctionne de manière "séquentielle" (pardon pour les puristes si j'utilise mal le mot)
// Chaque étape se fait au fur et à mesure, et une étape peut se faire seulement si l'étape d'avant a été réalisée.
// ————————————————————————————————————————————————————————————————————————————
// Exemple : Pour se connecter à Linkedin, on va ouvrir la page de connexion,
// ensuite remplir les identifiants de connexion (email et mot de passe)
// et ensuite cliquer sur le bouton pour se connecter.
// ————————————————————————————————————————————————————————————————————————————
// On commence toujours un script avec casper.start et l'url que vous voulez ouvrir, 
// en l'occurence l'url de connexion Linkedin

casper.start(url_connexion, function() {
  // On peut afficher des messages dans la console avec console.log('mon message ici');
  console.log("*************************");
  console.log(" Page de connexion chargee");
  console.log("*************************");
  
  // On va prendre notre premier screenshot pour voir si la page s'est réellement bien chargee
  casper.capture("./screenshots/chargement_linkedin.png");
});

// On lance notre script
casper.run();

// Voila on a fait écrit notre premier script. Je sais qu'il est ultra simple mais c'est le début :-)
// ————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————
// Je sais que c'est chiant mais prenez l'habitude de bien organiser votre code, 
// vous gagnerez beaucoup de temps surtout dans la suite.
// Je suis le premier à ne pas le faire et je perds du temps à tout remettre en ordre après, 
// donc faites le dès le début, ce sera plus simple.
// ————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————
