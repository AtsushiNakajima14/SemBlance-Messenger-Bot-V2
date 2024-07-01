const axios = require("axios");

module.exports.config = {
    name: "gpt4",
    version: "1.0.0",
    role: 0,
    credits: "chilli",
    description: "Interact with GPT-4 continjes",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["gpt4"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let prompt = args.join(" ");
        if (!prompt) return api.sendMessage("[ ❗ ] - Missing prompt for GPT-4", event.threadID, event.messageID);

        api.sendMessage("📦 𝙶𝙿𝚃4+ 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴𝚂 𝙰𝙸\n━━━━━━━━━━━━━━━━━━\n", event.threadID);

        api.sendMessage("[ 🔍 ] Sending your anserto GPT-4 ...", event.threadID, async (err, info) => {
            try {
                const response = await axios.get(`https://joshweb.click/gpt4?prompt=${encodeURIComponent(prompt)}&uid=100`);
                const answer = response.data.result;

                api.sendMessage(answer, event.threadID);
            } catch (error) {
                console.error(error);
                api.sendMessage("An error occurred while processing your request.", event.threadID);
            }
        });
    } catch (s) {
        api.sendMessage(s.message, event.threadID);
    }
};
