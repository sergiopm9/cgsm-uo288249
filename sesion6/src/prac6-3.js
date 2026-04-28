import adapter from 'webrtc-adapter';

let localStream;
let localPeerConnection;
let remotePeerConnection;
const offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
};

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');

startButton.disabled = false;
callButton.disabled = true;
hangupButton.disabled = true;

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

function start() {
  startButton.disabled = true;

  const constraints = {
    audio: false,
    video: true
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      localStream = stream;
      localVideo.srcObject = stream;
      callButton.disabled = false;
    })
    .catch((error) => {
      console.error('Error in getUserMedia: ' + error.name, error);
      startButton.disabled = false;
    });
}

function call() {
  callButton.disabled = true;
  hangupButton.disabled = false;

  const servers = null;

  localPeerConnection = new RTCPeerConnection(servers);
  localPeerConnection.onicecandidate = gotLocalIceCandidate;

  remotePeerConnection = new RTCPeerConnection(servers);
  remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
  remotePeerConnection.ontrack = gotRemoteTrack;

  localStream.getTracks().forEach((track) => localPeerConnection.addTrack(track, localStream));

  localPeerConnection.createOffer(offerOptions).then(gotLocalDescription);
}

function gotLocalDescription(description) {
  localPeerConnection.setLocalDescription(description);
  remotePeerConnection.setRemoteDescription(description);
  remotePeerConnection.createAnswer().then(gotRemoteDescription);
}

function gotRemoteDescription(description) {
  remotePeerConnection.setLocalDescription(description);
  localPeerConnection.setRemoteDescription(description);
}

function gotLocalIceCandidate(event) {
  if (event.candidate) {
    remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
  }
}

function gotRemoteIceCandidate(event) {
  if (event.candidate) {
    localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
  }
}

function gotRemoteTrack(event) {
  remoteVideo.srcObject = event.streams[0];
}

function hangup() {
  if (localPeerConnection) {
    localPeerConnection.close();
    localPeerConnection = null;
  }

  if (remotePeerConnection) {
    remotePeerConnection.close();
    remotePeerConnection = null;
  }

  hangupButton.disabled = true;
  callButton.disabled = localStream ? false : true;
  startButton.disabled = localStream ? true : false;
}

void adapter;
