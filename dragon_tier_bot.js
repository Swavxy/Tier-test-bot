const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Initialize bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Channel IDs
const TEST_CHANNEL_ID = '1490920531858554940'; // Channel to pick users from
const RESULTS_CHANNEL_ID = '1490920531858554940'; // Channel to post results

// MC Tier Rankings (HT4 highest, LT5 lowest - only HT and LT tiers)
const TIER_RANKS = [
  { tier: 'HT4', display: '🔴 HT4', color: '#FF0000' },
  { tier: 'HT3', display: '🟠 HT3', color: '#FF6600' },
  { tier: 'LT1', display: '🟡 LT1', color: '#FFCC00' },
  { tier: 'LT2', display: '🟢 LT2', color: '#00CC00' },
  { tier: 'LT3', display: '🔵 LT3', color: '#0066FF' },
  { tier: 'LT4', display: '🟣 LT4', color: '#9900FF' },
  { tier: 'LT5', display: '⚪ LT5', color: '#CCCCCC' }
];

// Initialize data structure
function initializeData() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(PLAYERS_FILE)) {
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify({ players: {} }, null, 2));
  }

  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({
      guildId: null,
      testingChannelId: null,
      verifiedRoleId: null,
      announcementChannelId: null
    }, null, 2));
  }
}

function loadPlayers() {
  if (fs.existsSync(PLAYERS_FILE)) {
    return JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8')).players;
  }
  return {};
}

function savePlayers(players) {
  fs.writeFileSync(PLAYERS_FILE, JSON.stringify({ players }, null, 2));
}

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  }
  return {};
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// Event: Bot Ready
client.on('ready', () => {
  console.log(`✅ Dragon Tier Bot logged in as ${client.user.tag}`);
  client.user.setActivity('Dragon Tier PvP Testing', { type: 'WATCHING' });
  initializeData();

  // Start auto-test every 5 minutes
  setInterval(autoRunRandomTest, 5 * 60 * 1000);
  console.log('⚡ Auto-test scheduler started (runs every 5 minutes)');
});

// Auto-Test Function - Runs automatically
async function autoRunRandomTest() {
  try {
    const channel = await client.channels.fetch(RESULTS_CHANNEL_ID);
    
    if (!channel.isTextBased()) {
      console.error('Results channel is not a text channel');
      return;
    }

    // Fetch messages to get unique users
    let lastId = undefined;
    const userIds = new Set();

    // Fetch messages in batches
    for (let i = 0; i < 10; i++) {
      const fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });
      if (fetchedMessages.size === 0) break;
      
      fetchedMessages.forEach(msg => {
        if (!msg.author.bot) {
          userIds.add(msg.author.id);
        }
      });
      
      lastId = fetchedMessages.last()?.id;
    }

    if (userIds.size === 0) {
      console.log('No users found in channel for auto-test');
      return;
    }

    const randomUserId = Array.from(userIds)[Math.floor(Math.random() * userIds.size)];
    const randomUser = await client.users.fetch(randomUserId);
    const players = loadPlayers();

    // Generate random test results
    const testResults = {
      combatSkill: Math.floor(Math.random() * 100) + 1,
      accuracy: Math.floor(Math.random() * 100) + 1,
      positioning: Math.floor(Math.random() * 100) + 1,
      timing: Math.floor(Math.random() * 100) + 1,
      consistency: Math.floor(Math.random() * 100) + 1
    };

    // Add player if not already registered
    if (!players[randomUser.id]) {
      players[randomUser.id] = {
        discordId: randomUser.id,
        discordTag: randomUser.tag,
        minecraftIGN: randomUser.username,
        rank: 'Unranked',
        testCount: 0,
        wins: 0,
        losses: 0,
        dateAdded: new Date().toISOString(),
        verified: true
      };
      savePlayers(players);
    }

    const player = players[randomUser.id];

    // Auto-assign random tier
    const randomIndex = Math.floor(Math.random() * TIER_RANKS.length);
    const tierData = TIER_RANKS[randomIndex];

    const oldRank = players[randomUser.id].rank;
    players[randomUser.id].rank = tierData.tier;
    players[randomUser.id].testCount += 1;
    players[randomUser.id].lastTested = new Date().toISOString();

    savePlayers(players);

    // Generate spaced-out test times
    const now = new Date();
    const testTimes = [];
    for (let i = 0; i < players[randomUser.id].testCount; i++) {
      const testTime = new Date(now.getTime() - (i * 30 * 60 * 1000)); // 30 minutes apart
      testTimes.push(testTime.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
    }

    const TESTER_ROLE_ID = '1489673758082990350';

    const embed = new EmbedBuilder()
      .setColor(tierData.color)
      .setTitle(`✅ Tested User`)
      .setThumbnail(`https://craftheads.net/render/avatar/${player.minecraftIGN}`)
      .addFields(
        { name: 'Tester', value: `<@${randomUser.id}>`, inline: false },
        { name: 'Region', value: 'Tier Assignment', inline: false },
        { name: 'Gamemode', value: 'PvP Testing', inline: false },
        { name: '⚔️ Combat Skill', value: `${testResults.combatSkill}%`, inline: true },
        { name: '🎯 Accuracy', value: `${testResults.accuracy}%`, inline: true },
        { name: '📍 Positioning', value: `${testResults.positioning}%`, inline: true },
        { name: '⏱️ Timing', value: `${testResults.timing}%`, inline: true },
        { name: '🔁 Consistency', value: `${testResults.consistency}%`, inline: true },
        { name: 'Previous Tier', value: oldRank, inline: true },
        { name: 'New Tier', value: tierData.display, inline: true },
        { name: 'Test Times', value: testTimes.join('\n'), inline: false },
        { name: 'Tested By', value: `<@&${TESTER_ROLE_ID}>`, inline: false }
      )
      .setFooter({ text: '⚡ Dragon Tier Testing - Auto Generated' })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    console.log(`✅ Auto-test completed for ${randomUser.tag} - Assigned: ${tierData.tier}`);

  } catch (error) {
    console.error('Error in auto-test:', error);
  }
}

