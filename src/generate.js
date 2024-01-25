let main = document.querySelector("main");

const AUTO_SCORE_TYPES = [
    {id: "leave", name: "Leave", isCheckbox: true},
    {id: "notes-amp", name: "Notes (amp)"},
    {id: "notes-speaker", name: "Notes (speaker)"}
];

const TELEOP_SCORE_TYPES = [
    {id: "notes-amp", name: "Notes (amp)"},
    {id: "notes-speaker", name: "Notes (speaker)"},
    {id: "notes-speaker-amplified", name: "Notes (amplified)"}
];

const ENDGAME_SCORE_POSITIONS  = [
    "None",
    "Park",
    "Onstage - Center Stage",
    "Onstage - Left Stage",
    "Onstage - Right Stage"
];

const STAGES = [
    {id: "center", name: "Center STAGE"},
    {id: "left", name: "STAGE Left"},
    {id: "right", name: "STAGE Right"}
];

const RANKING_POINT_NAMES = [
    {id: "melody", name: "Melody"},
    {id: "ensemble", name: "Ensemble"}
];

const SUMMARIES = [
    {id: "mp", name: "Match"},
    {id: "co", name: "Coopertition"},
    {id: "rp", name: "Ranking"}
];

function makeNumberInput(input) {
    input.type = "integer";
    input.value = "0";
    input.classList.add("num-input");
    return input;
}

function makeCheckbox(input) {
    input.type = "checkbox";
    input.classList.add("checkbox");
    return input;
}

