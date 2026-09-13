# Bot Discord — reste connecté en vocal 24h/24

## 1. Créer le bot Discord (si pas déjà fait)

1. Va sur https://discord.com/developers/applications
2. **New Application** → donne-lui un nom
3. Onglet **Bot** → **Add Bot**
4. Copie le **Token** (bouton "Reset Token" puis copier) → garde-le secret
5. Toujours dans l'onglet Bot, active **Server Members Intent** et **Voice States** si demandé
6. Onglet **OAuth2 > URL Generator** :
   - Scopes : `bot`
   - Permissions : `Connect`, `Speak`, `View Channels`
   - Copie l'URL générée en bas et ouvre-la dans ton navigateur pour inviter le bot sur ton serveur

## 2. Récupérer les IDs nécessaires

Active le **Mode développeur** dans Discord (Réglages > Avancés > Mode développeur), puis :
- Clic droit sur ton **serveur** → Copier l'ID → c'est ton `GUILD_ID`
- Clic droit sur le **salon vocal** cible → Copier l'ID → c'est ton `VOICE_CHANNEL_ID`

## 3. Configurer le bot

Ouvre `index.js` et remplace les 3 valeurs en haut du fichier (`TOKEN`, `GUILD_ID`, `VOICE_CHANNEL_ID`),
**ou** utilise des variables d'environnement (recommandé, voir étape 4).

## 4. Déploiement gratuit sur Railway

1. Crée un compte sur https://railway.app (gratuit avec un crédit mensuel offert)
2. Crée un compte GitHub si tu n'en as pas, mets ce dossier dans un dépôt GitHub
3. Sur Railway : **New Project** → **Deploy from GitHub repo** → sélectionne ton repo
4. Dans l'onglet **Variables** du projet Railway, ajoute :
   - `DISCORD_TOKEN` = ton token
   - `GUILD_ID` = l'ID de ton serveur
   - `VOICE_CHANNEL_ID` = l'ID du salon vocal
5. Railway installera automatiquement les dépendances (`npm install`) et lancera `npm start`
6. Regarde les **Logs** : tu dois voir "Connecté au salon vocal avec succès."

⚠️ Le plan gratuit de Railway offre un crédit limité par mois (pas illimité). Si le bot
tourne 24h/24 tout le mois, il se peut que le crédit s'épuise avant la fin du mois.
Vérifie les conditions actuelles sur https://railway.app/pricing.

## 5. Alternative 100% gratuite et illimitée : un vieux PC ou Raspberry Pi

Si tu veux une solution vraiment gratuite sans limite de temps :
1. Installe Node.js (https://nodejs.org) sur une machine que tu peux laisser allumée en permanence
2. Copie ce dossier dessus
3. `npm install`
4. Installe **pm2** pour que le bot redémarre automatiquement en cas de crash ou de redémarrage de la machine :
   ```
   npm install -g pm2
   pm2 start index.js --name voice-bot
   pm2 startup
   pm2 save
   ```

## Notes

- `selfDeaf` et `selfMute` sont à `false` par défaut (le bot peut entendre/parler).
  Mets-les à `true` dans `index.js` si tu veux juste qu'il "occupe" le salon sans audio.
- Le bot se reconnecte automatiquement s'il est déconnecté (coupure réseau, redémarrage Discord, etc.).
