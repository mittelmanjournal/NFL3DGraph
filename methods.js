import { CSS2DRenderer, CSS2DObject } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';
import { getGraph, namesShown } from './main.js';

export const createGraph = (nodeResolution, nodeOpacity, linkOpacity) => {
    const Graph = ForceGraph3D({
        extraRenderers: [new CSS2DRenderer()]
    })
        (document.getElementById('3d-graph'))
        .jsonUrl('qbAndReceiverData.json')
        .nodeThreeObjectExtend(true)
        .nodeThreeObject(setupNode)
        .onNodeClick(focusOnNode)
        .onNodeHover(showNodeHtmlOnHover)
        .nodeVal(nodeSize)
        .nodeLabel(node => "")
        .nodeResolution(nodeResolution)
        .nodeOpacity(nodeOpacity)
        .linkThreeObjectExtend(true)
        .linkThreeObject(setupLink)
        .linkPositionUpdate(centerLinkHtml)
        .onLinkHover(showLinkHtmlOnHover)
        .linkDirectionalArrowLength(3)
        .linkDirectionalArrowRelPos(1)
        .linkHoverPrecision(5)
        .linkOpacity(linkOpacity);

    Graph.d3Force('charge').strength(-500);

    return Graph;
};

export const focusOnNode = node => {
    const Graph = getGraph(); // Access the Graph instance
    const distance = 40;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    const newPos = node.x || node.y || node.z
        ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
        : { x: 0, y: 0, z: distance }; 

    Graph.cameraPosition(
        newPos, 
        node, 
        2000 
    );
};

const showNodeHtmlOnHover = (node, prevNode) => {
    if (node) {
        const nodeEl = document.getElementById("node-id-" + node.id);
        if (!namesShown) nodeEl.firstChild.style.visibility = "visible";
        nodeEl.style.visibility = 'visible';
    }
    if (prevNode) {
        const nodeEl = document.getElementById("node-id-" + prevNode.id);
        if (!namesShown) nodeEl.firstChild.style.visibility = "hidden";
        nodeEl.style.visibility = 'hidden';
    }
};

const setupNode = node => {
    // TODO: parameterize the scale of all the contents of this div into createGraph()
    // TODO: change the font of this div's text to something nicer
    const nodeContainer = document.createElement('div');
    const playerName = document.createElement('h3'); 
    const playerImage = document.createElement('img'); // TODO: make this player image cropped circularly. Also parameterize the size of this image in the createGraph method.
    const playerStats = document.createElement('div');

    nodeContainer.id = "node-id-" + node.id;
    nodeContainer.className = 'node-container';
    nodeContainer.style.visibility = 'hidden';

    playerName.textContent = node.name;
    playerName.id = "name";

    playerImage.src = node.imgLink;
    playerImage.alt = node.imgLink;
    playerImage.style.width = '50px';

    // TODO: I want to parameterize these node colors below in the createGraph() method
    const receiverData = node => "Position: " + node.position + "<br>" +
        "Games Played: " + node.gamesPlayed + "<br>" +
        "Games Started: " + node.gamesStarted + "<br>" +
        "Receptions: " + node.receptions + "<br>" +
        "Targets: " + node.targets + "<br>" +
        "Yards: " + node.receivingYards + "<br>" +
        "Touchdowns: " + node.receivingTouchdowns + "<br>" +
        "Longest Reception: " + node.longestReception;

    if (node.position === "QB") {
        node.color = "rgb(26, 192, 198)";
        playerStats.innerHTML = "Total Career Data<br>Position: " + node.position + "<br>" +
            "Passer Rating: " + node.passerRating + "<br>" +
            "Games Played: " + node.gamesPlayed + "<br>" +
            "Games Started: " + node.gamesStarted + "<br>" +
            "Completions: " + node.passesCompleted + "<br>" +
            "Attempts: " + node.passesAttempted + "<br>" +
            "Yards: " + node.passYards + "<br>" +
            "Touchdowns: " + node.passTouchdowns + "<br>" +
            "Interceptions: " + node.passInterceptions + "<br>" +
            "Longest Pass: " + node.longestPass;
    } else if (node.position === "WR" || node.position === "TE" || node.position === "RB" || node.position === "FB") {
        switch(node.position){
            case "WR": node.color = "rgb(58, 158, 253)"; break;
            case "TE": node.color = "rgb(62, 68, 145)"; break;
            case "RB": node.color = "rgb(41, 42, 115)"; break;
            case "FB": node.color = "rgb(26, 27, 75)"; break;
            default: node.color = "rgb(26, 27, 75)"; break;
        }
        playerStats.innerHTML = receiverData(node);
    }

    nodeContainer.appendChild(playerName);
    nodeContainer.appendChild(playerImage);
    nodeContainer.appendChild(playerStats);
    nodeContainer.style.color = node.color;

    return new CSS2DObject(nodeContainer);
};

