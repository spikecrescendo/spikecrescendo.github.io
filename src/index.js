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
                spotlightRight: false
            }
        }
    }

    static blankData = {
        teams: [],
        score: 0,
        coopertition: false,
        rankingPoints: 0,
        auto: {
            leave: false,
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
            spotlightRight: false
        }
    }
}

let blueAlliance = new Alliance();
let redAlliance = new Alliance();

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
                        blueAlliance.data.auto.notesAmp += input.value;
                    } else if(id[4] == "speaker") {

                    }
                }
            } else {
                // Add to teleoperated section

            }
        } else {
            // Red alliance
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

document.querySelectorAll(".num-input").forEach((input) => {
    input.addEventListener("change", () => {
        // Reset stats for both alliances
        blueAlliance.data = Alliance.blankData;
        redAlliance.data = Alliance.blankData;
        calcValues();
    })
});

document.querySelectorAll(".checkbox").forEach((input) => {
    input.addEventListener("change", () => {
        blueAlliance.data = Alliance.blankData;
        redAlliance.data = Alliance.blankData;
        calcValues();
    })
});

document.querySelectorAll(".select").forEach((input) => {
    input.addEventListener("change", () => {
        blueAlliance.data = Alliance.blankData;
        redAlliance.data = Alliance.blankData;
        calcValues();
    })
});
