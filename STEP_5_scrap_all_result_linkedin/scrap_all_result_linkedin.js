// ———————————————————————————————————————————————————————————————
// ———————————————————————————————————————————————————————————————
// Title : Visite de TOUTES les personnes présentes en resultats 
// de recherches (toutes les pages, jusqu'a ce qu'il n' y ait plus de page)
// ———————————————————————————————————————————————————————————————
// ***************************************************************
// Description 
// On va visiter le profil de toutes les personnes en resultats de 
// recherche (toutes les pages :-))
// ———————————————————————————————————————————————————————————————
// ***************************************************************

var fs = require('fs');
// ***************************************************************
// Fin traitement
// ***************************************************************

// ***************************************************************
// On charge la librairie
// ***************************************************************
var casper = require('casper').create({
  verbose:true,
  logLevel: 'error',
    pageSettings: {
      // On charge les images, vous pouvez accélerer le chargement des pages en changeant true en false
      // Mais Linkedin ou les autres plateformes pourront vous détecter car les images ne sont pas chargées.
      // Faites vos tests, honnêtement je n'ai pas encore esssaye.
      loadImages:  true,         
      loadPlugins: true,         // use these settings
      clientScripts: ["../libs/jquery.min.js"]
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
  // On affiche les messages d'erreur qu'il y a sur la page. Honnêtement ce n'est pas important
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
var url_connexion = 'https://www.linkedin.com/';

// Paramètres de connexion - mettez vos identifiants ici
var credentials = {email:"xxxxxx@company.com",password:"*********"};

// Identifiant des differents elements dont nous aurons besoin
var identifiant = {input_email:'input[name="session_key"]',input_password:'input[name="session_password"]',valider_connexion:'#login-submit'};

// Tableau qui represente les resultats du scrapp
var result = [];

// Recherche Linkedin
var search_term = "CTO";
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
  casper.capture("./screenshots/step_1_chargement_linkedin.png");

  // On va ensuite insérer nos identifiants en remplissant les champs textes correspondants
  this.sendKeys(identifiant.input_email,credentials.email);
  //#email is the id and follwed by value
  this.sendKeys(identifiant.input_password,credentials.password);
  
  casper.capture("./screenshots/step_2_champs_connexion_remplis.png");

  // Une fois qu'on aura cliqué rempli nos champs, on va cliquer sur le bouton de validation
  casper.thenClick(identifiant.valider_connexion,function(){
    // ici notre nouvelle page a ete chargee, et on va voir si la connexion s'est bien deroulee
    // en faisant une capture d'ecran

    // ————————————————————————————————————————————————————
    // Avec la nouvelle version de Linkedin, le chargement se fait en deux temps, 
    // Si vous voulez attendre que toute la page soit chargee, il faut attendre quelques secondes
    // ca depend de votre connexion internet
    // ————————————————————————————————————————————————————

    casper.wait(10000,function(){ 
      // casper.wait correspond à setTimeOut en javascript qui permet de différent une action d'un certain temps
      // ici 100 = 100 ms
      // Pour attendre 10 secondes, remplacez 100 par 10000
      casper.capture("./screenshots/step_3_linkedin_connecte.png");

      // on appelle notre fonction pour faire la recherche
      casper.then(Search_on_linkedin_now);
    });
  });
});


function Search_on_linkedin_now(){
  console.log('*********************************');
  console.log('Search on linkedin now called');
  console.log('*********************************');

  var searchfield = {input_search:'.type-ahead-input-container input',button_search:'button.nav-search-button'}

  // J'ai remarque que pour faire apparaitre le bouton de validation sur Linkedin, il fallait déclencer l'evènement
  // focus sur l'input => C'est à dire le sélectionner
  casper.capture("./screenshots/step_4_linkedin_terme_recherche_avant_focus.png");
  this.sendKeys(searchfield.input_search,search_term,{keepFocus: true});
  //{keepFocus : true signifie qu'on veut que l'element soit marqué comme sélectionné (focus)}
  casper.capture("./screenshots/step_5_linkedin_terme_recherche_remplis.png");

  casper.thenClick(searchfield.button_search,function(){
    // ici idem, il faut attendre que la page soit entièrement chargee
    casper.wait(12000,function(){ 
      this.scrollToBottom();
      console.log('************************************');
      console.log('Scroll de la page de resultat en cours');
      console.log('************************************');
      this.evaluate(function() {
        //Evaluate permet d'injecter un script dans la page comme si on etait dans la console du navaigateur
        //On va donc scroller la page progressivement pour afficher toutes les photos
        //Sinon on ne pourra pas recuperer toutes les photos car Linkedin charge les images seulement quand
        //elles ont besoin d'etre affichees.
        for(var i=0;i<10;i++){$("html, body").animate({
          scrollTop: $('body').offset().top+i*$('body').height()/10
        }, 1400);}
        // le bout de code ci-dessous ajoute un attibut full_link a tous les liens de la page.
        // Cet attribut represente le lien complet vers le profil de la personne ex : https://www.linkedin.com/in/boristchangang
        $('a.search-result__result-link').each(function(index){
          $(this).attr('full_link',$(this)[0].href);
        });
      });
      // On scroll la page jusqu'à la fin pour que les photos soient chargees
      casper.wait(14000,function(){ // On attend 2 secondes histoire que les photos soient effectivement bien chargees
        casper.capture("./screenshots/step_6_resultats_recherche_"+search_term+".png");
        casper.then(Extract_data_on_page);
      });
    });
  });
}


function Extract_data_on_page(){
  //On va extraire les informations que l'on a sur la premiere page
  // ———————————————————————————————————————————————————————————————
  // Analyse de la structure des resultats
  // ———————————————————————————————————————————————————————————————
  // les resultants sont sous la forme : 
  // <ul class="results-list">
  //   <li class="search-result search-entity search-result--person"></li>
  //   <li class="search-result search-entity search-result--person"></li>
  // </ul>
  // Chaque li represente un resultat. ATTENTION, linkedin ajoute des id differents a chaque id pour embrouiller les scrappeurs je pense
  // Avant d'utiliser un id, il faut donc verifier qu'il correspond a l'element qu'on veut selectionner
  // Pour selectionner le premier element par exemple, ce serait : ul.results-list li.search-result.search-entity.search-result--person:eq(0)
  // Pour selectionner le deuxieme element, ce serait : ul.results-list li.search-result.search-entity.search-result--person:eq(1)
  // Vous l'avez donc compris, si on a le nombre d'elements presents sur la page, on peut faire une boucle et extraire tous nos resultats
  var linkedin_result_identifiant = 
  {
    result_id:'ul.results-list li.search-result.search-entity.search-result--person'
  };
  var num_result = casper.getElementsInfo(linkedin_result_identifiant.result_id).length;
  console.log('****************************************');
  console.log(' Nombre de resultats : '+num_result);
  console.log('****************************************');

  // Maintenant qu'on a le nombre de resultats, on peut les parcourir pour extraire le nom et prenom de la personne, 
  //le titre sur linkedin, la localisation, le poste actuel, le lien vers le profil de la personne pour aller scrapper d'autres informations plus tard.
  // ———————————————————————————————————————————————————————————————
  // Analyse des resultats pour trouver identifier les infos qui nous interesse
  // ———————————————————————————————————————————————————————————————
  // Le nom et prenom est compris dans l'element span.name
  // le titre sur Linkedin est compris dans l'element p.subline-level-1
  // la localisation est compris dans l'element p.subline-level-2
  // le poste actuel est compris dans l'element p.search-result__snippets
  // le lien vers le profil est compris dans l'element a.search-result__result-link
  // L'image se trouve dans l'element figure.search-result__image img
  linkedin_result_identifiant.name = 'span.name';
  linkedin_result_identifiant.titre = 'p.subline-level-1';
  linkedin_result_identifiant.localisation = 'p.subline-level-2';
  linkedin_result_identifiant.poste_actuel = 'p.search-result__snippets';
  linkedin_result_identifiant.link_to_profile = 'a.search-result__result-link';
  linkedin_result_identifiant.photo = 'figure.search-result__image img';

  var cpt = 1;

  // On va automatiquement replacer les virgules et les retours a la ligne pour avoir des donnees plus propres.
  var regex_comma = new RegExp(',', 'g');
  var regex_return = new RegExp('\n', 'g');
  var regex_slash = new RegExp('/\//', 'g');

  //petite fonction pour nettoyer nos donnees rapidement
  function clearData(data){
    if(data){
      data = data.trim();
      data = data.replace(regex_comma,' -');
      data = data.replace(regex_return,' ');
    }
    return data;
  }

  // On va faire une boucle autant de fois qu'il y a de resultats
  casper.repeat(num_result+1,function(){
      // On va d'abord verifier que l'element existe bien

      if(casper.exists(linkedin_result_identifiant.result_id+":nth-child("+cpt+") ")){
        //Si l'element existe bien on va recuperer les informations qui nous interesse
        //fetchText permet de recuperer le text d'un element 
        var result_intermediaire = {name:"",titre:"",localisation:"",poste_actuel:"",link_to_profile:"",photo:"",full_link:""};
        result_intermediaire.name = this.fetchText(linkedin_result_identifiant.result_id+":nth-child("+cpt+") "+linkedin_result_identifiant.name);
        result_intermediaire.titre = this.fetchText(linkedin_result_identifiant.result_id+":nth-child("+cpt+") "+linkedin_result_identifiant.titre);
        result_intermediaire.localisation = this.fetchText(linkedin_result_identifiant.result_id+":nth-child("+cpt+") "+linkedin_result_identifiant.localisation);
        result_intermediaire.poste_actuel = this.fetchText(linkedin_result_identifiant.result_id+":nth-child("+cpt+") "+linkedin_result_identifiant.poste_actuel);

        // Pour le lien, on va récupérer l'attribut href du lien
        result_intermediaire.link = this.getElementAttribute(linkedin_result_identifiant.result_id+":nth-child("+cpt+") "+linkedin_result_identifiant.link_to_profile, 'href');
        
        // Pour le lien, on va récupérer l'attribut full_link qu'on a rajoute 
        result_intermediaire.full_link = this.getElementAttribute(linkedin_result_identifiant.result_id+":nth-child("+cpt+") "+linkedin_result_identifiant.link_to_profile, 'full_link');
        
        // Pour l'image on va recuperer l'attribut src
        result_intermediaire.photo = this.getElementAttribute(linkedin_result_identifiant.result_id+":nth-child("+cpt+") "+linkedin_result_identifiant.photo, 'src');

        //on va nettoyer nos donnees
        result_intermediaire.name = clearData(result_intermediaire.name);
        result_intermediaire.titre = clearData(result_intermediaire.titre);
        result_intermediaire.localisation = clearData(result_intermediaire.localisation);
        result_intermediaire.poste_actuel = clearData(result_intermediaire.poste_actuel);
        result_intermediaire.link = clearData(result_intermediaire.link);
        result_intermediaire.photo = clearData(result_intermediaire.photo);

        //on ajoute ça a notre tableau final
        result.push(result_intermediaire);
      }
      // On incremente la valeur du compteur cpt pour avoir les informations de la personne suivante a la prochaine boucle
      cpt++;
  });

  casper.then(function(){
    console.log('*******************************');
    console.log('Results');
    //On va sauvegarder nos resultats dans un fichier csv par exemple c'est plus interessant
    //fs permet de manipuler les fichiers
    //on va separer les valeurs dans notre fichier par des virgules (csv)
    var sep = ",";
    var csv = "nom,localisation,titre_linkedin,postactuel,identifiant_profil_linkedin,photo_url,lien_vers_profile"+'\n';
    for(var i=0;i<result.length;i++){
      //on affiche dans la console pour voir les resultats
      console.log(result[i].name+'\t|\t'+result[i].titre+'\t|\t'+result[i].localisation+'\t|\t'+result[i].poste_actuel+'\t|\t'+result[i].link+'\t|\t'+result[i].photo+'\t|\t'+result[i].full_link);
      console.log('——————————————————————————————————————————————————————');
      //replace(regex,'-') : cette operation permet de remplacer les virgules 
      csv += result[i].name+sep+result[i].titre+sep+result[i].localisation+sep+result[i].poste_actuel+sep+result[i].link+sep+result[i].photo+sep+result[i].full_link+'\n';
    }
    fs.write("results_scrapped.csv", csv, {mode:"a",charset:"iso-8859-1"});
    console.log('*******************************');
    // ————————————————————————————————————————————————————————————————————————————————————————
    // Ici au lieu de visiter tous les profils, On va ouvrir la page suivant des resultats
    // ————————————————————————————————————————————————————————————————————————————————————————
    casper.then(getNextPage);
  });  

  function getNextPage(){
    var bouton_suivant = 'button.next';
    if(this.exists(bouton_suivant)){
      console.log('************************************');
      console.log(' Bouton suivant detecte');
      console.log('************************************');
      //Si le bouton suivant existe et est donc bien sur la page, on va passer a la page suivante
      //On va cliquer sur le bouton pour avoir la page suivante
      casper.then(function() {
        // Click on 1st result link
        this.click(bouton_suivant);
        //On suppose qu'en 10 secondes la nouvelle page de resultats est chargee (si votre connexion n'est pas trop pourrie)
        casper.wait(10000,function(){ 
          //Ici la page est bien charge - On va faire un screenshot
          //on va recuperer le numero de la page active
          var page_active = 'li.page-list li.active';
          var page = this.fetchText(page_active);
          //on reinjecte notre script pour afficher les images et pouvoir recuperer les informations ensuite
          this.evaluate(function() {
            //Evaluate permet d'injecter un script dans la page comme si on etait dans la console du navaigateur
            //On va donc scroller la page progressivement pour afficher toutes les photos
            //Sinon on ne pourra pas recuperer toutes les photos car Linkedin charge les images seulement quand
            //elles ont besoin d'etre affichees.
            for(var i=0;i<10;i++){$("html, body").animate({
              scrollTop: $('body').offset().top+i*$('body').height()/10
            }, 1400);}
            // le bout de code ci-dessous ajoute un attibut full_link a tous les liens de la page.
            // Cet attribut represente le lien complet vers le profil de la personne ex : https://www.linkedin.com/in/boristchangang
            $('a.search-result__result-link').each(function(index){
              $(this).attr('full_link',$(this)[0].href);
            });
          });
          // On scroll la page jusqu'à la fin pour que les photos soient chargees
          casper.wait(14000,function(){ // On attend 2 secondes histoire que les photos soient effectivement bien chargees
            casper.capture("./screenshots/searchpages/page_"+page+"_resultats_recherche_"+search_term+".png");
            //Comme il y a 50 pages et qu'on ne va pas attendre les 50 pages pour le tuto, on s'arrete a la 2 eme page
            if(parseInt(page)<3)
              casper.then(Extract_data_on_page);
            else
              casper.then(visitProfil);
          });
        });
      });
    }else{
      casper.then(visitProfil);
    }
  }

  //Petite fonction pour avoir la date sous un format yyyy-mm-dd HH:mm:ss
  function getDateFromNow(){
    var date = new Date();
    return date.getFullYear()+'-'+(date.getMonth()<10?'0':'')+(date.getMonth()+1)+'-'+(date.getDate()<10?'0':'')+date.getDate()+' '+(date.getHours()<10?'0':'')+date.getHours()+':'+(date.getMinutes()<10?'0':'')+date.getMinutes()+':'+(date.getSeconds()<10?'0':'')+date.getSeconds();
  }

  //Petite fonction qui genere un nombre aleatoire qui va nous servir a faire croire 
  //a Linkedin qu'on est un homme :-) (ou une femme aussi :-))
  function getAleaTime(){
    //On va creer un intervalle de secondes qui varie de 4 secondes à 13 secondes par tranche de 1.5 secondes
    var t = [4000,5500,7000,8500,10000,11500,13000];
    var pos = Math.ceil(Math.random() *(t.length-1));
    if(t[pos])
      return t[pos];
    else
      return 4000;
  }
  
  function visitProfil(){
    //fs permet de manipuler les fichiers
    //on va separer les valeurs dans notre fichier par des virgules (csv)
    var sep = ",";
    //Nos resultats sont dans le tableau result
    //On va executer la boucle autant de fois qu'on a de resultats
    var cpt = 0;
    console.log('*********************************************');
    console.log('—————————————————————————————————————————————');
    console.log('*********************************************');
    console.log('Nombre de profils a visiter : '+result.length);
    console.log('*********************************************');
    console.log('—————————————————————————————————————————————');
    console.log('*********************************************');
    casper.repeat(result.length,function(){
      if(result[cpt].full_link){
        //Quand vous scrappez, il faut essayer de reproduire le comportement humain le mieux possible.
        //On va donc utiliser la fonction getAleaTime() au-dessus pour visiter les profils avec une frequence aleatoire.
        var alea = getAleaTime();
        casper.wait(alea,function(){ 
          casper.thenOpen(result[cpt].full_link, function() {
            //On attend que le profil se charge a cause de la nouvelle version de Linkedin
            console.log('Profil ouvert : '+result[cpt].full_link);
            casper.wait(4500,function(){ 
              console.log('************************************');
              console.log(' Nouvelle visite du profil de '+result[cpt].name+ ' - '+getDateFromNow()+ ' avec un delai de '+(alea/1000)+' secondes');
              console.log(' Progression : '+(Math.ceil((cpt+1)*100/result.length))+' %');
              console.log('************************************');
              result[cpt].last_visited = getDateFromNow();
              cpt++;
              var lin = result[cpt].link.replace(/\//ig,'-');
              console.log(lin);
              casper.capture("./screenshots/profilvisited/"+lin+".png");
            });
          });
        });
      }else{
        cpt++;
      } 
    });

    //N'oubliez pas ce que je vous ai dis au départ : Casperjs fait tache par tache, 
    //Donc pour lui dire qu'on a termine la tache precedente et qu'il peut continuer, 
    //il faut utiliser casper.then(function(){});
    casper.then(function(){
      var csv = "nom,localisation,titre_linkedin,postactuel,identifiant_profil_linkedin,photo_url,lien_vers_profile,lastvisited"+'\n';
      for(var i=0;i<result.length;i++){
        //on affiche dans la console pour voir les resultats
        console.log(result[i].name+'\t|\t'+result[i].titre+'\t|\t'+result[i].localisation+'\t|\t'+result[i].poste_actuel+'\t|\t'+result[i].link+'\t|\t'+result[i].photo+'\t|\t'+result[i].full_link+'\t|\t'+result[i].last_visited);
        console.log('——————————————————————————————————————————————————————');
        //replace(regex,'-') : cette operation permet de remplacer les virgules 
        csv += result[i].name+sep+result[i].titre+sep+result[i].localisation+sep+result[i].poste_actuel+sep+result[i].link+sep+result[i].photo+sep+result[i].full_link+sep+result[i].last_visited+'\n';
      }
      fs.write("results_scrapped_with_lastvisited.csv", csv, {mode:"a",charset:"iso-8859-1"});
      console.log('*******************************');
    });

  }
}
// On lance notre script
casper.run();