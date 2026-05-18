# CLAUDE.md

# Projet 
Ce projet a pour but de faciliter l'accès aux ressoruces islamique, de manières vérifiées, sur la base de la sunnah et la compréhension des pieux prédécesseurs.

## Architecture

* `css/` & `js/` : Fichiers sources pour l'interface utilisateur et la logique frontend.
* `data/` : Contient les données brutes ou semi-traitées (JSON, CSV, etc.).
* `fatawa_ibnbaz/`, `sahih_bukhari/`, `tafsir_ibn_kathir/` : Dossiers de stockage des bases de données textuelles ou chapitres extraits.
* `animated-hero-app/` : Composant ou sous-application pour l'animation de la page d'accueil.
* `index.html` : Point d'entrée principal de l'application web.
* `extract_epub.py` : Script Python pour parser et extraire le contenu des fichiers EPUB (`Les Hist...thir.epub`, `Péchés...yyim.epub`).
* `serve.py` : Serveur local léger (probablement Python `http.server`) pour tester l'application web sans soucis de CORS.

## Commandes utiles

### Backend / Extraction (Python)
* **Extraire les fichiers EPUB :** `python extract_epub.py`
* **Lancer le serveur de développement local :** `python serve.py`
* **Validation Syntaxe Python :** `python -m py_compile extract_epub.py serve.py`
* **Formater le code Python :** `black .` (si installé, sinon ignorer)

### Frontend (Accès local alternative)
* Ouvrir `index.html` directement dans le navigateur ou via l'extension Live Server

## Garde-fous & Workflow Strict (Anti-Erreurs)

* **Zéro régression de texte :** 
## Garde-fous & Workflow Strict (Anti-Erreurs)

* **Zéro régression de texte :** 
Forcer `utf-8` et `ensure_ascii=False` sur chaque script Python. → Empêche la corruption des caractères arabes et des accents.
* **Gestion de la RAM :** Parser l'EPUB de 370 Mo par flux/morceaux (chunks). → Empêche Claude de saturer la mémoire et de faire crash le script.
* **Performance Frontend :** Ne jamais fetch un JSON global au chargement. Segmenter par chapitre. → Empêche Claude de créer une UI qui freeze.
* **Changements minimaux :** Ne pas refactoriser le code non lié. → Empêche la réécriture complète et non demandée de fichiers entiers.
* **Export statique uniquement :** Pas de Node.js, pas de SSR. HTML/CSS/JS pur. → Empêche Claude d'ajouter du code serveur inutile.
* **Pas de code à trous :** Fournir des blocs de code complets sans commentaires d'omission (`# ...`). → Évite les erreurs de copier-coller.
* **Incertitude :** Si deux approches techniques s'affrontent, les présenter avant de coder. → M'interdire de choisir l'architecture à ta place.