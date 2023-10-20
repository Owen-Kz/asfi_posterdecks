const puppeteer = require('puppeteer');
const { exec } = require('child_process');

const ScreenCapture = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const urlPulse = `${url}`; // Replace with your webpage URL
  await page.goto(urlPulse);

  const outputPath = 'output.mp4';

  try {
    // Capture video frames
    const videoElements = await page.$$('body'); // Find all video elements on the page
    const audioElement = await page.$('video'); // Find the audio element on the page

    for (let i = 0; i < videoElements.length; i++) {
      const videoElement = videoElements[i];
      await videoElement.screenshot({ path: `video${i}.png` });
    }

    // Capture audio
    const audioStream = await audioElement.getProperty('srcObject');
    const audioBuffer = await audioStream.buffer();

    // Write the audio buffer to a file
    const audioFilePath = 'audio.mp3';
    const audioFile = await fs.promises.open(audioFilePath, 'w');
    await audioFile.write(audioBuffer);
    await audioFile.close();

    // Use FFMpeg to combine captured frames and audio into one video
    exec(`ffmpeg -r 30 -f image2 -s 1920x1080 -i video%d.png -i audio.mp3 -filter_complex hstack=inputs=2 -vcodec libx264 -crf 25 -pix_fmt yuv420p ${outputPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log(`Video saved to ${outputPath}`);
      }
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
};

module.exports = ScreenCapture;