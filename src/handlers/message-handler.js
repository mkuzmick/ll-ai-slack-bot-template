const llog = require('learninglab-log');
// const ts280 = require('../bots/ts280/index');
// const rainbowTests = require('../bots/rainbow-tests/index');

const isBotMessage = (message) => {
    return message.subtype === "bot_message";
};

const isInSubthread = (message) => {
    return message.thread_ts && message.thread_ts !== message.ts;
};

exports.testing = async ({ client, message, say, event }) => {
    llog.yellow(`testing testing message received: ${message.text}`);
    llog.gray(message);
    const result = await say(`the bot is working, ${message.user}`)
}

exports.parseAll = async ({ client, message, say, event }) => {
    llog.cyan("got a message for the template bots")
    llog.gray(message);

    // Check if the message is a bot message
    if (isBotMessage(message)) {
        llog.yellow("Skipped: Bot message detected");
        return;
    } else if (isInSubthread(message)) {
        llog.magenta("Message is in a subthread");
        // Add specific logic for subthread messages here if needed
        return;
    } else if (message.text) {
        llog.green("Message has text--we'll handle it with the main logic of the bot")
        // const result = await rainbowTests({ client, message, say, event })
        return;
    } else {
        llog.blue("message has no text")
        return;
    }
}

