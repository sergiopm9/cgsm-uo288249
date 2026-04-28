import adapter from 'webrtc-adapter';

const video = document.querySelector('video');
const constraints = {
  audio: false,
  video: true
};

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.error('getUserMedia is not supported in this browser.');
} else {
  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      const videoTracks = stream.getVideoTracks();
      console.log('Stream characteristics: ', constraints);
      console.log('Using device: ' + (videoTracks[0]?.label || 'Unknown device'));

      stream.onended = () => {
        console.log('End of stream');
      };

      video.srcObject = stream;
    })
    .catch((error) => {
      if (error.name === 'ConstraintNotSatisfiedError') {
        const width = constraints.video?.width?.exact;
        const height = constraints.video?.height?.exact;
        console.error(
          'The resolution ' + (width ?? '?') + 'x' + (height ?? '?') + ' px is not supported by the camera.'
        );
      } else if (error.name === 'PermissionDeniedError' || error.name === 'NotAllowedError') {
        console.error('The user has not allowed the access to the camera and the microphone.');
      }
      console.error('Error in getUserMedia: ' + error.name, error);
    });
}

void adapter;
