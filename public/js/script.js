const socket = io('/');

// THIS WILL ACCESS THE 'video-grid' ELEMENT OF THE DOM
const videGrid = document.getElementById("video-grid");

// THIS WILL CREATE VIDEO ELEMENT
const myVideo = document.createElement('video');
myVideo.muted = true;

const mypeer = new Peer(undefined, {
    // path: '/peerjs',
    host: '/',
    port: '3031'
});
// let myVideoStream;

// THIS WILL SHOW MY VIDEO WITHOUT PLULGINS
// IN THIS WILL WILL TAKE VIDEO AND USING 'addVideoStream' FUNCTION APPEND THIS VIDEO ON THE DOM
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    // myVideoStream = stream; 
    addVideoStream(myVideo, stream);

    mypeer.on('call', call=>{
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream=>{
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on('user-connected', (userId)=>{
        connectToNewUser(userId, stream);
    })    
})


mypeer.on('open', (id)=>{
    console.log(id)
    socket.emit('join-room', ROOM_ID, id);
})

const connectToNewUser = (userId, stream) => {
    console.log('User connected : '+ userId);
    const call = mypeer.call(userId, stream);
    const video = document.createElement('video');
    // addVideoStream(video, stream);
    call.on('stream', userVideoStream=>{
        addVideoStream(video, userVideoStream);
    })
}


// THIS WILL APPEND THE VIDEO ON THE DOM
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play();
    });

    videGrid.append(video);
}