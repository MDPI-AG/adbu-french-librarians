# ADBU French librarians — lettre d’information MDPI

Site statique en français (Netlify) pour :

1. **Inscription** à une lettre d’information ponctuelle destinée aux bibliothécaires universitaires en France (`index.html`)
2. **Présentation** de MDPI dans l’écosystème science ouverte / scientométrie (`science-ouverte.html`)

Les inscriptions (civilité, prénom, nom, e-mail) sont enregistrées dans la [feuille Google Sheets](https://docs.google.com/spreadsheets/d/1m3S7B5XcnWAf1c7_fVGhpcxqvXTmMK2806ne0CN98pA/edit?usp=sharing) via une fonction Netlify et un Google Apps Script.

## Structure

```
index.html
science-ouverte.html
styles.css
assets/logos/          # logos MDPI
assets/icons/          # icônes MDPI
netlify/functions/signup.js
scripts/google-apps-script/Code.gs
netlify.toml
```

## Déploiement Netlify

1. Connecter ce dépôt à Netlify (publish directory = racine du dépôt).
2. Configurer les variables d’environnement :
   - `GOOGLE_SCRIPT_URL` — URL du déploiement Web App Google Apps Script
   - `SIGNUP_SECRET` — secret partagé avec le script Google
3. Déployer. Tant que ces variables manquent, le formulaire renvoie une erreur claire en français.

## Configuration Google Apps Script (une fois)

1. Ouvrir la [feuille d’inscription](https://docs.google.com/spreadsheets/d/1m3S7B5XcnWAf1c7_fVGhpcxqvXTmMK2806ne0CN98pA/edit?usp=sharing).
2. **Extensions → Apps Script**.
3. Remplacer le contenu par [`scripts/google-apps-script/Code.gs`](scripts/google-apps-script/Code.gs).
4. **Paramètres du projet → Propriétés du script** : ajouter `SIGNUP_SECRET` (même valeur que sur Netlify).
5. **Déployer → Nouveau déploiement → Application Web** :
   - Exécuter en tant que : **Moi**
   - Qui peut y accéder : **Tout le monde**
6. Copier l’URL de l’application web dans `GOOGLE_SCRIPT_URL` sur Netlify.
7. Redeployer le site Netlify.

Les colonnes de la feuille doivent rester : `Title | Firstname | Lastname | Email`.

## Aperçu local

Servir la racine avec n’importe quel serveur statique, par exemple :

```bash
npx --yes serve .
```

La fonction d’inscription (`/.netlify/functions/signup`) nécessite `netlify dev` (ou un déploiement Netlify) et les variables d’environnement ci-dessus pour écrire dans la feuille.

## Design

Identité visuelle MDPI (bleu `#0d58c9`, tagline *Advancing Open Science*, logos et icônes issus du design system MDPI). Typographie : Suisse Int'l avec repli Helvetica/Arial.