// Event: Interaction Create
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === 'setup') {
      await handleSetup(interaction);
    } else if (interaction.commandName === 'addplayer') {
      await handleAddPlayer(interaction);
    } else if (interaction.commandName === 'randomtest') {
      await handleRandomTest(interaction);
    } else if (interaction.commandName === 'assignrank') {
      await handleAssignRank(interaction);
    } else if (interaction.commandName === 'playerinfo') {
      await handlePlayerInfo(interaction);
    } else if (interaction.commandName === 'leaderboard') {
      await handleLeaderboard(interaction);
    } else if (interaction.commandName === 'resetplayer') {
      await handleResetPlayer(interaction);
    }
  } catch (error) {
    console.error('Command error:', error);
    await interaction.reply({
      content: '❌ An error occurred while processing your command.',
      ephemeral: true
    }).catch(() => {});
  }
});

// Command: Setup
async function handleSetup(interaction) {
  const config = loadConfig();
  config.guildId = interaction.guildId;
  config.testingChannelId = interaction.channelId;
  config.verifiedRoleId = interaction.options.getRole('verified_role')?.id || null;
  config.announcementChannelId = interaction.options.getChannel('announcement_channel')?.id || null;

  saveConfig(config);

  const embed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('✅ Dragon Tier Setup Complete')
    .addFields(
      { name: 'Guild ID', value: config.guildId || 'Not set' },
      { name: 'Testing Channel', value: `<#${config.testingChannelId}>` },
      { name: 'Verified Role', value: config.verifiedRoleId ? `<@&${config.verifiedRoleId}>` : 'Not set' },
      { name: 'Announcement Channel', value: config.announcementChannelId ? `<#${config.announcementChannelId}>` : 'Not set' }
    );

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

// Command: Add Player (Manual registration - optional)
async function handleAddPlayer(interaction) {
  const user = interaction.options.getUser('player');
  const ign = interaction.options.getString('minecraft_ign');

  const players = loadPlayers();

  if (players[user.id]) {
    return await interaction.reply({
      content: '❌ This player is already registered.',
      ephemeral: true
    });
  }

  players[user.id] = {
    discordId: user.id,
    discordTag: user.tag,
    minecraftIGN: ign,
    rank: 'Unranked',
    testCount: 0,
    wins: 0,
    losses: 0,
    dateAdded: new Date().toISOString(),
    verified: true
  };

  savePlayers(players);

  const embed = new EmbedBuilder()
    .setColor('#0099FF')
    .setTitle('✅ Player Registered')
    .addFields(
      { name: 'Discord', value: user.tag },
      { name: 'Minecraft IGN', value: ign },
      { name: 'Status', value: 'Registered - Ready for tier assignment' }
    );

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

// Command: Random Test - Pick random user from specific channel with test results
async function handleRandomTest(interaction) {
  await interaction.deferReply();

  try {
    const config = loadConfig();
    const guild = await client.guilds.fetch(interaction.guildId);
    
    if (!guild) {
      return await interaction.editReply('❌ Guild not found.');
    }

    // Fetch all members (with caching)
    await guild.members.fetch();
    
    let verifiedMembers = [];
    
    // If verified role is configured, filter by role
    if (config.verifiedRoleId) {
      const role = guild.roles.cache.get(config.verifiedRoleId);
      if (role) {
        verifiedMembers = guild.members.cache.filter(member => 
          member.roles.has(config.verifiedRoleId) && !member.user.bot
        ).map(member => member.user);
      }
    }
    
    // Fallback: fetch from channel messages if no verified role set
    if (verifiedMembers.length === 0) {
      const channel = await client.channels.fetch(TEST_CHANNEL_ID);
      
      if (!channel.isTextBased()) {
        return await interaction.editReply('❌ Channel is not a text channel.');
      }

      const userIds = new Set();
      let lastId = undefined;

      // Fetch messages in batches
      for (let i = 0; i < 10; i++) {
        const fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });
        if (fetchedMessages.size === 0) break;
        
        fetchedMessages.forEach(msg => {
          if (!msg.author.bot) {
            userIds.add(msg.author.id);
          }
        });
        
        lastId = fetchedMessages.last()?.id;
      }

      if (userIds.size === 0) {
        return await interaction.editReply('❌ No verified users found. Make sure to set the verified role with /setup or add users to the test channel.');
      }

      const randomUserId = Array.from(userIds)[Math.floor(Math.random() * userIds.size)];
      verifiedMembers = [await client.users.fetch(randomUserId)];
    }

    if (verifiedMembers.length === 0) {
      return await interaction.editReply('❌ No verified users found.');
    }

    const randomUser = verifiedMembers[Math.floor(Math.random() * verifiedMembers.length)];
    const players = loadPlayers();

    // Generate random test results
    const testResults = {
      combatSkill: Math.floor(Math.random() * 100) + 1,
      accuracy: Math.floor(Math.random() * 100) + 1,
      positioning: Math.floor(Math.random() * 100) + 1,
      timing: Math.floor(Math.random() * 100) + 1,
      consistency: Math.floor(Math.random() * 100) + 1
    };

    // Add player if not already registered
    if (!players[randomUser.id]) {
      players[randomUser.id] = {
        discordId: randomUser.id,
        discordTag: randomUser.tag,
        minecraftIGN: randomUser.username,
        rank: 'Unranked',
        testCount: 0,
        wins: 0,
        losses: 0,
        dateAdded: new Date().toISOString(),
        verified: true
      };
      savePlayers(players);
    }

    const player = players[randomUser.id];

    const embed = new EmbedBuilder()
      .setColor('#FF00FF')
      .setTitle('🎯 Random Player Selected - Test Results')
      .setThumbnail(`https://craftheads.net/render/avatar/${player.minecraftIGN}`)
      .addFields(
        { name: 'Player Selected', value: `<@${randomUser.id}>`, inline: false },
        { name: 'Current Rank', value: player.rank, inline: true },
        { name: 'Tests Completed', value: `${player.testCount}`, inline: true },
        { name: '━━━━━━━━━━━━', value: 'Test Results', inline: false },
        { name: '⚔️ Combat Skill', value: `${testResults.combatSkill}%`, inline: true },
        { name: '🎯 Accuracy', value: `${testResults.accuracy}%`, inline: true },
        { name: '📍 Positioning', value: `${testResults.positioning}%`, inline: true },
        { name: '⏱️ Timing', value: `${testResults.timing}%`, inline: true },
        { name: '🔁 Consistency', value: `${testResults.consistency}%`, inline: true },
        { name: '━━━━━━━━━━━━', value: '\u200b', inline: false }
      )
      .setFooter({ text: 'Use /assignrank to assign a tier based on results' });

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`assign_${randomUser.id}`)
          .setLabel('Assign Tier')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('randomtest_again')
          .setLabel('Pick Another')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.editReply({ embeds: [embed], components: [buttons] });
  } catch (error) {
    console.error('Error in randomtest:', error);
    await interaction.editReply('❌ Error fetching verified members. Make sure the bot has permissions and the verified role is set correctly.');
  }
}

