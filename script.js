let publications = JSON.parse(localStorage.getItem("sunuconnect_publications")) || [];

function sauvegarder() {
    localStorage.setItem(
        "sunuconnect_publications",
        JSON.stringify(publications)
    );
}

function publier() {
    const zone = document.getElementById("publicationTexte");
    const texte = zone.value.trim();

    if (texte === "") {
        alert("⚠️ Écrivez quelque chose avant de publier.");
        return;
    }

    const nouvellePublication = {
        id: Date.now(),
        texte: texte,
        likes: 0,
        commentaires: [],
        date: new Date().toLocaleString("fr-FR")
    };

    publications.unshift(nouvellePublication);
    sauvegarder();

    afficherPublications();

    zone.value = "";
}

function afficherPublications() {
    const liste = document.getElementById("listePublications");
    liste.innerHTML = "";

    publications.forEach(function(publication) {
        creerPublication(publication);
    });
}

function creerPublication(publication) {
    const element = document.createElement("div");
    element.className = "post";

    const contenu = document.createElement("p");
    contenu.textContent = publication.texte;

    const date = document.createElement("div");
    date.className = "date";
    date.textContent = "Publié le " + publication.date;

    const actions = document.createElement("div");
    actions.className = "actions";

    const boutonLike = document.createElement("button");
    boutonLike.className = "like-btn";
    boutonLike.innerHTML =
        "❤️ J'aime <span>" + publication.likes + "</span>";

    boutonLike.onclick = function() {
        publication.likes++;
        sauvegarder();
        afficherPublications();
    };

    const boutonCommentaire = document.createElement("button");
    boutonCommentaire.className = "comment-btn";
    boutonCommentaire.textContent = "💬 Commenter";

    const zoneCommentaire = document.createElement("div");
    zoneCommentaire.className = "comment-area";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Écrire un commentaire...";

    const envoyer = document.createElement("button");
    envoyer.textContent = "Envoyer";

    const commentaires = document.createElement("div");
    commentaires.className = "comments";

    publication.commentaires.forEach(function(commentaire) {
        ajouterCommentaire(commentaires, commentaire);
    });

    boutonCommentaire.onclick = function() {
        zoneCommentaire.classList.toggle("visible");
    };

    envoyer.onclick = function() {
        const texteCommentaire = input.value.trim();

        if (texteCommentaire === "") {
            return;
        }

        publication.commentaires.push(texteCommentaire);

        sauvegarder();
        afficherPublications();
    };

    const supprimer = document.createElement("button");
    supprimer.className = "delete-btn";
    supprimer.textContent = "🗑️ Supprimer";

    supprimer.onclick = function() {
        if (confirm("Voulez-vous supprimer cette publication ?")) {

            publications = publications.filter(function(item) {
                return item.id !== publication.id;
            });

            sauvegarder();
            afficherPublications();
        }
    };

    actions.appendChild(boutonLike);
    actions.appendChild(boutonCommentaire);
    actions.appendChild(supprimer);

    zoneCommentaire.appendChild(input);
    zoneCommentaire.appendChild(envoyer);
    zoneCommentaire.appendChild(commentaires);

    element.appendChild(contenu);
    element.appendChild(date);
    element.appendChild(actions);
    element.appendChild(zoneCommentaire);

    document.getElementById("listePublications")
        .appendChild(element);
}

function ajouterCommentaire(liste, texte) {
    const commentaire = document.createElement("div");
    commentaire.className = "comment";
    commentaire.textContent = "💬 " + texte;

    liste.appendChild(commentaire);
}

afficherPublications();
