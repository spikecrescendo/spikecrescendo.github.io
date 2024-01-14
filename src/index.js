class Alliance {
    constructor() {
        this.data = {
            teams: [],
            score: 0,
            coopertition: false,
            rankingPoints: 0,
            auto: {
                leave: 0,
                notesAmp: 0,
                notesSpeaker: 0,
                autoMP: 0
            },
            teleop: {
                notesAmp: 0,
                notesSpeaker: 0,
                notesAmplified: 0,
                teleopMP: 0
            },
            endgame: {
                notesTrap: 0,
                spotlightCenter: false,
                spotlightLeft: false,
                spotlightRight: false,
                centerStage: 0,
                rightStage: 0,
                leftStage: 0,
                park: 0,
                stagePoints: 0
                
            }
        }
    }

    static blankData = {
        teams: [],
        score: 0,
        coopertition: false,
        rankingPoints: 0,
        auto: {
            leave: 0,
            notesAmp: 0,
            notesSpeaker: 0,
            autoMP: 0
        },
        teleop: {
            notesAmp: 0,
            notesSpeaker: 0,
            notesAmplified: 0,
            teleopMP: 0
        },
        endgame: {
            notesTrap: 0,
            spotlightCenter: false,
            spotlightLeft: false,
            spotlightRight: false,
            centerStage: 0,
            rightStage: 0,
            leftStage: 0,
            park: 0,
            stagePoints: 0
        }
    }
}

let blueAlliance = new Alliance();
let redAlliance = new Alliance();

// MP Constants
const autoAmp = 2; const autoSpeaker = 5; const leave = 2;
const teleopAmp = 1; const teleopSpeaker = 2; const teleopSpeakerAmplified = 5;
const park = 1; const onstage = 3; const spotlightBonus = 1; const harmony = 2; const trap = 5;
// RP Constants
const melody = 18; const coopertitionMelody = 15; const ensemblePoints = 10; const ensembleRobots = 2;

document.querySelectorAll(".team").forEach((team) => {
    team.addEventListener("change", () => {
        blueAlliance.data.teams = [];
        blueAlliance.data.teams.push(document.getElementById("blue-team1").value);
        blueAlliance.data.teams.push(document.getElementById("blue-team2").value);
        blueAlliance.data.teams.push(document.getElementById("blue-team3").value);
        redAlliance.data.teams = [];
        redAlliance.data.teams.push(document.getElementById("red-team1").value);
        redAlliance.data.teams.push(document.getElementById("red-team2").value);
        redAlliance.data.teams.push(document.getElementById("red-team3").value);


        console.log(document.getElementById("blue-team1").value);
        console.log(blueAlliance);
        console.log(redAlliance);
    });
});

