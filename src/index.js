function deepcopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function sum(arr) {
    return arr.reduce((a, b) => a + b);
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
            this.leaveCount * MATCH_POINTS.AUTO.LEAVE +
            this.autoNotesAmp * MATCH_POINTS.AUTO.AMP +
            this.autoNotesSpeaker * MATCH_POINTS.AUTO.SPEAKER
        );
    }

    get teleopMP() {
        return (
            this.teleopNotesAmp * MATCH_POINTS.TELEOP.AMP +
            this.teleopNotesSpeaker * MATCH_POINTS.TELEOP.SPEAKER +
            this.teleopNotesAmplified * MATCH_POINTS.TELEOP.SPEAKER_AMPLIFIED
        );
    }

    get hasMelody() {
        let notes = this.autoNotesAmp + this.autoNotesSpeaker + this.teleopNotesAmp + this.teleopNotesSpeaker + this.teleopNotesAmplified;
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

    get leaveCount() {
        return this.data.auto.leaveRobots.filter(x => x).length;
    }

    get autoNotesAmp() {return sum(this.data.auto.notesAmpRobots);}
    get autoNotesSpeaker() {return sum(this.data.auto.notesSpeakerRobots);}
    get teleopNotesAmp() {return sum(this.data.teleop.notesAmpRobots);}
    get teleopNotesSpeaker() {return sum(this.data.teleop.notesSpeakerRobots);}
    get teleopNotesAmplified() {return sum(this.data.teleop.notesAmplifiedRobots);}

    get totalScore() {
        return this.autoMP + this.teleopMP + this.endgameMP;
    }

    get coopertitionPoints() {
        return +this.data.coopertition;
    }

    get rankingPoints() {
        let result = 0;
        if (this.hasMelody) result++;
        if (this.hasEnsemble) result++;
        let scoreDiff = this.totalScore - this.otherAlliance.totalScore;
        if (scoreDiff > 0) result += RANKING_POINTS.WIN;
        if (scoreDiff === 0) result += RANKING_POINTS.TIE;
        return result;
    }

    get otherAlliance() {
        if (this === blueAlliance) return redAlliance;
        return blueAlliance;
    }

    static blankData = {
        teams: [],
        score: 0,
        coopertition: false,
        rankingPoints: 0,
        auto: {
            leaveRobots: [false, false, false],
            notesAmpRobots: [0, 0, 0],
            notesSpeakerRobots: [0, 0, 0]
        },
        teleop: {
            notesAmpRobots: [0, 0, 0],
            notesSpeakerRobots: [0, 0, 0],
            notesAmplifiedRobots: [0, 0, 0]
        },
        endgame: {
            notesTrap: 0,
            spotlightCenter: false,
            spotlightLeft: false,
            spotlightRight: false,
            centerStage: 0,
            rightStage: 0,
            leftStage: 0,
            positions: ["None", "None", "None"],
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
        ["Autonomous", null, "autoMP"],
        ["LEAVE - ROBOT 1", "auto", "leaveRobots", 0],
        ["LEAVE - ROBOT 2", "auto", "leaveRobots", 1],
        ["LEAVE - ROBOT 3", "auto", "leaveRobots", 2],
        ["NOTES - AMP Robot 1", "auto", "notesAmpRobots", 0],
        ["NOTES - SPEAKER Robot 1", "auto", "notesSpeakerRobots", 0],
        ["NOTES - AMP Robot 2", "auto", "notesAmpRobots", 1],
        ["NOTES - SPEAKER Robot 2", "auto", "notesSpeakerRobots", 1],
        ["NOTES - AMP Robot 3", "auto", "notesAmpRobots", 2],
        ["NOTES - SPEAKER Robot 3", "auto", "notesSpeakerRobots", 2],
        ["Tele-operated", null, "teleopMP"],
        ["COOPERTITION BONUS", "coopertition"],
        ["NOTES - AMP Robot 1", "teleop", "notesAmpRobots", 0],
        ["NOTES - SPEAKER Robot 1", "teleop", "notesSpeakerRobots", 0],
        ["NOTES - SPEAKER - AMPLIFIED Robot 1", "teleop", "notesAmplifiedRobots", 0],
        ["NOTES - AMP Robot 2", "teleop", "notesAmpRobots", 1],
        ["NOTES - SPEAKER Robot 2", "teleop", "notesSpeakerRobots", 1],
        ["NOTES - SPEAKER - AMPLIFIED Robot 2", "teleop", "notesAmplifiedRobots", 1],
        ["NOTES - AMP Robot 3", "teleop", "notesAmpRobots", 2],
        ["NOTES - SPEAKER Robot 3", "teleop", "notesSpeakerRobots", 2],
        ["NOTES - SPEAKER - AMPLIFIED Robot 3", "teleop", "notesAmplifiedRobots", 2],
        ["End Game", null, "endgameMP"],
        ["NOTES - TRAP", "endgame", "notesTrap"],
        ["ROBOT 1", "endgame", "positions", 0],
        ["ROBOT 2", "endgame", "positions", 1],
        ["ROBOT 3", "endgame", "positions", 2],
        ["SPOTLIGHT - Center STAGE", "endgame", "spotlightCenter"],
        ["SPOTLIGHT - STAGE Left", "endgame", "spotlightLeft"],
        ["SPOTLIGHT - STAGE Right", "endgame", "spotlightRight"],
        ["Center STAGE - ROBOTS", "endgame", "centerStage"],
        ["STAGE Left - ROBOTS", "endgame", "leftStage"],
        ["STAGE Right - ROBOTS", "endgame", "rightStage"],
        "Ranking Points",
        ["MELODY", null, "hasMelody"],
        ["ENSEMBLE", null, "hasEnsemble"],
        ["Final Score", null, "totalScore"],
        ["Coopertition Points", null, "coopertitionPoints"],
        ["Ranking Points", null, "rankingPoints"]
    ].map(x => {
        if (typeof x === "string") return [x];
        return [x[0]].concat(getKeys(...x.slice(1)));
    }));
    
    let csvText = csvData.map(row => row.join(",")).join("\n");

    let encodedURI = "data:application/octet-stream," + encodeURI(csvText);
    let link = document.createElement("a");
    link.href = encodedURI;
    link.download = document.getElementById("filename").value.trim() || "download.csv";
    if (!link.download.endsWith(".csv")) link.download += ".csv";
    link.click();
};

