function deepcopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

String.prototype.capitalize = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();});
};

class Alliance {
    constructor() {
        this.resetData();
    }

    resetData() {
        let teams = deepcopy(this.data?.teams ?? []);
        this.data = deepcopy(Alliance.blankData);
        this.data.teams = teams;
    }

    get autoMP() {
        return (
            this.data.auto.leave * MATCH_POINTS.AUTO.LEAVE +
            this.data.auto.notesAmp * MATCH_POINTS.AUTO.AMP +
            this.data.auto.notesSpeaker * MATCH_POINTS.AUTO.SPEAKER
        );
    }

    get teleopMP() {
        return (
            this.data.teleop.notesAmp * MATCH_POINTS.TELEOP.AMP +
            this.data.teleop.notesSpeaker * MATCH_POINTS.TELEOP.SPEAKER +
            this.data.teleop.notesAmplified * MATCH_POINTS.TELEOP.SPEAKER_AMPLIFIED
        );
    }

    get hasMelody() {
        let notes = this.data.auto.notesAmp + this.data.auto.notesSpeaker + this.teleopTotal;
        return (this.data.coopertition && notes >= RANKING_POINTS.COOPERTITION_MELODY) || notes >= RANKING_POINTS.MELODY;
    }

    get hasEnsemble() {
        let numOnstage = this.data.endgame.centerStage + this.data.endgame.rightStage + this.data.endgame.leftStage;
        return numOnstage >= RANKING_POINTS.ENSEMBLE_ROBOTS && this.endgameMP >= RANKING_POINTS.ENSEMBLE_POINTS;
    }

    get endgameMP() {
        return (
            this.data.endgame.park * MATCH_POINTS.PARK +
            (this.data.endgame.centerStage + this.data.endgame.rightStage + this.data.endgame.leftStage) * MATCH_POINTS.ONSTAGE +
            (
                this.data.endgame.spotlightCenter * this.data.endgame.centerStage +
                this.data.endgame.spotlightLeft * this.data.endgame.leftStage +
                this.data.endgame.spotlightRight * this.data.endgame.rightStage
            ) * MATCH_POINTS.SPOTLIGHT_BONUS +
            this.harmonyCount * MATCH_POINTS.HARMONY +
            this.data.endgame.notesTrap * MATCH_POINTS.TRAP
        );
    }

    get harmonyCount() {
        return Math.max(1, this.data.endgame.centerStage, this.data.endgame.rightStage, this.data.endgame.leftStage) - 1;
    }

    static blankData = {
        teams: [],
        score: 0,
        coopertition: false,
        rankingPoints: 0,
        auto: {
            leave: 0,
            notesAmp: 0,
            notesSpeaker: 0
        },
        teleop: {
            notesAmp: 0,
            notesSpeaker: 0,
            notesAmplified: 0
        },
        endgame: {
            notesTrap: 0,
            spotlightCenter: false,
            spotlightLeft: false,
            spotlightRight: false,
            centerStage: 0,
            rightStage: 0,
            leftStage: 0,
            park: 0
        }
    }
}

let blueAlliance = new Alliance();
let redAlliance = new Alliance();

// Download data
const download = () => {
    function getKeys(...k) {
        if (k[0] === null) k = k.slice(1);
        else k = ["data"].concat(k);
        let output = [redAlliance, blueAlliance];
        for (let kp of k) {
            output = output.map(x => x[kp]);
        }
        return output;
    }
    let csvData = [
        ["...", "Red Alliance", "Blue Alliance"],
        ["Robots"].concat(redAlliance.data.teams).concat(blueAlliance.data.teams)
    ].concat([
        ["Auto Robots left", "auto", "leave"],
        ["Auto Notes (Amp)", "auto", "notesAmp"],
        ["Auto Notes (Speaker)", "auto", "notesSpeaker"],
        ["Auto MP", null, "autoMP"],
        ["Teleop Notes (Amp)", "teleop", "notesAmp"],
        ["Teleop Notes (Speaker)", "teleop", "notesSpeaker"],
        ["Teleop Notes (Amplified Speaker)", "teleop", "notesAmplified"],
        ["Teleop MP", null, "teleopMP"]
    ].map(x => [x[0]].concat(getKeys(...x.slice(1)))));
    
    let csvText = csvData.map(row => row.join(",")).join("\n");

    let encodedURI = "data:application/octet-stream," + encodeURI(csvText);
    let link = document.createElement("a");
    link.href = encodedURI;
    link.download = document.getElementById("filename").value.trim() || "download.csv";
    if (!link.download.endsWith(".csv")) link.download += ".csv";
    link.click();
}

// MP Constants
const MATCH_POINTS = {
    AUTO: {
        AMP: 2,
        SPEAKER: 5,
        LEAVE: 2
    },
    TELEOP: {
        AMP: 1,
        SPEAKER: 2,
        SPEAKER_AMPLIFIED: 5
    },
    PARK: 1,
    ONSTAGE: 3,
    SPOTLIGHT_BONUS: 1,
    HARMONY: 2,
    TRAP: 5
};

