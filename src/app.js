import path from "path"
import { Client, GatewayIntentBits, REST, Routes, Collection, } from "discord.js"
import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, VoiceConnectionStatus } from "@discordjs/voice"
import commands from "./utils/commands.js"
import constants from "./utils/constants.js"

const rest = new REST({ version: 10 }).setToken(constants.DISCORD_USER_TOKEN)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ]
})
const audioPlayer = createAudioPlayer({
  behaviors: NoSubscriberBehavior.Pause
})

await client.login(constants.DISCORD_USER_TOKEN)
const channel = await client.channels.fetch(constants.DISCORD_CHANNEL_ID)

const connection = joinVoiceChannel({
  channelId: channel.id,
  guildId: channel.guild.id,
  adapterCreator: channel.guild.voiceAdapterCreator
})

audioPlayer.on("error", error => {
	console.error("Error:", error.message, "with track", error.resource.metadata.title);
})

connection.on(VoiceConnectionStatus.Ready, () => {
	console.log('The connection has entered the Ready state - ready to play audio!');
});

client.on("ready", async () => {
  console.log(`${client.user.tag} has logged in!`)
})

client.on("interactionCreate", async interaction => {
  //TODO: Refactor if's
  if (interaction.isCommand()) {
    if (interaction.commandName == "create") {
      console.log("ta aqui")

      const key = interaction.options.get("key").value
      const value = interaction.options.get("value").value
      const description = `Command created by ${interaction.user.username}`

      interaction.reply(`Command ${key} created!`)
      await rest.post(Routes.applicationGuildCommand(constants.DISCORD_CLIENT_ID, constants.DISCORD_SERVER_ID, 1248341943268937762), { body: { name: key, description, value } })

      client.slashCommands.set(key, value)
    } else if (interaction.commandName == "stop") {
      connection.disconnect()
      interaction.reply("stopped")
    } else if (interaction.commandName == "play") {
      try {
        joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator
        })
        const resource = createAudioResource(path.join("src/misc/buzzimbro.mp3"))
        audioPlayer.play(resource)
        connection.subscribe(audioPlayer)
        interaction.reply("Playing!")
      } catch (err) {
        console.log(err)
        interaction.reply("Something went wrong")
      }
    }
  } else {
    const command = client.slashCommands.get(interaction.commandName)

    interaction.reply(command)
  }
})

client.slashCommands = new Collection()

try {
  console.log("Registering commands!")

  await rest.put(Routes.applicationGuildCommands(constants.DISCORD_CLIENT_ID, constants.DISCORD_SERVER_ID), { body: commands })

  commands.forEach(async command => {
    await client.slashCommands.set(command.name, command.value ? command.value : undefined)
  })

  console.log("slash commands:", client.slashCommands)

  console.log("Everything registered!")
} catch (err) {
  console.log("Something went wrong trying to register commands:", err)
}