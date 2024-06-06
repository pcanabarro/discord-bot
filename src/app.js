import { Client, GatewayIntentBits, REST, Routes, Collection } from "discord.js"
import commands from "./utils/commands.js"
import constants from "./utils/constants.js"

const rest = new REST({ version: 10 }).setToken(constants.DISCORD_USER_TOKEN)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
})
await client.login(constants.DISCORD_USER_TOKEN)

client.on('ready', () => { console.log(`${client.user.tag} has logged in!`) })

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    if (interaction.commandName == "create") {
      console.log("ta aqui")

      const key = interaction.options.get("key").value
      const value = interaction.options.get("value").value
      const description = `Command created by ${interaction.user.username}`

      interaction.reply(`Command ${key} created!`)
      await rest.post(Routes.applicationGuildCommand(constants.DISCORD_CLIENT_ID, constants.DISCORD_SERVER_ID, 1248341943268937762), { body: { name: key, description, value } })
      console.log(await rest.get(Routes.applicationGuildCommands(constants.DISCORD_CLIENT_ID, constants.DISCORD_SERVER_ID)))
      client.slashCommands.set(key, value)
    } else {
      const command = client.slashCommands.get(interaction.commandName)

      interaction.reply(command)
    }
  }
})

client.slashCommands = new Collection();

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