const getNodeMap = () => {
    return new Map(getGraph().graphData().nodes.map(node => [node.id, node]));
}

/**
 * Color the link and arrow based on the source node color.
 * The content includes image of source player on the left and target on the right.
 * 
 * 
 * @param {*} link 
 * @returns 
 */
const setupLink = link => {
    const nodeMap = getNodeMap();
    const sourceNode = nodeMap.get(link.source);
    const targetNode = nodeMap.get(link.target);

    const labelContainer = document.createElement('div');
    const sourceName = document.createElement('h3');
    const sourceImage = document.createElement('img');
    const targetName = document.createElement('h3');
    const targetImage = document.createElement('img');
    const sharedStats = document.createElement('div');

    labelContainer.style.visibility = 'hidden';
    labelContainer.id = 'link-id-' + link.source + '-' + link.target;
    labelContainer.className = 'link-label';
    
    sourceName.textContent = sourceNode.name; // this doesn't work, I need to get the node's name property, not the link's
    sourceName.id = "source-name";
    
    sourceImage.src = sourceNode.imgLink; // this doesn't work, I need to get the node's imgLink property, not the link's
    sourceImage.style.width = '50px';

    targetName.textContent = targetNode.name; // this doesn't work, I need to get the node's name property, not the link's
    targetName.id = "target-name";

    targetImage.src = targetNode.imgLink; // this doesn't work, I need to get the node's imgLink property, not the link's
    targetImage.style.width = '50px';

    sharedStats.innerHTML = "Targets: " + link.targets + "<br>" + 
                            "Receptions: " + link.receptions + "<br>" + 
                            "Yards: " + link.recYads + "<br>" + 
                            "Touchdowns: " + link.recTouchdowns + "<br>" + 
                            "Long: " + link.recLong;

    labelContainer.appendChild(sourceName);
    labelContainer.appendChild(sourceImage);
    labelContainer.appendChild(targetName);
    labelContainer.appendChild(targetImage);
    labelContainer.appendChild(sharedStats);
    
    labelContainer.style.color = link.source.color;

    return new CSS2DObject(labelContainer);
};

const nodeSize = node => {
    if (node.position === "QB") {
        return node.passTouchdowns;
    } else {
        return node.receivingTouchdowns;
    }
};

const centerLinkHtml = (obj, { start, end }) => {
    const middlePos = {
        x: start.x + (end.x - start.x) / 2,
        y: start.y + (end.y - start.y) / 2,
        z: start.z + (end.z - start.z) / 2
    };
    obj.position.set(middlePos.x, middlePos.y, middlePos.z);
};

const showLinkHtmlOnHover = (link, prevLink) => {
    if (prevLink) {
        const prevLabel = document.getElementById('link-id-' + prevLink.source.id + '-' + prevLink.target.id);
        if (prevLabel) {
            prevLabel.style.visibility = 'hidden';
        }
    }
    if (link) {
        const currLabel = document.getElementById('link-id-' + link.source.id + '-' + link.target.id);
        if (currLabel) {
            currLabel.style.visibility = 'visible';
        }
    }
};
