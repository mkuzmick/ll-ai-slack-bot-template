const llog = require('learninglab-log');
const barbenheimerMain = require('./barbenheimer-main');
const barbenheimerPoster = require('./barbenheimer-poster');

const wait = (seconds) => new Promise(resolve => setTimeout(resolve, seconds*1000));

module.exports = async ({ client, message, say, event }) => {
    llog.cyan("got a message the day of the ts280 demo")
    const bhResult = await barbenheimerMain({ client, message, say, event });
    await wait(3);
    const poetryCriticResult = await barbenheimerPoster({
        client: client,
        message: message,
        imagePrompt: bhResult
    })
}

