import { isMobileDevice, getGraph } from './mainMethods.js';
import { focusOnNode, focusOnNodeMobile, resetNodeSelectionMobile } from './methods/nodeMethods.js';
import { resetLinkSelectionMobile } from './methods/linkMethods.js';

export const setupEventListeners = () => {
    document.getElementById('seeEntireGraphBtn').addEventListener('click', () => {
        const Graph = getGraph();
        Graph.zoomToFit(300);
        if(isMobileDevice()){
            resetNodeSelectionMobile();
            resetLinkSelectionMobile();
        }
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
        const findThisNode = document.getElementById('searchInput').value;
        const Graph = getGraph();
        const node = Graph.graphData().nodes.find(n => n.name.toLowerCase() === findThisNode.toLowerCase());

        if (node) {
            isMobileDevice() ? focusOnNodeMobile(node) : focusOnNode(node);
        } else {
            alert('Node not found. Check typing, or node may not have reached data threshold to be included.');
        }
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
