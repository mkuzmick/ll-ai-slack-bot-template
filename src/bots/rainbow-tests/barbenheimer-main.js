const llog = require('learninglab-log');
const OpenAI = require('openai');

const poet = async ({client, message}) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: "You are a Hollywood writer." },
            { role: "user", content: `You are listening in on a Slack Channel's dialogue. For each message you need to tell me whether you think the lines would be more likely to be spoken by a character in the Barbie movie or the Oppenheimer movie (based on tone and subject). You will then remix the message and give me the version that would show up in a movie trailer where Barbie or Oppenheimer is speaking it. Here is the message: ${message.text}` }
        ],
        max_tokens: 3000,
    });

    const responseText = response.choices[0].message.content.trim();

    await client.chat.postMessage({
        channel: message.channel,
        text: responseText,
        thread_ts: message.thread_ts ? message.thread_ts : message.ts,
        // username: "Poet",
        // icon_url: "https://m.media-amazon.com/images/M/MV5BY2M0MWUxYWQtY2IyYS00YjA5LTllNmUtYTRiNzUxOTk2MjBlXkEyXkFqcGc@._V1_.jpg"
    });
    return(responseText);
};

module.exports = poet;