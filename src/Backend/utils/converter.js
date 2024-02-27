const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const inputFilePath = 'input.webm';
const outputFilePath = 'output.mp3';

const converter = (input, output) => {
  return new Promise((resolve, reject) => {
      ffmpeg(`${__dirname}/../storage/${input}`)
          .toFormat('mp3')
          .on('end', () => {
              console.log('Conversion complete');
              resolve();
          })
          .on('error', (err) => {
              console.error('Error converting file:', err);
              reject(err);
          })
          .save(`${output}.mp3`);
  });
};

export {converter}