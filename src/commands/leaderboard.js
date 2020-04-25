const User = require('../models/user.model')
const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { currency } = require('../utils/format')

let desc = ''
let lbEmbed = new RichEmbed()
    .setColor(colors.green)
    .setAuthor('Leaderboard')
    .setTimestamp(new Date())
    .setFooter(`LeCashBot v${version}`)

const getTopTen = arr => arr.slice(-10).reverse()

const handleBetLb = (msg, users) => {

    const sortedUsers = users.sort((a, b) => {
        const aBet = a.highestBet.amount
        const bBet = b.highestBet.amount
        return (aBet > bBet) ? 1 : ((bBet > aBet) ? -1 : 0)
    })
    const topTen = getTopTen(sortedUsers)

    let userPosition = 'You are not ranked!'
    let userBet = 'N/A'
    let userBetChance = 'N/A'
    sortedUsers.reverse().forEach((user, index) => {
        if (user.discordId === msg.author.id) {
            userPosition = index + 1
            userBet = user.highestBet.amount
            userBetChance = Math.round(user.highestBet.chance * 100) / 100
        }
    })

    topTen.forEach((user, pos) => {
        desc += `#**${pos + 1}** ${user.name} - $**${currency(user.highestBet.amount)}** - **${Math.round(user.highestBet.chance * 100) / 100}**%\n`
    })
    desc += `#**${userPosition}** - YOU - $**${currency(userBet)}** - **${userBetChance}**%`

    lbEmbed.setDescription(desc)
    desc = ''

    return msg.channel.send(lbEmbed)

}

const handleCashLb = (msg, users) => {

    const sortedUsers = users.sort((a, b) => (a.balance > b.balance) ? 1 : ((b.balance > a.balance) ? -1 : 0))
    const topTen = getTopTen(sortedUsers)

    let userPosition = 'N/A'
    let userBalance = 'N/A'
    sortedUsers.forEach(({ discordId, balance }, index) => {
        if (discordId === msg.author.id) {
            userPosition = index + 1
            userBalance = balance
        }
    })
    
    topTen.forEach((user, pos) => desc += `#**${pos + 1}** ${user.name} - $**${currency(user.balance)}**\n`)
    desc += `#**${userPosition}** - YOU - $**${currency(userBalance)}**`
    lbEmbed.setDescription(desc)
    desc = ''

    return msg.channel.send(lbEmbed)

}

module.exports = async (msg, client, args) => {

    const users = await User.find({ banned: false })
    if (!users) log('error', `ERROR: DB could not find users:\n**${users}**`, client)
    
    return (args[0] == 'bet') ? handleBetLb(msg, users) : handleCashLb(msg, users)

}
