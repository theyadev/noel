module.exports = {
	name: 'help',
	execute(message, args) {
        message.channel.send(
            "`'start (Number of songs) (OP/ED)` : Start a new quiz.\n`'next` : Skip a song.\n`'leave` : Stop the quiz.\n`'points` : Show points for the current quiz.\n`'set (Anilist Username)` : Set your anilist."
          );
	},
};