for (let allianceColor of ["blue", "red"]) {
    let allianceDiv = document.createElement("div");
    allianceDiv.id = allianceColor + "-alliance";
    main.appendChild(allianceDiv);

    let teamsDiv = document.createElement("div");
    teamsDiv.id = allianceColor + "-teams";
    allianceDiv.appendChild(teamsDiv);

    for (let i = 1; i <= 3; i++) {
        let teamInput = document.createElement("input");
        teamInput.id = allianceColor + "-team" + i;
        teamInput.classList.add("team");
        teamInput.placeholder = "Team " + i;
        teamInput.type = "integer";
        teamsDiv.appendChild(teamInput);
    }

    let inputsDiv = document.createElement("div");
    inputsDiv.id = allianceColor + "-inputs";
    allianceDiv.appendChild(inputsDiv);

    let autoTotalHeader = document.createElement("h3");
    autoTotalHeader.id = allianceColor + "-auto-total";
    autoTotalHeader.classList.add("total");
    autoTotalHeader.appendChild(document.createTextNode("Autonomous Total:"));
    inputsDiv.appendChild(autoTotalHeader);

    let autoRobotsDiv = document.createElement("div");
    autoRobotsDiv.classList.add(allianceColor + "-robots");
    inputsDiv.appendChild(autoRobotsDiv);

    for (let i = 1; i <= 3; i++) {
        let robotDiv = document.createElement("div");
        robotDiv.classList.add("robot", allianceColor + "-robot" + i);
        autoRobotsDiv.appendChild(robotDiv);

        for (let autoScoreType of AUTO_SCORE_TYPES) {
            let span = document.createElement("span");
            span.classList.add("span");
            robotDiv.appendChild(span);

            let label = document.createElement("label");
            label.htmlFor = allianceColor + "-robot" + i + "-auto-" + autoScoreType.id;
            label.appendChild(document.createTextNode(autoScoreType.name));
            span.appendChild(label);

            let input = document.createElement("input");
            input.id = allianceColor + "-robot" + i + "-auto-" + autoScoreType.id;
            if (autoScoreType.isCheckbox)
                makeCheckbox(input);
            else
                makeNumberInput(input);
            span.appendChild(input);
        }
    }

    inputsDiv.appendChild(document.createElement("hr"));

    let teleopTotalHeader = document.createElement("h3");
    teleopTotalHeader.id = allianceColor + "-teleop-total";
    teleopTotalHeader.classList.add("total");
    teleopTotalHeader.appendChild(document.createTextNode("Teleoperated Total:"));
    inputsDiv.appendChild(teleopTotalHeader);

    let coopertitionSpan = document.createElement("span");
    coopertitionSpan.classList.add("span", "nospecific");
    inputsDiv.appendChild(coopertitionSpan);

    let coopertitionLabel = document.createElement("label");
    coopertitionLabel.htmlFor = allianceColor + "-coopertition";
    coopertitionLabel.appendChild(document.createTextNode("Coopertition Bonus"));
    coopertitionSpan.appendChild(coopertitionLabel);

    let coopertitionCheckbox = document.createElement("input");
    coopertitionCheckbox.id = allianceColor + "-coopertition";
    coopertitionSpan.appendChild(makeCheckbox(coopertitionCheckbox));

    inputsDiv.appendChild(document.createElement("br"));

    let teleopRobotsDiv = document.createElement("div");
    teleopRobotsDiv.classList.add(allianceColor + "-robots");
    inputsDiv.appendChild(teleopRobotsDiv);

    for (let i = 1; i <= 3; i++) {
        let robotDiv = document.createElement("div");
        robotDiv.classList.add(allianceColor + "-robot" + i, "robot");
        teleopRobotsDiv.appendChild(robotDiv);

        for (let teleopScoreType of TELEOP_SCORE_TYPES) {
            let span = document.createElement("span");
            span.classList.add("span");
            robotDiv.appendChild(span);

            let label = document.createElement("label");
            label.htmlFor = allianceColor + "-robot" + i + "-" + teleopScoreType.id;
            label.appendChild(document.createTextNode(teleopScoreType.name));
            span.appendChild(label);

            let input = document.createElement("input");
            input.id = allianceColor + "-robot" + i + "-" + teleopScoreType.id;
            span.appendChild(makeNumberInput(input));
        }
    }

    inputsDiv.appendChild(document.createElement("hr"));

    let endgameTotalHeader = document.createElement("h3");
    endgameTotalHeader.id = allianceColor + "-endgame-total";
    endgameTotalHeader.classList.add("total");
    endgameTotalHeader.appendChild(document.createTextNode("Endgame Total:"));
    inputsDiv.appendChild(endgameTotalHeader);

    let trapSpan = document.createElement("span");
    trapSpan.classList.add("span", "nospecific");
    inputsDiv.appendChild(trapSpan);

    let trapLabel = document.createElement("label");
    trapLabel.htmlFor = allianceColor + "-notes-trap";
    trapLabel.appendChild(document.createTextNode("Notes (trap)"));
    trapSpan.appendChild(trapLabel);

    let trapInput = document.createElement("input");
    trapInput.id = allianceColor + "-notes-trap";
    trapSpan.appendChild(makeNumberInput(trapInput));

    inputsDiv.appendChild(document.createElement("br"));

    let endgameRobotsDiv = document.createElement("div");
    endgameRobotsDiv.classList.add(allianceColor + "-robots");
    inputsDiv.appendChild(endgameRobotsDiv);

    for (let i = 1; i <= 3; i++) {
        let spotlightType = STAGES[i - 1];

        let robotDiv = document.createElement("div");
        robotDiv.classList.add("robot", allianceColor + "-robot" + i);
        endgameRobotsDiv.appendChild(robotDiv);

        let positionLabel = document.createElement("label");
        positionLabel.htmlFor = allianceColor + "-robot" + i + "-position";
        positionLabel.appendChild(document.createTextNode("Position"));
        robotDiv.appendChild(positionLabel);

        let positionSelect = document.createElement("select");
        positionSelect.classList.add("select");
        positionSelect.id = allianceColor + "-robot" + i + "-position";
        for (let position of ENDGAME_SCORE_POSITIONS) {
            let option = document.createElement("option");
            option.appendChild(document.createTextNode(position));
            positionSelect.appendChild(option);
        }
        robotDiv.appendChild(positionSelect);

        robotDiv.appendChild(document.createElement("br"));

        let spotlightSpan = document.createElement("span");
        spotlightSpan.classList.add("span");
        robotDiv.appendChild(spotlightSpan);

        let spotlightLabel = document.createElement("label");
        spotlightLabel.htmlFor = allianceColor + "-spotlight-" + spotlightType.id;
        spotlightLabel.appendChild(document.createTextNode("Spotlight (" + spotlightType.id + " stage)"));
        spotlightSpan.appendChild(spotlightLabel);

        let spotlightCheckbox = document.createElement("input");
        spotlightCheckbox.id = allianceColor + "-spotlight-" + spotlightType.id;
        spotlightSpan.appendChild(makeCheckbox(spotlightCheckbox));

        robotDiv.appendChild(document.createElement("br"));

        let stageRobotsHeader = document.createElement("h3");
        stageRobotsHeader.id = allianceColor + "-robots-" + spotlightType.id;
        stageRobotsHeader.appendChild(document.createTextNode("0 robots on " + spotlightType.name));
        robotDiv.appendChild(stageRobotsHeader);
    }

    inputsDiv.appendChild(document.createElement("hr"));

    let rankingPointsHeader = document.createElement("h3");
    rankingPointsHeader.appendChild(document.createTextNode("Ranking Points"))
    rankingPointsHeader.classList.add("total");
    inputsDiv.appendChild(rankingPointsHeader);

    for (let rankingPointType of RANKING_POINT_NAMES) {
        let span = document.createElement("span");
        span.classList.add("span", "nospecific");
        inputsDiv.appendChild(span);

        let label = document.createElement("label");
        label.htmlFor = allianceColor + "-" + rankingPointType.id;
        label.appendChild(document.createTextNode(rankingPointType.name));
        span.appendChild(label);

        let input = document.createElement("input");
        input.id = allianceColor + "-" + rankingPointType.id;
        input.disabled = true;
        span.appendChild(makeCheckbox(input));
    }

    for (let summary of SUMMARIES) {
        let header = document.createElement("h3");
        header.classList.add("total");
        header.appendChild(document.createTextNode(summary.name + " Points: "));
        inputsDiv.appendChild(header);

        let span = document.createElement("span");
        span.id = allianceColor + "-" + summary.id + "-total";
        span.appendChild(document.createTextNode("0"));
        header.appendChild(span);
    }
}