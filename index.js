const { Client, GatewayIntentBits } = require('discord.js');
const {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
} = require('@discordjs/voice');

// ==== CONFIGURATION ====
// Remplis ces 3 valeurs (ou utilise des variables d'environnement, voir README)
const TOKEN = process.env.DISCORD_TOKEN || '';
const GUILD_ID = process.env.GUILD_ID || '1548293850840170619';
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID || '1548293853767798801';
// =======================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

let connection = null;

function connectToVoice() {
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error('Serveur introuvable. Vérifie GUILD_ID.');
    return;
  }

  const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);
  if (!channel) {
    console.error('Salon vocal introuvable. Vérifie VOICE_CHANNEL_ID.');
    return;
  }

  connection = joinVoiceChannel({
    channelId: VOICE_CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false, // mets true si tu veux que le bot n'entende rien
    selfMute: false, // mets true si tu ne veux pas qu'il transmette de l'audio
  });

  connection.on(VoiceConnectionStatus.Disconnected, async () => {
    console.log('Déconnecté, tentative de reconnexion...');
    try {
      await Promise.race([
        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
      // La reconnexion est en cours, ne rien faire de plus
    } catch (error) {
      // Vraie déconnexion : on détruit et on retente depuis zéro
      connection.destroy();
      setTimeout(connectToVoice, 5_000);
    }
  });

  connection.on(VoiceConnectionStatus.Ready, () => {
    console.log('Connecté au salon vocal avec succès.');
  });

  connection.on('error', (error) => {
    console.error('Erreur de connexion vocale:', error);
  });
}

client.once('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
  connectToVoice();
});

// Sécurité : si le process crash, on le relance proprement (utile avec pm2/Railway)
process.on('unhandledRejection', (error) => {
  console.error('Erreur non gérée:', error);
});

client.login(TOKEN);
