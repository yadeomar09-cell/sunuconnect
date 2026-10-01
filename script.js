function publier() {
    const zone = document.getElementById("publicationTexte");
    const texte = zone.value.trim();

    if (texte === "") {
        alert("⚠️ Écrivez quelque chose avant de publier.");
        return;
    }

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

    publication.appendChild(contenu);
    publication.appendChild(date);

    document.getElementById("listePublications")
        .prepend(publication);

    zone.value = "";
}
