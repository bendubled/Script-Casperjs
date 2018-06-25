// ———————————————————————————————————————————————————————————————
// ———————————————————————————————————————————————————————————————
// Title : Connexion à Linkedin
// ———————————————————————————————————————————————————————————————
// ***************************************************************
// Description 
// On va se connecter à Linkedin
// ***************************************************************
// ———————————————————————————————————————————————————————————————

// ***************************************************************
// On charge la librairie
// ***************************************************************
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

// Configuration des messages d'erreur
  // ***************************************************************
  // On affiche les messages d'erreur. Honnêtement ce n'est pas important
  // si vous ne comprenez pas cette partie, en fait il n'y a rien à comprendre.
  // On affiche juste les messages d'erreur voila :-)
  // ***************************************************************
  // print out all the messages in the headless browser context
casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

// ————————————————————————————————————————————————————————————————————
// Variables utilisees dans le script
// ————————————————————————————————————————————————————————————————————
// Url de connexion à Linkedin
var url_connexion = 'https://www.facebook.com/';

// Paramètres de connexion à linkedin
var credentials = {email:"evanmc@outlook.fr",password:"Blablacar66"};

// Identifiant des differents elements dont nous aurons besoin
var identifiant = {input_email:'input[name="email"]',input_password:'input[name="pass"]',valider_connexion:'button[name="login"]'};

// ————————————————————————————————————————————————————————————————————————————
// Commentaires sur le fonctionnement de casper
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

  // On va ensuite insérer nos identifiants en remplissant les champs textes correspondants
  this.sendKeys(identifiant.input_email,credentials.email);
  //#email is the id and follwed by value
  this.sendKeys(identifiant.input_password,credentials.password);
  
  casper.capture("./screenshots/champs_connexion_remplis.png");

  // Une fois qu'on aura cliqué rempli nos champs, on va cliquer sur le bouton de validation
  casper.thenClick(identifiant.valider_connexion,function(){
    // ici notre nouvelle page a ete chargee, et on va voir si la connexion s'est bien deroulee
    // en faisant une capture d'ecran

    // ————————————————————————————————————————————————————
    // Avec la nouvelle version de Linkedin, le chargement se fait en deux temps, 
    // Si vous voulez attendre que toute la page soit chargee, il faut attendre quelques secondes
    // ca depend de votre connexion internet
    // ————————————————————————————————————————————————————
});
    casper.wait(1000,function(){ 
      // casper.wait correspond à setTimeOut en javascript qui permet de différent une action d'un certain temps
      // ici 100 = 100 ms
      // Pour attendre 10 secondes, remplacez 100 par 10000
      casper.capture("./screenshots/linkedin_connecte.png");
    });


casper.wait(5000, function(){
 casper.thenOpen('https://m.facebook.com/home.php?_rdr', function(){ 
 console.log("**************************************");
      console.log("WELCOME");
	  console.log("**************************************");
casper.capture("./screenshots/step_4.png");
 });             
 });
 casper.wait(5000, function(){
 casper.thenOpen('https://m.facebook.com/ufi/reaction/profile/browser/?ft_ent_identifier=1067532626719988', function(){ 
 console.log("**************************************");
      console.log("TARGET");
	  console.log("**************************************");
casper.capture("./screenshots/target.png");
 });             
 });
//casper.then(function() {
  //  this.assertExists({
    //    type: 'xpath',
      //  path: '//div[@id="u_0_k"]//a[@class="touchable right _58x3"]//button[@type="submit"]'
    //}, "Got Here");
