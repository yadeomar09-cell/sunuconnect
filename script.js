const SUPABASE_URL = "https://xrzlhejjygofuzsngidr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_VNTlGwxLW67omjMlx9kzYA_zQCDFmYx";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ===============================
// AFFICHER L'INSCRIPTION
// ===============================

function afficherInscription() {
    document.getElementById("connexion").style.display = "none";
    document.getElementById("inscription").style.display = "block";
}


// ===============================
// AFFICHER LA CONNEXION
// ===============================

function afficherConnexion() {
    document.getElementById("inscription").style.display = "none";
    document.getElementById("connexion").style.display = "block";
}


// ===============================
// INSCRIPTION
// ===============================

async function sInscrire() {

    const nom = document.getElementById("nomInscription").value.trim();
    const email = document.getElementById("emailInscription").value.trim();
    const password = document.getElementById("passwordInscription").value;

    if (!nom || !email || !password) {
        alert("⚠️ Remplissez tous les champs.");
        return;
    }

    if (password.length < 6) {
        alert("⚠️ Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        alert("❌ Erreur : " + error.message);
        return;
    }

    if (!data.user) {
        alert("❌ Le compte n'a pas pu être créé.");
        return;
    }

    alert(
        "✅ Compte créé avec succès !\n\n" +
        "Si Supabase demande une confirmation par e-mail, vérifiez votre boîte mail."
    );

    afficherConnexion();
}


// ===============================
// CONNEXION
// ===============================

async function seConnecter() {

    const email = document.getElementById("emailConnexion").value.trim();
    const password = document.getElementById("passwordConnexion").value;

    if (!email || !password) {
        alert("⚠️ Entrez votre adresse e-mail et votre mot de passe.");
        return;
    }

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        alert("❌ Connexion impossible : " + error.message);
        return;
    }

    if (data.user) {
        await afficherEspaceMembre(data.user);
    }
}


// ===============================
// AFFICHER L'ESPACE MEMBRE
// ===============================

async function afficherEspaceMembre(user) {

    document.getElementById("connexion").style.display = "none";
    document.getElementById("inscription").style.display = "none";
    document.getElementById("espaceMembre").style.display = "block";

    const nomElement = document.getElementById("nomUtilisateur");

    nomElement.textContent = user.email;

    await chargerPublications();
}


// ===============================
// DÉCONNEXION
// ===============================

async function seDeconnecter() {

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        alert("❌ Erreur lors de la déconnexion.");
        return;
    }

    document.getElementById("espaceMembre").style.display = "none";
    document.getElementById("connexion").style.display = "block";

    alert("👋 Vous êtes déconnecté.");
}


// ===============================
// VÉRIFIER LA SESSION
// ===============================

async function verifierConnexion() {

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        console.error(error);
        return;
    }

    if (data.session && data.session.user) {
        await afficherEspaceMembre(data.session.user);
    }
}


// ===============================
// PUBLICATIONS
// ===============================

async function publier() {

    const zone = document.getElementById("publicationTexte");
    const texte = zone.value.trim();

    if (!texte) {
        alert("⚠️ Écrivez quelque chose avant de publier.");
        return;
    }

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {
        alert("⚠️ Connectez-vous d'abord.");
        return;
    }

    const { error } = await supabaseClient
        .from("posts")
        .insert({
            user_id: user.id,
            content: texte
        });

    if (error) {
        alert("❌ Erreur lors de la publication : " + error.message);
        console.error(error);
        return;
    }

    zone.value = "";

    await chargerPublications();
}


// ===============================
// CHARGER LES PUBLICATIONS
// ===============================

async function chargerPublications() {

    const liste = document.getElementById("listePublications");

    const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Erreur publications :", error);
        return;
    }

    liste.innerHTML = "";

    data.forEach(function(post) {

        const element = document.createElement("div");
        element.className = "post";

        const contenu = document.createElement("p");
        contenu.textContent = post.content;

        const date = document.createElement("div");
        date.className = "date";

        date.textContent =
            "Publié le " +
            new Date(post.created_at).toLocaleString("fr-FR");

        element.appendChild(contenu);
        element.appendChild(date);

        liste.appendChild(element);
    });
}


// ===============================
// LANCEMENT
// ===============================

verifierConnexion();
