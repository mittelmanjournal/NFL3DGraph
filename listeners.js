import { focusOnNode } from './methods.js';
import { getGraph } from './main.js';

export const setupEventListeners = () => {
    document.getElementById('seeEntireGraphBtn').addEventListener('click', () => {
        const Graph = getGraph();
        Graph.zoomToFit(300);
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
        const findThisNode = document.getElementById('searchInput').value;
        const Graph = getGraph();
        const node = Graph.graphData().nodes.find(n => n.name.toLowerCase() === findThisNode.toLowerCase());

        if (node) {
            focusOnNode(node);
            // todo create function to take in a node and show html
                // wait no actually this todo above only applies to mobile, you might have to make different listeners for mobile.
                // or if on pc use focusOnNode(node) vs on mobile use focusOnNodeMobile(node)
        } else {
            alert('Node not found. Check typing, or node may not have reached data threshold to be included.');
        }
    });

    document.getElementById('toggleNamesBtn').addEventListener('click', () => {
        const playerNames = document.querySelectorAll("h3#name");
        const Graph = getGraph();
        let namesShown = false;

        playerNames.forEach(playerName => {
            playerName.style.visibility = namesShown ? 'hidden' : 'visible';
        });

        namesShown = !namesShown;
    });

    document.getElementById('toggleControlsBtn').addEventListener('click', () => {
        const controls = document.getElementById('controls');
        const toggleBtn = document.getElementById('toggleControlsBtn');

        if (controls.style.maxHeight) {
            controls.style.maxHeight = null;
            controls.style.opacity = 1;
            toggleBtn.classList.remove('up');
            toggleBtn.classList.add('down');
        } else {
            controls.style.maxHeight = '0';
            controls.style.opacity = 0;
            toggleBtn.classList.remove('down');
            toggleBtn.classList.add('up');
        }
    });
};
