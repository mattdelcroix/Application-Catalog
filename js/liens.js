//--CONSTANTES
var JSON_URL = "http://localhost/javascript-web-srv/data/liens.json";
//var JSON_URL = "https://si.axione.fr/catalogue/json/liens.json";

//--- REMPLISSAGE DES TABLEAUX --- 
//Création d'une cellule en-tête
function creationCelluleHead(valeur){
    var celluleElt = document.createElement("th");
    celluleElt.textContent = valeur;    
    return celluleElt;
}

//Création d'une cellule simple
function creationCellule(valeur){
    var celluleElt = document.createElement("td");
    celluleElt.textContent = valeur;    
    return celluleElt;
}

function creationLigneTableau(application, url, descriptif){
    //Création des éléments
    var ligneElt = document.createElement("tr");
    var appCell = creationCellule(application);
    
    var lienElt = document.createElement("a");
    lienElt.textContent = url;    
    lienElt.href = url;
    lienElt.target = "_blank";
    var lienCell = creationCellule("");
    lienCell.appendChild(lienElt);    
    
    var descCell = creationCellule(descriptif);
    
    //Intégration des éléments
    ligneElt.appendChild(appCell);
    ligneElt.appendChild(lienCell);
    ligneElt.appendChild(descCell);
    
    //retour élément ligne
    return ligneElt;
}

function viderTableau(){
    document.getElementById("contenu").innerHTML = "<caption id='caption'></caption>";
}

function remplirTableau(famille){
    document.getElementById("caption").textContent = document.getElementById(famille).textContent;
    
    ajaxGet(JSON_URL, function(reponse){
    //Mise en format JS
    var mesLiens = JSON.parse(reponse);    
    mesLiens.forEach(function (lien){
        if (famille === lien.famille){
            document.getElementById("caption").style.display = "";
            document.getElementById("contenu").appendChild(creationLigneTableau(lien.application, lien.url, lien.descriptif));    
        }
    });
});    
}

function ajoutHeadTableau(){
    //Création des éléments "En-Tete"    
    var ligneElt = document.createElement("tr");
    var appCell = creationCelluleHead("Application");
    appCell.style.width = "20%";
    var lienCell = creationCelluleHead("Lien");    
    lienCell.style.width = "30%";
    var descCell = creationCelluleHead("Descriptif");    
    descCell.style.width = "50%";
    
    //Intégration en-tete
    ligneElt.appendChild(appCell);
    ligneElt.appendChild(lienCell);
    ligneElt.appendChild(descCell);
    
    //Ajout au document
    document.getElementById("contenu").appendChild(ligneElt);
}

function annuleLiselection(){
    
    mesLi.forEach(function (elementLi){        
        elementLi.classList.remove("active");
    });
}  

//Ne pas afficher le caption 
document.getElementById("caption").style.display = "none";

//var mes Li : 
var mesLi = Array.prototype.slice.call(document.querySelectorAll("li a"));
console.log(mesLi);

//---ETAPE1 ---
//selection des liens : 
mesLi.forEach(function (liElt){
    //console.log(liElt.id);
    liElt.addEventListener("click", function (){
        viderTableau();
        ajoutHeadTableau();
        remplirTableau(liElt.parentNode.id);
        annuleLiselection();        
        liElt.classList.add("active");
    });
});

//---ETAPE 2---
//Affichage du tableau Réseaux par défaut
ajoutHeadTableau();
remplirTableau("reseaux");



//---AJOUT DE LA RECHERCHE ---
//Variable
var form = document.querySelector("form");
var search = document.getElementById("search");

//Affichage du preview lors de la saisie
search.addEventListener("input", function(e){  
    var texteRecherche = search.value;
    var longueurTexte = texteRecherche.length;
    
    if (longueurTexte >= 2){    
    ajaxGet(JSON_URL, function(data){
        document.getElementById("selection").innerHTML = "";
        
        var data = JSON.parse(data);
        data.forEach(function(lien){    
            if(lien.application.toLowerCase().startsWith(texteRecherche.toLowerCase())){
                var spanElt = document.createElement("span");
                spanElt.classList.add("survol");
                spanElt.textContent = lien.application;
                spanElt.addEventListener("click", function(e){
                    search.value = e.target.textContent;                    
                    document.getElementById("selection").innerHTML = "";
                });
                document.getElementById("selection").appendChild(spanElt);
                document.getElementById("selection").appendChild(document.createElement("br"));
            }
        });    
    });
    }
});

//Création d'un evenement lors de l'envoi du formulaire (Recherche);
form.addEventListener("submit", function(e){    
    var texteRecherche = e.target.elements[0].value.toLowerCase();
    e.preventDefault();
    
    //Récupération des données 
    ajaxGet(JSON_URL, function(data){
        viderTableau();
        ajoutHeadTableau();
        
        document.getElementById("selection").innerHTML = "";
        var data = JSON.parse(data);
        data.forEach(function(lien){
            //Si une occurence existe, alors la valeur sera >= 0 ;
            var application = lien.application.toLowerCase().search(texteRecherche);            
            var url = lien.url.toLowerCase().search(texteRecherche);
            var descriptif = lien.descriptif.toLowerCase().search(texteRecherche);
            
            if(application >= 0 || url >= 0 || descriptif >= 0 ){
                //Remplissage du tableau 
                annuleLiselection();
                document.getElementById("caption").style.display = "";
                document.getElementById("caption").textContent = "Résultat de la recherche";
                document.getElementById("contenu").appendChild(creationLigneTableau(lien.application, lien.url, lien.descriptif)); 
            }
        });
    });     
});