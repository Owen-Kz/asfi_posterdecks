const socket = io();
const startRecordingButton = document.getElementById('start-recording');
const stopRecordingButton = document.getElementById('stop-recording');

startRecordingButton.addEventListener('click', () => {
  // Start recording the socket's audio and video streams
  socket.emit('start-recording');
});

stopRecordingButton.addEventListener('click', () => {
  // Stop recording the socket's audio and video streams
  socket.emit('stop-recording');
});
