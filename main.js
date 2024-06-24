import { createPCGraph, createMobileGraph, focusOnNode, isMobileDevice } from './methods.js';

export let namesShown = false;

let Graph;

if(isMobileDevice()){
    Graph = createMobileGraph();
} else {
    Graph = createPCGraph();
}

export const getGraph = () => Graph;

document.getElementById('seeEntireGraphBtn').addEventListener('click', () => {
    Graph.zoomToFit(300);
});

document.getElementById('searchBtn').addEventListener('click', () => {
    const findThisNode = document.getElementById('searchInput').value;
    const node = Graph.graphData().nodes.find(n => n.name.toLowerCase() === findThisNode.toLowerCase());

    if (node) {
        focusOnNode(node);
    } else {
        alert('Node not found. Check typing, or node may not have reached data threshold to be included.');
    }
});

document.getElementById('toggleNamesBtn').addEventListener('click', () => {
    const playerNames = document.querySelectorAll("h3#name");

    playerNames.forEach(playerName => {
        playerName.style.visibility = namesShown ? 'hidden' : 'visible';
    });

    namesShown = !namesShown;
});
