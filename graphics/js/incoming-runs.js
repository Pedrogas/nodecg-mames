'use strict';
const RUNS = 3;
const scBundle = "nodecg-speedcontrol";
const runsContainer = document.getElementById("runs-container");
const _runDataArray = nodecg.Replicant('runDataArray', scBundle);
const _runDataActiveRun = nodecg.Replicant('runDataActiveRun', scBundle);

NodeCG.waitForReplicants(_runDataArray).then(() => {    
    createFields(_runDataArray.value);
});

function createFields(runDataArray){
    let rCount = 0;    
    runsContainer.innerHTML = "";
    runDataArray.forEach(runData => {
    ++rCount;        
    runsContainer.innerHTML += `<div id="run-${rCount}" class="run-data" data-id="${runData.id}">
                                <span id="game-${rCount}" class="game">${runData.game}</span>
                                <span id="release-${rCount}" class="release">${runData.release}</span>
                                <span id="category-${rCount}" class="category">${runData.category}</span>
                                <span id="system-${rCount}" class="system">${runData.system}</span>
                                <span id="estimate-${rCount}" class="estimate">${runData.estimate}</span>
                                </div>`;
    });  
}

_runDataArray.on('change', (newVal, oldVal) => {
    if(oldVal){
        updateFields(newVal);
    }
});

_runDataActiveRun.on('change', (newVal, oldVal) => {  
});

function updateFields(runDataArray){        
    let rCount = 0;    
    runDataArray.forEach(runData => {
        ++rCount;      
        let game = document.getElementById(`game-${rCount}`);        
        let release = document.getElementById(`release-${rCount}`);        
        let category = document.getElementById(`category-${rCount}`);        
        let system = document.getElementById(`system-${rCount}`);        
        let estimate = document.getElementById(`estimate-${rCount}`);       
        game.innerHTML= runData.game;
        release.innerHTML= runData.release;
        category.innerHTML= runData.category;
        system.innerHTML= runData.system;
        estimate.innerHTML= runData.estimate;
    });    
}