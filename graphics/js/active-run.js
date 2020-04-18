'use strict';
const scBundle = "nodecg-speedcontrol";
const css = document.getElementById("layout-css");
const _runDataActiveRun = nodecg.Replicant('runDataActiveRun', scBundle);
const _runDataArray = nodecg.Replicant('runDataArray', scBundle);
const game = document.getElementById("game");
const release = document.getElementById("release");
const category = document.getElementById("category");
const system = document.getElementById("system");
const estimate = document.getElementById("estimate");
const teamsContainer = document.getElementById("teams-container");
const finishedTimesContainer = document.getElementById("finished-times-container");
const playersContainer = document.getElementById("players-container");
const socialsContainer = document.getElementById("socials-container");
const countriesContainer = document.getElementById("country-container");
var layout;

_runDataActiveRun.on('change', (newVal, oldVal) => {
    if(newVal){
        updateFields(newVal);
    }
});

function updateFields(runData){
    
    playersContainer.innerHTML = "";            
    socialsContainer.innerHTML = "";                
    countriesContainer.innerHTML = "";
    teamsContainer.innerHTML = "";
    
    let tCount = Object.keys(_runDataActiveRun.value.teams).length;
    switch (tCount) {
        case 1:
            let pCount = _runDataActiveRun.value.teams[0].players.length;
            if(pCount){
                css.href = `css/layout-${pCount}.css`;    
            }
            layout = pCount;
        break;
        default:
            if(tCount){
                css.href = `css/layout-${tCount}-vs.css`;
            }
            layout = tCount;
        break;
    }
    
    game.innerHTML = runData.game ? runData.game:"";
    release.innerHTML = runData.release ? runData.release:"";
    category.innerHTML = runData.category ? runData.category:"";
    system.innerHTML = runData.system ? runData.system:"";
    estimate.innerHTML = runData.estimate ? runData.estimate:"";
    
    let teams = 0;    

    runData.teams.forEach(team => {
        teams++;
        teamsContainer.innerHTML += team.name ? `<span id="team-${teams}-name" data-id="${team.id}" class="team-${teams}" data-team="${teams}">${team.name}</span>`:"";
        team.name ? finishedTimesContainer.innerHTML += `<span id="team-${teams}-finished-time" data-id="${team.id}" class="team-${teams}" data-team="${teams}"></span>`:"";
        let players = 0;   
        team.players.forEach(player => {
            players++;            
            playersContainer.innerHTML += playersContainer ?  `<span id="player-${players}-name" data-id="${player.id}" class="team-${teams}" data-team="${teams}" data-player="${players}">${player.name}</span>`:"";            
            socialsContainer.innerHTML += player.social.twitch ?  `<span id="player-${players}-social" data-id="${player.id}" class="team-${teams}" data-team="${teams}" data-player="${players}">${player.social.twitch}</span>`:"";                
            countriesContainer.innerHTML += player.country ? `<span id="player-${players}-country" data-id="${player.id}" class="team-${teams}" data-team="${teams}" data-player="${players}">${player.country}</span>` :"";
        });               
    });                      
}