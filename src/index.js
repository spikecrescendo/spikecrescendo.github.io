
// Auto
const leave = 2; const autoAmp = 2; const autoSpeaker = 5;
// Teleop
const teleAmp = 1; const teleSpeaker = 2; const ampSpeaker = 5;
// Endgame
const park = 2; const stage = 3; const spotlightBonus = 1; const harmony = 2; const trap = 5;
// RP
const melody = 18; const coopMelody = 15; const ensemblePoints = 10; const ensembleRobots = 2;





let blueAlliance = {
    teams: [],
    score: 0,
    coopertition: false,
    rankingPoints: 0,
    melody: false,
    ensemble: false,
    auto: {
        autoPoints: 0,
        leaveCount: 0,
        notesAmp: 0,
        notesSpeaker: 0
    },
    teleop: {
        teleopPoints: 0,
        notesAmp: 0,
        notesSpeaker: 0,
        notesAmplified: 0
    },
    endgame: {
        notesTrap: 0,
        spotlightCenter: false,
        spotlightLeft: false,
        spotlightRight: false,
        endPlacements: [],
        onstageCount: 0,
        endgamePoints: 0
    }
}
function calculateBlue(){
    // Count Leave Points
    if (document.getElementById('blue-robot1-auto-leave').checked){blueAlliance.auto.leaveCount++;}
    if (parseInt(document.getElementById('blue-robot2-auto-leave').value), 10){blueAlliance.auto.leaveCount++;}
    if (parseInt(document.getElementById('blue-robot3-auto-leave').value), 10){blueAlliance.auto.leaveCount++;}

    blueAlliance.auto.notesAmp = 
    parseInt(document.getElementById('blue-robot1-auto-notes-amp').value, 10) + 
    parseInt(document.getElementById('blue-robot2-auto-notes-amp').value, 10) + 
    parseInt(document.getElementById('blue-robot3-auto-notes-amp').value, 10);

    blueAlliance.auto.notesSpeaker =
    parseInt(document.getElementById('blue-robot1-auto-notes-speaker').value, 10) + 
    parseInt(document.getElementById('blue-robot2-auto-notes-speaker').value, 10) + 
    parseInt(document.getElementById('blue-robot3-auto-notes-speaker').value, 10);

    blueAlliance.teleop.notesAmp = 
    parseInt(document.getElementById('blue-robot1-notes-amp').value, 10) + 
    parseInt(document.getElementById('blue-robot2-notes-amp').value, 10) + 
    parseInt(document.getElementById('blue-robot3-notes-amp').value, 10);

    blueAlliance.teleop.notesSpeaker = 
    parseInt(document.getElementById('blue-robot1-notes-speaker').value, 10) + 
    parseInt(document.getElementById('blue-robot2-notes-speaker').value, 10) + 
    parseInt(document.getElementById('blue-robot3-notes-speaker').value, 10);

    blueAlliance.teleop.notesAmplified = 
    parseInt(document.getElementById('blue-robot1-notes-speaker-amplified').value, 10) + 
    parseInt(document.getElementById('blue-robot2-notes-speaker-amplified').value, 10) + 
    parseInt(document.getElementById('blue-robot3-notes-speaker-amplified').value, 10);

    blueAlliance.endgame.notesTrap = parseInt(document.getElementById('blue-notes-trap').value, 10);
    [blueAlliance.spotlightCenter, blueAlliance.spotlightLeft, blueAlliance.spotlightRight] = [document.getElementById('blue-spotlight-center').checked, document.getElementById('blue-spotlight-left').checked, document.getElementById('blue-spotlight-right').checked];

    blueAlliance.endgame.endPlacements = [document.getElementById('blue-robot1-position').options[document.getElementById('blue-robot1-position').selectedIndex].value, 
    parseInt(document.getElementById('blue-robot2-position').options[document.getElementById('blue-robot3-position').selectedIndex].value, 10), 
    parseInt(document.getElementById('blue-robot2-position').options[document.getElementById('blue-robot3-position').selectedIndex].value, 10)];


    const totalNotes = blueAlliance.teleop.notesAmp + blueAlliance.teleop.notesSpeaker + blueAlliance.teleop.notesAmp + 
    blueAlliance.auto.notesAmp + blueAlliance.auto.notesSpeaker;

    if (totalNotes >= melody || (totalNotes >= coopMelody && blueAlliance.coopertition)) {blueAlliance.rankingPoints++; blueAlliance.melody = true;}

    blueAlliance.auto.autoPoints = blueAlliance.auto.leaveCount * leave + blueAlliance.auto.notesAmp * autoAmp + blueAlliance.auto.notesSpeaker * autoSpeaker;

    blueAlliance.teleop.teleopPoints = blueAlliance.teleop.notesAmp * teleAmp + blueAlliance.teleop.notesSpeaker * teleSpeaker + blueAlliance.teleop.notesAmplified * ampSpeaker;

    const endgameScoring = [0, park, stage + spotlightBonus * blueAlliance.spotlightCenter, stage + spotlightBonus * blueAlliance.spotlightLeft, stage + spotlightBonus * blueAlliance.spotlightRight];

    for (let i of blueAlliance.endgame.endPlacements) {blueAlliance.endgame.endgamePoints += endgameScoring[i]; if (i >= 2){blueAlliance.endgame.onstageCount++;}}
    blueAlliance.endgame.endgamePoints += trap * blueAlliance.endgame.notesTrap;
    if (blueAlliance.endgame.onstageCount >= ensembleRobots && (blueAlliance.endgame.endgamePoints >= ensemblePoints)){blueAlliance.rankingPoints++; blueAlliance.ensemble = true;}

    blueAlliance.score = blueAlliance.auto.autoPoints + blueAlliance.teleop.teleopPoints + blueAlliance.endgame.endgamePoints;

    for (let i in blueAlliance) {console.log(i, blueAlliance[i]);}
    document.write(blueAlliance.score);
}