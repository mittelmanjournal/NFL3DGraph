import { CSS2DRenderer, CSS2DObject } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';
import { getGraph, namesShown } from './main.js';

let curSelectedNodeMobile = null;
let prevSelectedNodeMobile = null;

let curSelectedLinkMobile = null;
let prevSelectedLinkMobile = null;

export const isMobileDevice = () => {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

export const createPCGraph = () => {
    return createGraph(20, 0.9, true, focusOnNode, true, showNodeHtmlOnHover, 3, 1, 5, 0.4, false, null, true, showLinkHtmlOnHover);
};

export const createMobileGraph = () => {
    return createGraph(20, 0.9, true, focusOnNodeMobile, false, null, 3, 1, 5, 0.4, true, focusOnLinkMobile, false, null);
}

const createGraph = (nodeResolution, nodeOpacity, useOnNodeClick, funcOnNodeClick, useOnNodeHover, funcOnNodeHover, arrowSize, arrowRelPos, linkHoverPrecision, linkOpacity, useOnLinkClick,
    funcOnLinkClick, useOnLinkHover, funcOnLinkHover) => {
    const Graph = ForceGraph3D({
        extraRenderers: [new CSS2DRenderer()]
    })
        (document.getElementById('3d-graph'))
        .jsonUrl('qbAndReceiverData.json')
        .nodeThreeObjectExtend(true)
        .nodeThreeObject(setupNode)
        .nodeVal(nodeSize)
        .nodeLabel(node => "")
        .nodeResolution(nodeResolution)
        .nodeOpacity(nodeOpacity)
        .linkThreeObjectExtend(true)
        .linkThreeObject(setupLink)
        .linkPositionUpdate(centerLinkHtml)
        .linkDirectionalArrowLength(arrowSize)
        .linkDirectionalArrowRelPos(arrowRelPos)
        .linkHoverPrecision(linkHoverPrecision)
        .linkOpacity(linkOpacity);

    if (useOnNodeClick) {
        Graph.onNodeClick(funcOnNodeClick);
    }

    if (useOnNodeHover) {
        Graph.onNodeHover(funcOnNodeHover);
    }

    if (useOnLinkClick) {
        Graph.onLinkClick(funcOnLinkClick);
    }

    if (useOnLinkHover) {
        Graph.onLinkHover(funcOnLinkHover);
    }

    Graph.d3Force('charge').strength(-500);

    return Graph;
};

const focusOnNodeMobile = node => {
    prevSelectedNodeMobile = curSelectedNodeMobile;
    curSelectedNodeMobile = node;
    if (prevSelectedNodeMobile != curSelectedNodeMobile) {
        // try to hide prev selected node html here
        const nodeEl = document.getElementById("node-id-" + curSelectedNodeMobile.id);
        if (!namesShown) nodeEl.firstChild.style.visibility = "visible";
        nodeEl.style.visibility = 'visible';

        if (prevSelectedNodeMobile != null) {
            const prevNodeEl = document.getElementById("node-id-" + prevSelectedNodeMobile.id);
            if (!namesShown) prevNodeEl.firstChild.style.visibility = "hidden";
            prevNodeEl.style.visibility = 'hidden';
        }
        focusOnNode(node);
    } else {
        const nodeEl = document.getElementById("node-id-" + curSelectedNodeMobile.id);
        if (!namesShown) nodeEl.firstChild.style.visibility = "hidden";
        nodeEl.style.visibility = 'hidden';

        curSelectedNodeMobile = null;
    }
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

const nodeSize = node => {
    if (node.position === "QB") {
        return node.passTouchdowns;
    } else {
        return node.receivingTouchdowns;
    }
};

const setupNode = node => {
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

const getNodeMap = () => {
    return new Map(getGraph().graphData().nodes.map(node => [node.id, node]));
}

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

function setupContainer(container, id, className) {
    container.id = id;
    container.className = className;
    container.style.visibility = 'hidden';
}

const focusOnLinkMobile = link => {

    prevSelectedLinkMobile = curSelectedLinkMobile;
    curSelectedLinkMobile = link;
    if (prevSelectedLinkMobile != curSelectedLinkMobile) {
        const currLabel = document.getElementById('link-id-' + curSelectedLinkMobile.source.id + '-' + curSelectedLinkMobile.target.id);
        if (currLabel) {
            currLabel.style.visibility = 'visible';
        }
        if (prevSelectedLinkMobile != null) {
            const prevLabel = document.getElementById('link-id-' + prevSelectedLinkMobile.source.id + '-' + prevSelectedLinkMobile.target.id);
            if (prevLabel) {
                prevLabel.style.visibility = 'hidden';
            }
        }

        const Graph = getGraph(); // Access the Graph instance
        const distance = 40;

        // Calculate the midpoint of the link
        const midPoint = {
            x: (curSelectedLinkMobile.source.x + curSelectedLinkMobile.target.x) / 2,
            y: (curSelectedLinkMobile.source.y + curSelectedLinkMobile.target.y) / 2,
            z: (curSelectedLinkMobile.source.z + curSelectedLinkMobile.target.z) / 2
        };

        const distRatio = 1 + distance / Math.hypot(midPoint.x, midPoint.y, midPoint.z);

        const newPos = {
            x: midPoint.x * distRatio,
            y: midPoint.y * distRatio,
            z: midPoint.z * distRatio
        };

        Graph.cameraPosition(
            newPos,
            midPoint,
            2000
        );
    } else {
        const currLabel = document.getElementById('link-id-' + curSelectedLinkMobile.source.id + '-' + curSelectedLinkMobile.target.id);
        if (currLabel) {
            currLabel.style.visibility = 'hidden';
        }
        curSelectedLinkMobile = null;
    }

};

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

    setupContainer(labelContainer, 'link-id-' + link.source + '-' + link.target, 'link-container');
    setHtmlElementTextAndId(sourceName, sourceNode.name, "source-player-name");
    setImgSrcAndWidth(sourceImage, sourceNode.imgLink, '50px');
    setHtmlElementTextAndId(targetName, targetNode.name, "target-player-name");
    setImgSrcAndWidth(targetImage, targetNode.imgLink, '50px');

    sharedStats.innerHTML = prepareData(["Shared Data", "Targets: " + link.targets, "Receptions: " + link.receptions, "Yards: " + link.recYards, "Touchdowns: " + link.recTouchdowns, "Long: " + link.recLong]);

    appendElements(labelContainer, [sourceName, sourceImage, targetName, targetImage, sharedStats]);

    labelContainer.style.color = sourceNode.color;

    return new CSS2DObject(labelContainer);
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

const prepareData = elements => elements.map((el, index) => index < elements.length - 1 ? el + "<br>" : el).join("");

function appendElements(parentElement, elements) {
    elements.forEach(element => {
        parentElement.appendChild(element);
    });
}

const setHtmlElementTextAndId = (element, text, id) => { element.textContent = text; element.id = id; };

const setImgSrcAndWidth = (element, src, width) => { element.src = src; element.style.width = width; };