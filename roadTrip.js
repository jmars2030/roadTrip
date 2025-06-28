/**********************************
 *  For educational purpose and no commercial value or use.
 *  Use it in your own rish, untested unverfied code.
 * 
 *  run using: 'node roadTrip.js <subDir> <yr_video_id>'
 * 
 *  The extracted audio in .mp3 format will be saved in data/<subDir> 
 * 
 **********************************/

const fspromises = require('fs').promises;
const fs = require('fs');
const path = require('path');
const ytdl = require('@distube/ytdl-core');

async function mkDirIfNotExists(dirPath) {
    try {
        await fspromises.mkdir(dirPath, { recursive: true });
        console.log(`Directory '${dirPath}' created successfully.`);
    } catch (err) {
        console.error(`Error creating directory: ${err.message}`);
    }
}


var args = process.argv.slice(2);

var abc = `${process.argv.slice(1)}`;
var arr = abc.split('\\');
var pgmName = (arr[arr.length - 1]);

var dirPath, subPath;

function removeSplChars(originalString) {

    return originalString.replace(/[^a-zA-Z0-9]/g, '_');
}

async function subFullDirPath(dPath, sPath) {

    const dirPath = path.join(__dirname, dPath, sPath);

    try {
        await fspromises.mkdir(dirPath, { recursive: true }, (err) => {});
        console.log(`Directory '${dirPath}' created successfully.`);
        return true;
    } catch (err) {
        console.error(`Error creating directory: ${err.message}`);
        return true;
    }
}

async function getVideoInfo(videoURL) {
    try {
        return await ytdl.getInfo(videoURL);
        //console.log('Video Title:', info.videoDetails.title);
        // Access other properties of the info object
    } catch (err) {
        console.error('Error fetching video info:', err);
    }
}

async function downloadAudio(videoUrl, outputFilePath) {
  try {
    const video = ytdl(videoUrl, {
       filter: 'audioonly', // or { filter: 'audioonly' }
       //fmt: 'mp3', // If you specifically need mp3, you'll need to re-encode with ffmpeg
    });

    video.pipe(fs.createWriteStream(outputFilePath));

    video.on('end', () => {
      console.log(`Audio downloaded to ${outputFilePath}`);
    });

    video.on('error', (err) => {
      console.error('Error downloading audio:', err);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}


async function main_one(vId, dPath, sPath) {
    console.log(`create pDir ${dPath} & sDir ${sPath}`);
    var isDirOk = await subFullDirPath(dPath, sPath);

    const videoURL = `https://www.youtube.com/watch?v=${videoId}`;


    if (isDirOk) {

        var vInfo = await getVideoInfo(videoURL);
        var title = vInfo.videoDetails.title;
        console.log('Title: ', title);
        var plainTitle = removeSplChars(title);
        console.log('Plain Title: ', plainTitle);
        var fileName = plainTitle + '.mp3';
        console.log('fileName: ', fileName);
        var outputFilePath = path.join(__dirname, dPath, sPath, fileName);
        await downloadAudio(videoURL, `${outputFilePath}`);

    } else {
        console.log('Destination Dir Path not exist !!!');
    }

}

if (args.length == 0) {
    console.log(
        `
        usage: ${pgmName} <dest_path> <videoId>
        `
    )
} else if (args.length == 1) {
    dirPath = 'data';
    subPath = '';
    videoId = args[0];
    main_one(videoId, dirPath, subPath);

} else if (args.length == 2) {
    dirPath = 'data';
    subPath = args[0];
    videoId = args[1];
    main_one(videoId, dirPath, subPath);

}