// Command: Auto-Assign Random Tier (No HT1/HT2)
async function handleAssignRank(interaction) {
  const targetUser = interaction.options.getUser('player');

  const players = loadPlayers();

  if (!players[targetUser.id]) {
    return await interaction.reply({
      content: '❌ This player is not registered.',
      ephemeral: true
    });
  }

  // Auto-assign random tier (HT4 to LT5, excluding HT1 & HT2)
  const randomIndex = Math.floor(Math.random() * TIER_RANKS.length);
  const tierData = TIER_RANKS[randomIndex];

  const oldRank = players[targetUser.id].rank;
  players[targetUser.id].rank = tierData.tier;
  players[targetUser.id].testCount += 1;
  players[targetUser.id].lastTested = new Date().toISOString();

  savePlayers(players);

  const TESTER_ROLE_ID = '1489673758082990350';

  // Generate spaced-out test times (every 30 minutes going back from now)
  const now = new Date();
  const testTimes = [];
  for (let i = 0; i < players[targetUser.id].testCount; i++) {
    const testTime = new Date(now.getTime() - (i * 30 * 60 * 1000)); // 30 minutes apart
    testTimes.push(testTime.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
  }

  const embed = new EmbedBuilder()
    .setColor(tierData.color)
    .setTitle(`✅ Tested User`)
    .setThumbnail(`https://craftheads.net/render/avatar/${players[targetUser.id].minecraftIGN}`)
    .addFields(
      { name: 'Tester', value: `<@${targetUser.id}>`, inline: false },
      { name: 'Region', value: 'Tier Assignment', inline: false },
      { name: 'Gamemode', value: 'PvP Testing', inline: false },
      { name: 'Previous Tier', value: oldRank, inline: true },
      { name: 'New Tier', value: tierData.display, inline: true },
      { name: 'Test Times', value: testTimes.join('\n'), inline: false },
      { name: 'Tested By', value: `<@&${TESTER_ROLE_ID}>`, inline: false }
    )
    .setFooter({ text: '⚡ Dragon Tier Testing' })
    .setTimestamp();

  // Send announcement
  const config = loadConfig();
  if (config.announcementChannelId) {
    const channel = await client.channels.fetch(config.announcementChannelId).catch(() => null);
    if (channel) {
      await channel.send({ embeds: [embed] }).catch(() => {});
    }
  }

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

// Command: Player Info
async function handlePlayerInfo(interaction) {
  const targetUser = interaction.options.getUser('player');

  const players = loadPlayers();

  if (!players[targetUser.id]) {
    return await interaction.reply({
      content: '❌ This player is not registered.',
      ephemeral: true
    });
  }

  const player = players[targetUser.id];
  const tierData = TIER_RANKS.find(t => t.tier === player.rank) || TIER_RANKS[TIER_RANKS.length - 1];

  const embed = new EmbedBuilder()
    .setColor(tierData.color)
    .setTitle(`${targetUser.username}'s Player Profile`)
    .setThumbnail(`https://craftheads.net/render/avatar/${player.minecraftIGN}`)
    .addFields(
      { name: 'Minecraft IGN', value: player.minecraftIGN },
      { name: 'Current Rank', value: tierData.display },
      { name: 'Tests Completed', value: `${player.testCount}` },
      { name: 'Wins', value: `${player.wins}`, inline: true },
      { name: 'Losses', value: `${player.losses}`, inline: true },
      { name: 'W/L Ratio', value: player.losses > 0 ? (player.wins / player.losses).toFixed(2) : 'N/A', inline: true },
      { name: 'Registered', value: new Date(player.dateAdded).toLocaleDateString() }
    );

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

// Command: Leaderboard
async function handleLeaderboard(interaction) {
  await interaction.deferReply();

  const players = loadPlayers();
  const playerList = Object.values(players)
    .sort((a, b) => {
      const tierOrder = { 'HT1': 0, 'HT2': 1, 'HT3': 2, 'MT1': 3, 'MT2': 4, 'MT3': 5, 'LT1': 6, 'LT2': 7, 'LT3': 8, 'Unranked': 9 };
      return (tierOrder[a.rank] || 9) - (tierOrder[b.rank] || 9);
    });

  if (playerList.length === 0) {
    return await interaction.editReply('📋 No players registered yet.');
  }

  const embed = new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('🏆 Dragon Tier Leaderboard')
    .setDescription(playerList.slice(0, 25).map((p, i) => {
      const tierData = TIER_RANKS.find(t => t.tier === p.rank) || { display: '⚫ Unranked' };
      const ratio = p.losses > 0 ? (p.wins / p.losses).toFixed(2) : 'N/A';
      return `**${i + 1}.** ${p.minecraftIGN} | ${tierData.display} | W/L: ${p.wins}/${p.losses} (${ratio})`;
    }).join('\n'))
    .setFooter({ text: `Total Players: ${playerList.length}` });

  await interaction.editReply({ embeds: [embed] });
}

// Command: Reset Player
async function handleResetPlayer(interaction) {
  const targetUser = interaction.options.getUser('player');

  const players = loadPlayers();

  if (!players[targetUser.id]) {
    return await interaction.reply({
      content: '❌ This player is not registered.',
      ephemeral: true
    });
  }

  const player = players[targetUser.id];
  delete players[targetUser.id];
  savePlayers(players);

  const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('❌ Player Reset')
    .addFields(
      { name: 'Player', value: player.minecraftIGN },
      { name: 'Previous Rank', value: player.rank }
    );

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

// Register Commands
async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('setup')
      .setDescription('Setup Dragon Tier bot configuration')
      .addRoleOption(option => option.setName('verified_role').setDescription('Role for verified players').setRequired(false))
      .addChannelOption(option => option.setName('announcement_channel').setDescription('Channel for rank announcements').setRequired(false)),

    new SlashCommandBuilder()
      .setName('addplayer')
      .setDescription('Manually add a player (optional - randomtest auto-adds from role)')
      .addUserOption(option => option.setName('player').setDescription('Discord user to add').setRequired(true))
      .addStringOption(option => option.setName('minecraft_ign').setDescription('Player\'s Minecraft IGN').setRequired(true)),

    new SlashCommandBuilder()
      .setName('randomtest')
      .setDescription('Pick a random verified player for testing'),

    new SlashCommandBuilder()
      .setName('assignrank')
      .setDescription('Auto-assign random tier to a player (no manual selection)')
      .addUserOption(option => option.setName('player').setDescription('Player to auto-rank').setRequired(true)),

    new SlashCommandBuilder()
      .setName('playerinfo')
      .setDescription('View detailed player information')
      .addUserOption(option => option.setName('player').setDescription('Player to lookup').setRequired(true)),

    new SlashCommandBuilder()
      .setName('leaderboard')
      .setDescription('View the Dragon Tier leaderboard'),

    new SlashCommandBuilder()
      .setName('resetplayer')
      .setDescription('Remove a player from the system (admin only)')
      .addUserOption(option => option.setName('player').setDescription('Player to remove').setRequired(true))
  ];

  try {
    await client.application.commands.set(commands);
    console.log('✅ Commands registered successfully');
  } catch (error) {
    console.error('❌ Failed to register commands:', error);
  }
}

// Login
client.once('ready', registerCommands);
client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = client;
