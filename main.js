import { createGraph, focusOnNode } from './methods.js';

export let namesShown = false;
let Graph = createGraph(16, 0.9, 0.4);

export const getGraph = () => Graph;

document.getElementById('seeEntireGraphBtn').addEventListener('click', () => {
    Graph.zoomToFit(700); // This should work now
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