//});
var x = require('casper').selectXPath;
casper.wait(1000, function(){
	 var linkedin_result_identifiant = 
  {
    result_id:'div.item button._54k8 span._55sr'
  };
  var num_result = casper.getElementsInfo(linkedin_result_identifiant.result_id).length;
  console.log('****************************************');
  console.log(' Nombre de resultats : '+num_result);
  console.log('****************************************');
   var cpt = 1;
	var cpt_2 = 1;
//body.touch.x1._fzu._50-3.iframe.acw.portrait.tlBody:nth-child(2) div.timeline.timelineX div._55wo div._1n8h:nth-child(2) div._4g33._52we._55ss._5fjk._55so._59f6._1oby._5i-i div._4g34._195r._1ane._55st._3a-6:nth-child(2) > a._56bz._54k8._5c9u._5kqs._5caa


casper.repeat(num_result+1,function(){
	console.log(cpt_2);
	if(casper.exists('body.touch.x1._fzu._50-3.iframe.acw.portrait:nth-child(2) div.acw:nth-child(4) div._4g33:nth-child(1) div._4g34 div._xn5 div._5p-o div._1uja._59qr:nth-child(' +cpt_2 +') div.item button._54k8 span._55sr')){
	console.log('EXISTE');
	casper.wait(864000, function(){
			casper.click('body.touch.x1._fzu._50-3.iframe.acw.portrait:nth-child(2) div.acw:nth-child(4) div._4g33:nth-child(1) div._4g34 div._xn5 div._5p-o div._1uja._59qr:nth-child(' +cpt_2 +') div.item button._54k8 span._55sr');
						//body.touch.x1._fzu._50-3.iframe.acw.portrait:nth-child(3) div.acw:nth-child(4) div._4g33:nth-child(1) div._4g34 div._xn5 div._5p-o:nth-child(1) div._1uja._59qr:nth-child(8) div.item._cs2.acw div.ib.cc._1aj4 div._4mn.c a:nth-child(1) div._4mo span:nth-child(1) span:nth-child(1) > strong:nth-child(1)
	//casper.click('body.touch.x1._fzu._50-3.iframe.acw.portrait:nth-child(2) div._5m_x._3vjk._uvj.accelerate._4zez:nth-child(3) div._5m_v div._5m_u div._5m_t div._52jj._3vjl div:nth-child(4) div._4g33 div._55wr._4g34:nth-child(2) form._55-k > button._54k8._52jg._56bs._26vk._56b_._56bu:nth-child(2)');
cpt_2++;

		});
	}else{
		casper.wait(10000, function(){
			console.log('NEXISTEPAS');
	casper.capture("./screenshots/cliker.png");
	});
	cpt_2++;
		}
	//casper.click('body.touch.x1._fzu._50-3.iframe.acw.portrait:nth-child(2) div.acw:nth-child(4) div._4g33:nth-child(1) div._4g34 div._xn5 div._5p-o div._1uja._59qr:nth-child(6) div.item._cs2.acw div.ib.cc._1aj4 div._4mn.c a:nth-child(1) div._4mo span:nth-child(1) span:nth-child(1) > strong:nth-child(1)');
	//casper.click('div#reaction_profile_browser1 div.item button._54k8 span._55sr');
	//casper.click('div#page div.acw div._xn5 div.item button._54k8 span._55sr');
	//casper.click('body.touch.x1._fzu._50-3.iframe.acw.portrait:nth-child(2) div.acw:nth-child(4) div._4g33:nth-child(1) div._4g34 div._xn5 div._5p-o div._1uja._59qr:nth-child(1) div.item._cs2.acw div.ib.cc._1aj4 div._4mq.ext div._4g33 div._5s61:nth-child(1) div.right._2gb- div:nth-child(1) a.touchable.right._41g3 > button._54k8._52jg._56bs._26vk._56bu')[4];
	//casper.thenClick(x('//div[@id="u_0_k"]//a[@class="touchable right _58x3"]//button[@type="submit"]'),function(){
	
	//});
	
});

	//casper.repeat(num_result+1,function(){

//cpt_2++;
//console.log(cpt_2);
		//result_intermediaire.name = this.fetchText(linkedin_result_identifiant.result_id+":nth-child("+cpt+") "+linkedin_result_identifiant.name);
		//console.log(result_intermediaire.name);
		//if(casper.exists(linkedin_result_identifiant.result_id+":nth-child("+cpt+") ")){

			//casper.thenClick(x("'//html//div[@id='reaction_profile_browser']/div[3]/div[1] //div[@id='u_0_1m']//div[@data-sigil='m-add-friend-flyout']//a[@class='touchable right _41g3']//button[@type='submit']'"));
			
				//casper.thenClick('div._4mo');
				//casper.capture("./screenshots/target2.png");
			 
			//casper.thenClick('div.item button._54k8 span._55sr').foreach;
			// console.log("**************************************");
      
	//  console.log("**************************************");
		//}else
		//{	//casper.thenClick('button._54k8 span._55sr')+"("+cpt+") "; 
	// casper.wait(5000, function(){
 //casper.thenOpen('https://m.facebook.com/ufi/reaction/profile/browser/?ft_ent_identifier=10160508976760442&ref=page_internal', function(){ 
 //console.log("**************************************");
   //   console.log("TARGET");
	 // console.log("**************************************");
//casper.capture("./screenshots/target.png");
// });             
 //});

	//casper.reload;
		//});
		
		cpt++;
 

	  
	});
casper.capture("./screenshots/AllLike.png");
 }); 




// On lance notre script
casper.run();