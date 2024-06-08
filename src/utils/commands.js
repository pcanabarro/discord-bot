import { ApplicationCommandType } from "discord.js";

export default [
  {
    name: "ping",
    description: "Replies PONG!",
    value: "pong!"
  },
  {
    name: "ip",
    description: "Replies server ip!",
    value: "nitronmine.ddns.net"
  },
  {
    name: "modpack",
    description: "Replies latest server modpack!",
    value: "https://www.mediafire.com/file/vavgvxbqgeiagw2/mods.rar/file"
  },
  {
    name: "create",
    description: "Create a new command by yourself!",
    options: [
      {
        name: "key",
        description: "Your command",
        type: ApplicationCommandType.Message,
        required: true
      },
      {
        name: "value",
        description: "Command value",
        type: ApplicationCommandType.Message,
        required: true
      }
    ]
  },
  {
    name: "stop",
    description: "Stop bot!",
  },
  {
    name: "play",
    description: "PLAY bot!",
  },
]