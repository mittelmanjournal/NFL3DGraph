import { CSS2DObject } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';
import { getGraph, setupContainer, setHtmlElementTextAndId, setImgSrcAndWidth, prepareData, appendElements, moveCamera } from "../mainMethods.js";

let curSelectedLinkMobile = null;
let prevSelectedLinkMobile = null;

const getNodeMap = () => {
    return new Map(getGraph().graphData().nodes.map(node => [node.id, node]));
}

export const focusOnLinkMobile = link => {

    prevSelectedLinkMobile = curSelectedLinkMobile;
    curSelectedLinkMobile = link;
    if (prevSelectedLinkMobile != curSelectedLinkMobile) {
        hideOrShowLinkMobile(curSelectedLinkMobile, 'visible');

        if (prevSelectedLinkMobile != null) {
            hideOrShowLinkMobile(prevSelectedLinkMobile, 'hidden');
        }
        const curLinkSrc = curSelectedLinkMobile.source; const curLinkTgt = curSelectedLinkMobile.target;
        const midPoint = { x: (curLinkSrc.x + curLinkTgt.x) / 2, y: (curLinkSrc.y + curLinkTgt.y) / 2, z: (curLinkSrc.z + curLinkTgt.z) / 2 };
        moveCamera(150, midPoint, 1250);
    } else {
        hideOrShowLinkMobile(curSelectedLinkMobile, 'hidden');
        curSelectedLinkMobile = null;
    }

};

const hideOrShowLinkMobile = (link, visibility) => {
    const currLabel = document.getElementById('link-id-' + link.source.id + '-' + link.target.id);
    if (currLabel)  currLabel.style.visibility = visibility;
}

export const resetLinkSelectionMobile = () => {
    if (curSelectedLinkMobile != null) hideOrShowLinkMobile(curSelectedLinkMobile, 'hidden');
    if (prevSelectedLinkMobile != null) hideOrShowLinkMobile(prevSelectedLinkMobile, 'hidden');
    curSelectedLinkMobile = null;
    prevSelectedLinkMobile = null;
}

export const setupLink = link => {
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

export const centerLinkHtml = (obj, { start, end }) => {
    const middlePos = {
        x: start.x + (end.x - start.x) / 2,
        y: start.y + (end.y - start.y) / 2,
        z: start.z + (end.z - start.z) / 2
    };
    obj.position.set(middlePos.x, middlePos.y, middlePos.z);
};

export const showLinkHtmlOnHover = (link, prevLink) => {
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