const reset = () => {
    document.querySelectorAll("input[type=checkbox]").forEach(x => {x.checked = false;});
    document.querySelectorAll("input[type=integer]").forEach(x => {x.value = 0;});
    document.querySelectorAll("select").forEach(x => {x.value = "None";});
    document.querySelectorAll(".team").forEach(x => {x.value = "";});
    calcValues();
};

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
    ENSEMBLE_ROBOTS: 2,
    TIE: 1,
    WIN: 2
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
    if (input.type === "number" && input.value === "") input.value = 0;
    let allianceToModify = id[0] === "blue" ? blueAlliance : redAlliance;
    let isAuto = id[2] === "auto";
    if(isAuto) {
        let [_, robotNumber, __, leaveOrNotes, notesScorePosition] = id;
        let robotIndex = parseInt(robotNumber[5]) - 1;
        let isLeave = leaveOrNotes === "leave";
        let isAmpScore = !isLeave && notesScorePosition === "amp";
        if(isLeave) {
            allianceToModify.data.auto.leaveRobots[robotIndex] = input.checked;
        } else if(isAmpScore) {
            allianceToModify.data.auto.notesAmpRobots[robotIndex] += parseInt(input.value);
        } else {
            allianceToModify.data.auto.notesSpeakerRobots[robotIndex] += parseInt(input.value);
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
            let robotIndex = parseInt(id[1][5]) - 1;
            allianceToModify.data.endgame.positions[robotIndex] = input.value;
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
            let robotIndex = parseInt(id[1][5]) - 1;
            if (scoredInAmp) {
                allianceToModify.data.teleop.notesAmpRobots[robotIndex] += parseInt(input.value);
            } else if (!scoredInAmplifiedSpeaker) {
                allianceToModify.data.teleop.notesSpeakerRobots[robotIndex] += parseInt(input.value);
            } else {
                allianceToModify.data.teleop.notesAmplifiedRobots[robotIndex] += parseInt(input.value);
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

document.querySelectorAll("input[type=integer]").forEach(input => {
    input.addEventListener("change", () => {if (isNaN(+input.value)) input.value = input.classList.contains("team") ? "" : 0;});
})
document.querySelectorAll(".num-input, .checkbox, .select").forEach((input) => {
    input.addEventListener("change", calcValues);
});

document.querySelectorAll("#blue-coopertition, #red-coopertition").forEach(coopertition => {
    coopertition.addEventListener("input", e => {
        document.querySelectorAll("#blue-coopertition, #red-coopertition").forEach(x => {x.checked = e.target.checked;});
    });
});