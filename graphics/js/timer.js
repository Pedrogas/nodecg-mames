'use strict';
const _timer = nodecg.Replicant('timer', scBundle);
var timer = document.getElementById("timer");

_timer.on('change', (newVal, oldVal) =>{
    if(newVal){
        updateTimer(newVal, oldVal);
    }
});

function updateTimer(newVal, oldVal) {           
    if(oldVal){
        timer.classList.remove(`timer-${oldVal.state}`);
    }
    timer.classList.add(`timer-${newVal.state}`);    
    timer.innerHTML = newVal.time;  
    
    if(newVal.teamFinishTimes){
        Object.keys(newVal.teamFinishTimes).forEach(id => {            
            let querySelector = `#finished-times-container > span[data-id="${id}"]`;
            let team = document.querySelector(querySelector);
            let teamFinishTime = newVal.teamFinishTimes[id];            
            team.innerHTML = teamFinishTime.time;
            team.classList.add(`run-${teamFinishTime.state}`);
        });            
    }
    /*let teams = Object.keys(finishTimes);
    teams.forEach(team => {
        console.log(finishTimes[team]);
    });*/
}