const { MessageEmbed } = require('discord.js')
const { colors, version } = require('../config/config')

module.exports = async (msg, client, args) => {
    const statsEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Stats', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`
            Servers - **${client.guilds.cache.size}**
            Users   - **${client.users.cache.size}**
            Latency - **${Math.round(client.ws.ping)}**ms
        `)

    return msg.channel.send(statsEmbed)
}