const changeHandler = (input) => {
    // Parse id to find property
    const id = input.id.split("-");
    console.log(id);
        if(id[0] == "blue") {
            // Blue alliance
            if(id[2] == "auto") {
                if(id[3] == "leave") {
                    blueAlliance.data.auto.leave += input.checked;
                } else if(id[3] == "notes") {
                    if(id[4] == "amp") {
                        blueAlliance.data.auto.notesAmp += parseInt(input.value);
                    } else if(id[4] == "speaker") {
                        blueAlliance.data.auto.notesSpeaker += parseInt(input.value);
                    }
                }
            } else {
                // Add to teleoperated section
                if (id[1] == "coopertition"){
                    blueAlliance.data.coopertition = input.checked;
                } else if (id[2] == "position"){
                    if(input.value == "Park"){
                        blueAlliance.data.endgame.park++;
                    } else if (input.value == "Onstage - Center Stage"){
                        blueAlliance.data.endgame.centerStage++;
                    } else if (input.value == "Onstage - Right Stage"){
                        blueAlliance.data.endgame.rightStage++;
                    } else if (input.value == "Onstage - Left   "){
                        blueAlliance.data.endgame.leftStage++;
                    }
                } else if (id[1] == "spotlight"){
                    if (id[2] == "center"){
                        blueAlliance.data.endgame.spotlightCenter = input.checked;
                    } else if (id[2] == "right"){
                        blueAlliance.data.endgame.spotlightRight = input.checked;
                    } else {
                        blueAlliance.data.endgame.spotlightLeft = input.checked;
                    }
                } else {
                    if (id[3] == "amp"){
                        blueAlliance.data.teleop.notesAmp += parseInt(input.value);
                    } else if (id[3] == "speaker"){
                        if (id.length == 4){
                            blueAlliance.data.teleop.notesSpeaker += parseInt(input.value);
                        } else {
                            blueAlliance.data.teleop.notesAmplified += parseInt(input.value);
                        }
                    } 
                }
            }
        } else {
            // Red alliance
            if(id[2] == "auto") {
                if(id[3] == "leave") {
                    redAlliance.data.auto.leave += input.checked;
                } else if(id[3] == "notes") {
                    if(id[4] == "amp") {
                        redAlliance.data.auto.notesAmp += parseInt(input.value);
                    } else if(id[4] == "speaker") {
                        redAlliance.data.auto.notesSpeaker += parseInt(input.value);
                    }
                }
            } else {
                // Add to teleoperated section
                if (id[1] == "coopertition"){
                    redAlliance.data.coopertition = input.checked;
                } else if (id[2] == "position"){
                    if(input.value == "Park"){
                        redAlliance.data.endgame.park++;
                    } else if (input.value == "Onstage - Center Stage"){
                        redAlliance.data.endgame.centerStage++;
                    } else if (input.value == "Onstage - Right Stage"){
                        redAlliance.data.endgame.rightStage++;
                    } else if (input.value == "Onstage - Left   "){
                        redAlliance.data.endgame.leftStage++;
                    }
                } else if (id[1] == "spotlight"){
                    if (id[2] == "center"){
                        redAlliance.data.endgame.spotlightCenter = input.checked;
                    } else if (id[2] == "right"){
                        redAlliance.data.endgame.spotlightRight = input.checked;
                    } else {
                        redAlliance.data.endgame.spotlightLeft = input.checked;
                    }
                } else {
                    if (id[3] == "amp"){
                        redAlliance.data.teleop.notesAmp += parseInt(input.value);
                    } else if (id[3] == "speaker"){
                        if (id.length == 4){
                            redAlliance.data.teleop.notesSpeaker += parseInt(input.value);
                        } else {
                            redAlliance.data.teleop.notesAmplified += parseInt(input.value);
                        }
                    } 
                }
            }
        }
    
}

const calcValues = () => {
    document.querySelectorAll(".num-input").forEach((inputB) => {
        changeHandler(inputB);
    });
    document.querySelectorAll(".checkbox").forEach((inputB) => {
        changeHandler(inputB);
    });
    document.querySelectorAll(".select").forEach((inputB) => {
        changeHandler(inputB);
    });
}

const convertToMP = () => {
    blueAlliance.data.auto.autoMP = leave * blueAlliance.data.auto.leave + 
    autoAmp * blueAlliance.data.auto.notesAmp + autoSpeaker * blueAlliance.data.auto.notesSpeaker;
    
}

document.querySelectorAll(".num-input").forEach((input) => {
    input.addEventListener("change", () => {
        // Reset stats for both alliances
        blueAlliance.data = JSON.parse(JSON.stringify(Alliance.blankData));
        redAlliance.data = JSON.parse(JSON.stringify(Alliance.blankData));
        calcValues();
        console.warn(redAlliance.data)
    })
    
});

document.querySelectorAll(".checkbox").forEach((input) => {
    input.addEventListener("change", () => {
        blueAlliance.data = JSON.parse(JSON.stringify(Alliance.blankData));
        redAlliance.data = JSON.parse(JSON.stringify(Alliance.blankData));
        calcValues();
    })
});

document.querySelectorAll(".select").forEach((input) => {
    input.addEventListener("change", () => {
        blueAlliance.data = JSON.parse(JSON.stringify(Alliance.blankData));
        redAlliance.data = JSON.parse(JSON.stringify(Alliance.blankData));
        calcValues();
    })
});
