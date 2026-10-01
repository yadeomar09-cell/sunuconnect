function publier() {
    const zone = document.getElementById("publicationTexte");
    const texte = zone.value.trim();

    if (texte === "") {
        alert("⚠️ Écrivez quelque chose avant de publier.");
        return;
    }

    creerPublication(texte);
    zone.value = "";
}

function creerPublication(texte, likes = 0, commentaires = []) {
    const publication = document.createElement("div");
    publication.className = "post";

    const contenu = document.createElement("p");
    contenu.textContent = texte;

    const date = document.createElement("div");
    date.className = "date";

    const maintenant = new Date();

    date.textContent =
        "Publié le " +
        maintenant.toLocaleDateString("fr-FR") +
        " à " +
        maintenant.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit"
        });

    const actions = document.createElement("div");
    actions.className = "actions";

    const boutonLike = document.createElement("button");
    boutonLike.className = "like-btn";
    boutonLike.innerHTML = "❤️ J'aime <span>" + likes + "</span>";

    boutonLike.onclick = function () {
        likes++;
        boutonLike.querySelector("span").textContent = likes;
    };

    const boutonCommentaire = document.createElement("button");
    boutonCommentaire.className = "comment-btn";
    boutonCommentaire.textContent = "💬 Commenter";

    const zoneCommentaire = document.createElement("div");
    zoneCommentaire.className = "comment-area";

    const inputCommentaire = document.createElement("input");
    inputCommentaire.type = "text";
    inputCommentaire.placeholder = "Écrire un commentaire...";

    const boutonEnvoyer = document.createElement("button");
    boutonEnvoyer.textContent = "Envoyer";

    const listeCommentaires = document.createElement("div");
    listeCommentaires.className = "comments";

    commentaires.forEach(function(commentaire) {
        ajouterCommentaire(listeCommentaires, commentaire);
    });

    boutonCommentaire.onclick = function () {
        zoneCommentaire.classList.toggle("visible");
    };

    boutonEnvoyer.onclick = function () {
        const commentaire = inputCommentaire.value.trim();

        if (commentaire === "") {
            return;
        }

        ajouterCommentaire(listeCommentaires, commentaire);
        inputCommentaire.value = "";
    };

    const boutonSupprimer = document.createElement("button");
    boutonSupprimer.className = "delete-btn";
    boutonSupprimer.textContent = "🗑️ Supprimer";

    boutonSupprimer.onclick = function () {
        if (confirm("Voulez-vous supprimer cette publication ?")) {
            publication.remove();
        }
    };

    actions.appendChild(boutonLike);
    actions.appendChild(boutonCommentaire);
    actions.appendChild(boutonSupprimer);

    zoneCommentaire.appendChild(inputCommentaire);
    zoneCommentaire.appendChild(boutonEnvoyer);
    zoneCommentaire.appendChild(listeCommentaires);

    publication.appendChild(contenu);
    publication.appendChild(date);
    publication.appendChild(actions);
    publication.appendChild(zoneCommentaire);

    document.getElementById("listePublications").prepend(publication);
}

function ajouterCommentaire(liste, texte) {
    const commentaire = document.createElement("div");
    commentaire.className = "comment";

    commentaire.textContent = "💬 " + texte;

    liste.appendChild(commentaire);
}
