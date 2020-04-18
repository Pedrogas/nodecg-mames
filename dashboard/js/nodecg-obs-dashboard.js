'use strict';
const radioToolbar = document.getElementById("radio-toolbar");
const scenesContainer = document.getElementById("scenes-container");
const studioModeToggler =  document.getElementById("studio-mode-toggler");
const transitionButton =  document.getElementById("transition-button");
const _sceneList = nodecg.Replicant('obs:sceneList');
const _previewScene = nodecg.Replicant('obs:previewScene')
const _currentScene = nodecg.Replicant('obs:programScene');
const _studioMode = nodecg.Replicant('obs:studioMode');
const _webSocket = nodecg.Replicant('obs:websocket');
var currentRadio, previewRadio, radios;

/*  VALUES TABLE
    string    ->  _webSocket.value.status 
    boolean   ->  _studioMode.value
    string    ->  _sceneList.value
    string    ->  _previewScene.value.name
    string    ->  _currentScene.value.name
*/ 

_webSocket.on('change', () =>{
    obsConnection();
});

_studioMode.on('change', value =>{
    setStudioMode(value);
});

_sceneList.on('change', value =>{
    setScenes(value);
});

_previewScene.on('change', value =>{
    NodeCG.waitForReplicants(_previewScene, _currentScene).then(() => {
        try{            
            setPreviewScene(value.name)
        }catch{
            console.log("currentScene undefined")
            setPreviewScene(_currentScene.value.name);
        }
    });
});

_currentScene.on('change', value =>{
    try{
        currentRadio.classList.remove("radio-checked");
    }catch{
        console.log("currentRadio undefined")
    }finally{
        setCurrentScene(value.name);
    }    
});

nodecg.listenFor('obs:transitioning', transition => {
    setPreviewScene(transition.toScene);
});

transitionButton.addEventListener("click", function(){
    nodecg.sendMessage('obs:transition').then(() => {        
    }).catch(err => {
        nodecg.log.error('Transition failed'+ err);
    });    
});

function notConnected(){
    radioToolbar.innerHTML="<h3>PANEL DISABLED UNTIL <br> OBS CONNECTS</h3>";
    scenesContainer.classList.add("click-disabled");
    studioModeToggler.removeAttribute("checked");
    transitionButton.setAttribute("disabled", "");
}

function setStudioMode(active){
    if(active){
        studioModeToggler.setAttribute("checked", "");
        transitionButton.removeAttribute("disabled");        
    }else{
        studioModeToggler.removeAttribute("checked");
        transitionButton.setAttribute("disabled", "");
    }
}

function setScenes(sceneList){
    if(sceneList.length > 0){
        let htmlTxt = "";             
        sceneList.forEach(scene => {
            htmlTxt = `${htmlTxt}<div><input type="radio" class="sceneRadio" id="radio${scene}" name="radioScene" value="${scene}" onchange="sendPreviewScene(this)"><label for="radio${scene}" id="label${scene}">${scene}</label></div>`;
        });
        radioToolbar.innerHTML=htmlTxt;  
    }else{
        radioToolbar.innerHTML="<h3>NO SCENES FOUND</h3>";
    }
    scenesContainer.classList.remove("click-disabled");
}

function setCurrentScene(currentScene){
    currentRadio = document.getElementById(`label${currentScene}`);
    currentRadio.classList.add("radio-checked");
}

function setPreviewScene(previewScene){
        previewRadio = document.getElementById(`radio${previewScene}`);
        previewRadio.checked=true;     
}

function sendPreviewScene(radio){
    if(_studioMode.value){
        nodecg.sendMessage('obs:previewScene', radio.value);
    }else{
        sendTransition(radio.value);
    }
}

function sendTransition(scene){
    nodecg.sendMessage('obs:transition', {sceneName: scene}).then(() => {        
    }).catch(err => {
        nodecg.log.error('Transition failed'+ err);
    });    
}

function showLoading(){
    console.log("OBS IS CONNECTING");
}

function obsConnection(){
    NodeCG.waitForReplicants(_webSocket, _studioMode,
    _sceneList, _previewScene, _currentScene).then(() => {
        if(_webSocket.value.status == "connected"){        
            setStudioMode(_studioMode.value);
            setScenes(_sceneList.value);
            setCurrentScene(_currentScene.value.name);
            try{            
                setPreviewScene(_previewScene.value.name)
            }catch{
                console.log("currentScene undefined")
                setPreviewScene(_currentScene.value.name);
            }
        }else{
            if(_webSocket.value.status == "connecting"){
                showLoading();
            }else{
                notConnected();
            }
        }
    });
}