// RP Constants
const RANKING_POINTS = {
    MELODY: 18,
    COOPERTITION_MELODY: 15,
    ENSEMBLE_POINTS: 10,
    ENSEMBLE_ROBOTS: 2
};

function updateTeams() {
    blueAlliance.data.teams = [];
    redAlliance.data.teams = [];
    for (let i = 1; i <= 3; i++) {
        blueAlliance.data.teams.push(document.getElementById("blue-team" + i).value);
        redAlliance.data.teams.push(document.getElementById("red-team" + i).value);
    }
}
updateTeams();

document.querySelectorAll(".team").forEach((team) => {
    team.addEventListener("change", updateTeams);
});

const changeHandler = (input) => {
    // Parse id to find property
    const id = input.id.split("-");
    let allianceToModify = id[0] === "blue" ? blueAlliance : redAlliance;
    let isAuto = id[2] === "auto";
    if(isAuto) {
        let [_, robotNumber, __, leaveOrNotes, notesScorePosition] = id;
        let isLeave = leaveOrNotes === "leave";
        let isAmpScore = !isLeave && notesScorePosition === "amp";
        if(isLeave) {
            allianceToModify.data.auto.leave += input.checked;
        } else if(isAmpScore) {
            allianceToModify.data.auto.notesAmp += parseInt(input.value);
        } else {
            allianceToModify.data.auto.notesSpeaker += parseInt(input.value);
        }
    } else {
        // Add to teleoperated section
        let isCoopertition = id[1] === "coopertition";
        let isPositionScore = id[2] === "position";
        let isSpotlightScore = id[1] === "spotlight";
        let isTrapScore = id[2] === "trap";
        let isMelody = id[1] === "melody";
        let isEnsemble = id[1] === "ensemble";
        if (isCoopertition) {
            allianceToModify.data.coopertition = input.checked;
        } else if (isMelody || isEnsemble) {
            allianceToModify.data.rankingPoints += input.checked;
        } else if (isPositionScore) {
            if(input.value === "Park"){
                allianceToModify.data.endgame.park++;
            } else if (input.value.startsWith("Onstage - ")) {
                allianceToModify.data.endgame[input.value.slice(10, -6).toLowerCase() + "Stage"]++;
            }
        } else if (isSpotlightScore){
            let positionScored = id[2];
            allianceToModify.data.endgame["spotlight" + positionScored.capitalize()] = input.checked;
        } else if (isTrapScore) {
            allianceToModify.data.endgame.notesTrap += parseInt(input.value);
        } else {
            let scoredInAmp = id[3] === "amp";
            let scoredInAmplifiedSpeaker = id.length === 5;
            if (scoredInAmp){
                allianceToModify.data.teleop.notesAmp += parseInt(input.value);
            } else if (!scoredInAmplifiedSpeaker) {
                allianceToModify.data.teleop.notesSpeaker += parseInt(input.value);
            } else {
                allianceToModify.data.teleop.notesAmplified += parseInt(input.value);
            }
        }
    }
}


const calcValues = () => {
    blueAlliance.resetData();
    redAlliance.resetData();
    document.querySelectorAll(".num-input, .checkbox, .select").forEach(changeHandler);
    document.getElementById("blue-melody").checked = blueAlliance.hasMelody;
    document.getElementById("red-melody").checked = redAlliance.hasMelody;
    document.getElementById("blue-ensemble").checked = blueAlliance.hasEnsemble;
    document.getElementById("red-ensemble").checked = redAlliance.hasEnsemble;

    // Update HTML headers
    document.querySelector("#blue-auto-total").innerText = "Autonomous Total: " + blueAlliance.autoMP;
    document.querySelector("#blue-teleop-total").innerText = "Teleoperated Total: " + blueAlliance.teleopMP;
    document.querySelector("#blue-endgame-total").innerText = "Endgame Total: " + blueAlliance.endgameMP;

    document.querySelector("#red-auto-total").innerText = "Autonomous Total: " + redAlliance.autoMP;
    document.querySelector("#red-teleop-total").innerText = "Teleoperated Total: " + redAlliance.teleopMP;
    document.querySelector("#red-endgame-total").innerText = "Endgame Total: " + redAlliance.endgameMP;
}

calcValues();

document.querySelectorAll(".num-input, .checkbox, .select").forEach((input) => {
    input.addEventListener("change", calcValues);
});

document.querySelectorAll("#blue-coopertition, #red-coopertition").forEach(coopertition => {
    coopertition.addEventListener("input", e => {
        document.querySelectorAll("#blue-coopertition, #red-coopertition").forEach(x => {x.checked = e.target.checked;});
    });
});