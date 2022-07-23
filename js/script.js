//Control Button
const startBtn=document.getElementById('start-button')
const stopBtn=document.getElementById('stop-button')
const stateBtn=document.getElementById('state-button')
//Views Component
const mainVideo=document.getElementById("main-video")
const videoGrid=document.querySelector(".video-grid");

var mediaRecorder;
let chunck=[];
let isRecording=false;
async function handleStartRecording()
{
    //Set audio and video stream;
    const videoStream=await navigator.mediaDevices.getDisplayMedia({video:true});
    let audioStream=null;
    try
    {
        audioStream=await navigator.mediaDevices.getUserMedia({audio:{
            echoCancellation:true,noiseSuppression:true,sampleRate:44100
        }})
    }
    catch(e)
    {
        console.log(e.message)
    }
    if(!videoStream)
        return;
    let stream=null;
    if(audioStream)
        stream=new MediaStream([...videoStream?.getVideoTracks(),...audioStream?.getAudioTracks()])
    else
        stream=new MediaStream([...videoStream.getTracks()])
    //Set main video stream
    mainVideo.srcObject=stream;
    mainVideo.muted=true;
    mainVideo.onloadedmetadata=()=>mainVideo.play();

    mediaRecorder=new MediaRecorder(stream);
    mediaRecorder.start(1000);
    mediaRecorder.onstart=()=>{
        isRecording=true;
        mainVideo.classList.remove("hide");
        videoGrid?.classList.add("hide");
        if(startBtn==null||stopBtn==null||stateBtn==null) return; 
        startBtn.disabled=true
        stopBtn.disabled=stateBtn.disabled=false
    }
    mediaRecorder.onpause=()=>{
        mainVideo.pause();
        isRecording=false;
        stateBtn.className="fa fa-play";
        stateBtn.querySelector('span').textContent="Resume Recording";
    }
    mediaRecorder.onresume=()=>{
        mainVideo.play();
        isRecording=true;
        stateBtn.className="fa fa-pause";
        stateBtn.querySelector('span').textContent="Pause Recording";
    }
    mediaRecorder.ondataavailable=(e)=>chunck.push(e.data);

    mediaRecorder.onstop=(e)=>{
        isRecording=false;
        mainVideo?.classList.add("hide");
        videoGrid?.classList.remove("hide");
        if(startBtn==null||stopBtn==null||stateBtn==null) return; 
        startBtn.disabled=false
        stopBtn.disabled=stateBtn.disabled=true
        let blob=new Blob(chunck,{type:e.target.mimeType});
        createVideoContainer(URL.createObjectURL(blob))
        chunck=[]
        audioStream?.getTracks().forEach(track=>track.stop())
        videoStream?.getTracks().forEach(track=>track.stop())
        stream.getTracks().forEach(track=>track.stop())
    }

    stateBtn.addEventListener('click',()=>{
        if(isRecording===true)
            mediaRecorder.pause();
        else
            mediaRecorder.resume();
    })
}

function createVideoContainer(url)
{
    const videoContainer=document.getElementById("video-template").content.cloneNode(true);
    videoContainer.querySelector('video').src=url;
    videoContainer.querySelector('a').href=url;
    videoGrid.append(videoContainer);
}
startBtn.addEventListener('click',handleStartRecording);
stopBtn.addEventListener('click',()=>{
    if(mediaRecorder!=null)
        mediaRecorder.stop();
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(location.href+'sw.js')
      .then(() => { console.log('Service Worker Registered'); });
  }
  