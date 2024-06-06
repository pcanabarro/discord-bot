import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, Collection } from "discord.js"
import commands from "./utils/commands.js"
import constants from "./utils/constants.js"

const rest = new REST({ version: 10 }).setToken(constants.DISCORD_USER_TOKEN)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
})


client.on('ready', () => {console.log(`${client.user.tag} has logged in!`)})

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    const command = client.slashCommands.get(interaction.commandName)

    interaction.reply(command)
  }
})

client.slashCommands = new Collection();
await client.login(constants.DISCORD_USER_TOKEN)

try {
  console.log("Registering commands!")

  await rest.put(Routes.applicationGuildCommands(constants.DISCORD_CLIENT_ID, constants.DISCORD_SERVER_ID), { body: commands })

  commands.forEach(async command => {
    await client.slashCommands.set(command.name, command.value)
  })

  console.log("slash commands:", client.slashCommands)

  console.log("Everything registered!")
} catch (err) {
  console.log(err)
}