const elStartRecord = document.getElementById("startRecord");
const elStopRecord = document.getElementById("stopRecord");
const elStartCamera = document.getElementById("startCamera");
const elStopCamera = document.getElementById("stopCamera");

if (!navigator.mediaDevices) {
  alert("getUserMedia support required to use this page");
}

const chunks = [];
let onDataAvailable = e => {
  console.log("Adding chunk");

  chunks.push(e.data);
};

var gMediaStream = null;

elStartCamera.onclick = () =>{

  elStartCamera.hidden = true;
  elStopCamera.hidden = false;
  elStartRecord.hidden = false;

  const elVideo = document.querySelector("video");


  // Not showing vendor prefixes.
  navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  })
  .then(mediaStream => {
    gMediaStream = mediaStream;
    const recorder = new MediaRecorder(mediaStream);
    recorder.ondataavailable = onDataAvailable;
    try {
      elVideo.srcObject = mediaStream;
    } catch (error) {
      elVideo.src = window.URL.createObjectURL(mediaStream);
    }
    
    elStartRecord.onclick = () => {
      recorder.start();
      document.getElementById("status").innerHTML = "recorder started";
      console.log(recorder.state);
      console.log("recorder started");
      elStartRecord.hidden = true;
      elStopRecord.hidden = false;
      elStopCamera.hidden = true;
    };
    elStopRecord.onclick = () => {
      recorder.stop();
      document.getElementById("status").innerHTML = "recorder stoped";
      console.log(recorder.state);
      console.log("recorder started");
      elStartRecord.hidden = false;
      elStopRecord.hidden = true;
      elStopCamera.hidden = false;

    };
    
    elStopCamera.onclick = () => {
        elVideo.srcObject.getTracks().forEach(track => {
          track.stop();
        });
      document.getElementById("status").innerHTML = "Canera stopped";
      console.log("recorder stopped");
       elStartCamera.hidden = false; 
       elStopCamera.hidden = true; 
       elStartRecord.hidden = true;
    };
    
    elVideo.onloadedmetadata = e => {
      console.log("onloadedmetadata", e);
    };
    
    recorder.onstop = e => {
      console.log("e", e);
      console.log("chunks", chunks);
      const bigVideoBlob = new Blob(chunks, {
        type: "video/webm; codecs=webm"
      });
      let fd = new FormData();
      fd.append("fname", "test.webm");
      fd.append("data", bigVideoBlob);
      
      $.ajax({
        type: "POST",
        url: "/",
        data: fd,
        processData: false,
        contentType: false
      }).done(function(data) {
        console.log(data);
      });
    };
  })
  .catch(function(err) {
    console.log("error", err);
  });
}
  