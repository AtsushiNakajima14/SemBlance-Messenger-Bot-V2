const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "randomedit",
    version: "1.0.0",
    role: 0,
    credits: "chilli",
    description: "Fetch a random edited video",
    hasPrefix: false,
    aliases: ["random", "randomedit"],
    usage: "[editvideo]",
    cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;

    try {
        api.sendMessage("⏱️ | Fetching a random edited video, please wait...", threadID);

        const response = await axios.get("https://cc-project-apis-jonell-magallanes.onrender.com/api/edit");
        const videoData = response.data.data;

        if (!videoData) {
            return api.sendMessage("No edited video found.", threadID, messageID);
        }

        const videoUrl = videoData.play;
        const message = `𝐄𝐝𝐢𝐭𝐞𝐝 𝐕𝐢𝐝𝐞𝐨:\n\n𝐓𝐢𝐭𝐥𝐞: ${videoData.title}\n𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${videoData.description}`;

        const filePath = path.join(__dirname, 'cache', 'edit_video.mp4');
        const writer = fs.createWriteStream(filePath);

        const videoResponse = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream'
        });

        videoResponse.data.pipe(writer);

        writer.on('finish', () => {
            api.sendMessage(
                { body: message, attachment: fs.createReadStream(filePath) },
                threadID,
                () => fs.unlinkSync(filePath)
            );
        });

        writer.on('error', (err) => {
            console.error('Error writing video file:', err);
            api.sendMessage("An error occurred while processing the video.", threadID, messageID);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", threadID, messageID);
    }
};
