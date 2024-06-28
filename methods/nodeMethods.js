import { CSS2DObject } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';
import { setupContainer, setHtmlElementTextAndId, setImgSrcAndWidth, prepareData, appendElements, moveCamera } from "../mainMethods.js";

let curSelectedNodeMobile = null;
let prevSelectedNodeMobile = null;

export const focusOnNodeMobile = node => { // seen in graphMethods.js
    prevSelectedNodeMobile = curSelectedNodeMobile;
    curSelectedNodeMobile = node;
    if (prevSelectedNodeMobile != curSelectedNodeMobile) {
        hideOrShowNodeMobile(curSelectedNodeMobile, 'visible');

        if (prevSelectedNodeMobile != null) {
            hideOrShowNodeMobile(prevSelectedNodeMobile, 'hidden');
        }
        focusOnNode(node);
    } else {
        hideOrShowNodeMobile(curSelectedNodeMobile, 'hidden');
        curSelectedNodeMobile = null;
    }
};

const hideOrShowNodeMobile = (node, visibility) => {
    const nodeEl = document.getElementById("node-id-" + node.id);
    nodeEl.style.visibility = visibility;
}

export const resetNodeSelectionMobile = () => { 
    if(curSelectedNodeMobile != null)  hideOrShowNodeMobile(curSelectedNodeMobile, 'hidden');
    if(prevSelectedNodeMobile != null)  hideOrShowNodeMobile(prevSelectedNodeMobile, 'hidden');
    curSelectedNodeMobile = null;
    prevSelectedNodeMobile = null;
}

export const nodeSize = node => { // seen in graph methods
    if (node.position === "QB") {
        return node.passTouchdowns;
    } else {
        return node.receivingTouchdowns;
    }
};

export const setupNode = node => { // seen in graph methods, contains setupContainer, setHtmlElementTextAndId,
    // setImgSrcAndWidth, prepareData, appendElements, and CSS2DObject imports
    // TODO: parameterize the scale of all the contents of this div into createGraph()
    // TODO: change the font of this div's text to something nicer
    const nodeContainer = document.createElement('div');
    const playerName = document.createElement('h3');
    const playerImage = document.createElement('img'); // TODO: make this player image cropped circularly. Also parameterize the size of this image in the createGraph method.
    const playerStats = document.createElement('div');

    setupContainer(nodeContainer, "node-id-" + node.id, 'node-container');
    setHtmlElementTextAndId(playerName, node.name, "node-player-name");
    setImgSrcAndWidth(playerImage, node.imgLink, '50px');

    // TODO: I want to parameterize these node colors below in the createGraph() method
    if (node.position === "QB") {
        node.color = "rgb(126, 217, 87)";
        playerStats.innerHTML = prepareData(["Total Career Data", "Position: " + node.position, "Passer Rating: " + node.passerRating, "Games Played: " + node.gamesPlayed, "Games Started: " + node.gamesStarted,
            "Completions: " + node.passesCompleted, "Attempts: " + node.passesAttempted, "Yards: " + node.passYards, "Touchdowns: " + node.passTouchdowns, "Interceptions: " + node.passInterceptions,
            "Longest Pass: " + node.longestPass]);
    } else if (node.position === "WR" || node.position === "TE" || node.position === "RB" || node.position === "FB") {
        switch (node.position) {
            case "WR": node.color = "rgb(92, 225, 230)"; break;
            case "TE": node.color = "rgb(255, 189, 89)"; break;
            case "RB": node.color = "rgb(255, 102, 196)"; break;
            case "FB": node.color = "rgb(255, 87, 87)"; break;
            default: node.color = "rgb(26, 27, 75)"; break;
        }
        playerStats.innerHTML = prepareData(["Total Career Data", "Position: " + node.position, "Games Played: " + node.gamesPlayed, "Games Started: " + node.gamesStarted, "Receptions: " + node.receptions,
            "Targets: " + node.targets, "Yards: " + node.receivingYards, "Touchdowns: " + node.receivingTouchdowns, "Longest Reception: " + node.longestReception]);
    }
    appendElements(nodeContainer, [playerName, playerImage, playerStats]);
    nodeContainer.style.color = node.color; // after setting the node color in the if chain above, set the color of the text in this node html container to the node's color

    return new CSS2DObject(nodeContainer);
};

export const showNodeHtmlOnHover = (node, prevNode) => {
    if (node) {
        const nodeEl = document.getElementById("node-id-" + node.id);
        nodeEl.style.visibility = 'visible';
    }
    if (prevNode) {
        const nodeEl = document.getElementById("node-id-" + prevNode.id);
        nodeEl.style.visibility = 'hidden';
    }
};

export const focusOnNode = node => {
    moveCamera(150, node, 2000);
};