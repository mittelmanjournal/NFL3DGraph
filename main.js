import { createGraph, focusOnNode } from './methods.js';

// Function to show a popup with the given message for the specified duration
const showPopup = (message, duration) => {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;

    document.body.appendChild(popup);
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
        document.body.removeChild(popup);
    }, duration);
};

const isMobileDevice = () => {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

// Example usage: Show "Hello World" for 2 seconds
showPopup(isMobileDevice(), 2000);

export let namesShown = false;
let Graph = createGraph(10, 0.9, 0.4);

export const getGraph = () => Graph;

document.getElementById('seeEntireGraphBtn').addEventListener('click', () => {
    Graph.zoomToFit(700);
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
