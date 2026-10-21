# Pic Saint-Loup · Carnet d'escapade

Mini-site statique, responsive et cartographique pour un séjour du samedi midi au lundi midi autour de Saint-Jean-de-Cuculles (Hérault). **URL cible :** https://nogues.app/pic-saint-loup/

## Contenu

- Samedi : Saint-Jean-de-Cuculles → Les Matelles → Saint-Martin-de-Londres → Notre-Dame-de-Londres → Ravin des Arcs (option) → dîner à Montpellier.
- Dimanche : randonnée depuis Cazevieille au Pic Saint-Loup (6 km, +364 m, ~2 h 30), puis vignobles et Hortus.
- Lundi : courte promenade au lac de Cécélès ; pas de visite de l'enceinte fermée du château de Montferrand.
- Carte Leaflet + OpenStreetMap : filtre par journée, repères numérotés, liaisons schématiques, liens vers itinéraires **routiers réels** sur Google Maps et pages officielles de randonnées. Le bouton routier du samedi couvre les villages (et le Ravin s'il est activé) ; le lien vers Montpellier est indépendant.
- Site sans suivi d'audience, sans compte ni base MySQL, balisé noindex/nofollow (meta + .htaccess).

## Arborescence

```
.github/workflows/deploy-ovh.yml      Publication SFTP isolée
www/pic-saint-loup/index.html        Page principale
www/pic-saint-loup/styles.css        Styles responsives clair/sombre
www/pic-saint-loup/app.js            Filtres et carte
www/pic-saint-loup/assets/partage.png Image Open Graph 1200×630
www/pic-saint-loup/.htaccess         Exclusion des moteurs et headers
README.md                            Mode d'emploi
```

## Déploiement respectant le processus nogues.app

1. Créer le **dépôt dédié** `nogseb/pic-saint-loup`, idéalement privé.
2. Déposer tous les fichiers ci-dessus sur une branche `feat/carnet-pic-saint-loup`, puis ouvrir une pull request vers `main`. Éviter toute fusion automatique.
3. Dans `Settings → Secrets and variables → Actions`, définir uniquement ces trois secrets :
   - `OVH_SFTP_HOST`
   - `OVH_SFTP_USER`
   - `OVH_SFTP_PASSWORD`
4. La fusion de la PR dans `main` déclenche `.github/workflows/deploy-ovh.yml` : transfert **uniquement** vers `www/pic-saint-loup/` sans option de suppression. Si un secret manque, le workflow affiche un avis et s'arrête avec succès **sans déployer**.
5. Vérifier que **Actions** est vert, puis ouvrir https://nogues.app/pic-saint-loup/ et contrôler le bandeau, le bas de page, les trois onglets, la carte, les liens et l'affichage mobile.

Aucun secret, nom de serveur ou identifiant n'est stocké dans le code. Le site n'exige ni PHP ni MySQL.

## Design system nogues.app

La page référence `/ds/v1/na.css` et `/ds/v1/na.js`, et les attributs `data-na-*`. Le bandeau et le pied de page communs **ne sont pas recréés** dans ce projet : ils sont injectés par le socle existant, lorsqu'il est disponible. Le projet reste lisible si ce socle n'est pas encore en ligne. Les composants utilisent des valeurs de repli CSS, et le thème s'adapte au réglage clair/sombre du système.

**À contrôler :** présence réelle du socle sur `https://nogues.app/ds/v1/` et du favicon `https://nogues.app/favicon.ico` ; le document de référence transmis décrit leur architecture mais ne confirme pas qu'ils sont publiés à ce jour.

## Carte et confidentialité

- Leaflet 1.9.4 est chargé depuis `unpkg.com`, cartes en tuiles depuis `tile.openstreetmap.org`. Une connexion Internet est nécessaire pour afficher la carte et certaines photographies.
- Liaisons pointillées sur la carte **indicatives**, pas tracés de marche ou itinéraires routiers. Pour naviguer, utiliser le bouton « Itinéraire routier » ou les liens des étapes ; pour randonner, les fiches officielles avec GPX.
- Aucune mesure d'audience. Les fournisseurs de cartes et d'images voient les demandes HTTP lors du chargement ; ils peuvent traiter l'adresse IP selon leurs politiques respectives.
- Les photographies utilisées sont sous licences Creative Commons, avec liens de crédit complets dans le bas du site. Le site ne revendique pas de propriété sur ces œuvres.

## Sources touristiques

- [Fiche PR Pic Saint-Loup](https://www.grandpicsaintloup-tourisme.fr/itineraires/le-pic-saint-loup-pr)
- [Fiche PR Ravin des Arcs](https://www.grandpicsaintloup-tourisme.fr/itineraires/le-ravin-des-arcs-pr)
- [Accès château Montferrand](https://chateaudemontferrand.fr/acces-chateau.html)

**Mis à jour :** 21 octobre 2026.