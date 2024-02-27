const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const inputFilePath = 'input.webm';
const outputFilePath = 'output.mp3';

ffmpeg(inputFilePath)
  .toFormat('mp3')
  .on('end', () => {
    console.log('Conversion complete');
  })
  .on('error', (err) => {
    console.error('Error converting file:', err);
  })
  .save(outputFilePath);