const ffmpeg = require('ffmpeg');


const converter = async (input, output) => {
    try {
        var process = await new Promise((resolve, reject) => {
            var process = new ffmpeg(`${__dirname}/../storage/${input}`);
            process.then(resolve).catch(reject);
        });

        await new Promise((resolve, reject) => {
            process.fnExtractSoundToMP3(`${__dirname}/../storage/${output}.mp3`, function (error, file) {
                if (!error) {
                    console.log('Audio file: ' + file);
                    resolve();
                } else {
                    reject(error);
                }
            });
        });
    } catch (err) {
        console.log('Error: ' + err);
    }
}

module.exports = { converter }