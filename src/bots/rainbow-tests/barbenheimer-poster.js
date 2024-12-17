const llog = require('learninglab-log');
const OpenAI = require('openai');
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const Replicate = require("replicate");
const axios = require('axios');




async function uploadImageToRainbow(client, scene, filename, imagePath, fileSizeInBytes, ts) {
    try {
        // Step 1: Get the upload URL
        const uploadUrlResponse = await client.files.getUploadURLExternal({
            channels: scene.channel,
            filename: filename,
            thread_ts: ts,
            length: fileSizeInBytes,
        });
  
        if (!uploadUrlResponse.ok) {
            console.error("Failed to get upload URL:", uploadUrlResponse.error);
            return;
        }
  
        console.log("Upload URL obtained successfully:", uploadUrlResponse);
  
        const uploadUrl = uploadUrlResponse.upload_url;
        const file_id = uploadUrlResponse.file_id;
  
        // Step 2: Upload the file content to the URL
        const fileStream = fs.createReadStream(imagePath);
        await axios.post(uploadUrl, fileStream, {
            headers: {
                'Content-Type': 'image/webp', // Adjust the content type based on the file type
                'Content-Length': fileSizeInBytes, // Include the file size in bytes
            },
        });
  
        console.log("Image content uploaded successfully to Slack's server.");
  
        // Step 3: Complete the upload process
        const completeUploadResponse = await client.files.completeUploadExternal({
            files: [
                {
                    id: file_id,
                    title: "Generated Image",
                },
            ],
            initial_comment: "I've created this image for you",
            channel_id: rainbowChannel,
            thread_ts: ts,
            channels: [rainbowChannel], // Ensure that the file is shared in the channel
        });
  
        if (!completeUploadResponse.ok) {
            console.error("Failed to complete file upload:", completeUploadResponse.error);
            return;
        }
  
        console.log("Image upload completed successfully:", completeUploadResponse);
  
        // Step 4: Log file information to verify its existence
        const fileInfoResponse = await client.files.info({
            file: file_id,
        });
  
        if (!fileInfoResponse.ok) {
            console.error("Failed to retrieve file info:", fileInfoResponse.error);
            return;
        }
  
        console.log("Retrieved file info:", fileInfoResponse);
    } catch (error) {
        console.error("An error occurred during the file upload process:", error);
    }
  }

  

const poetryCritic = async ({client, message, poemToCritique}) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    



    const imagePromptResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            // { role: "user", content: `Please briefly describe what would be the best image to accompany a blog post or social post about the following conversation transcript:\n\n"${transcription.text}".` }
            { role: "user", content: `Please briefly describe what would be the best movie poster and cinematic image to advertise a netflix drama about the following conversation transcript:\n\n"${transcription.text}".` }

        ],
        max_tokens: 200,
      });



    const responseText = response.choices[0].message.content.trim();

    await client.chat.postMessage({
        channel: message.channel,
        text: responseText,
        thread_ts: message.thread_ts ? message.thread_ts : message.ts,
        username: "Poetry Critic",
        icon_url: "https://files.slack.com/files-pri/T0HTW3H0V-F0812GX8CCR/susan_sontag_1979___lynn_gilbert__headshot_.jpg?pub_secret=93f38fff22"
    });

    return responseText;

};

module.exports = poetryCritic;