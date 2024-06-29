import { isMobileDevice, getGraph } from './mainMethods.js';
import { focusOnNode, focusOnNodeMobile, resetNodeSelectionMobile } from './methods/nodeMethods.js';
import { resetLinkSelectionMobile } from './methods/linkMethods.js';

let areControlsVisible = true;

export const setupEventListeners = () => {
    document.getElementById('seeEntireGraphBtn').addEventListener('click', () => {
        const Graph = getGraph();
        Graph.zoomToFit(1000, -10000);
        if(isMobileDevice()){
            resetNodeSelectionMobile();
            resetLinkSelectionMobile();
        }
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
        const findThisNode = document.getElementById('searchInput').value.toLowerCase().trim();
        const Graph = getGraph();
        const node = Graph.graphData().nodes.find(n => n.name.toLowerCase() === findThisNode);

        if (node) {
            isMobileDevice() ? focusOnNodeMobile(node) : focusOnNode(node);
        } else {
            alert('Node not found. Check typing, or node may not have reached data threshold to be included.');
        }
    });

    document.getElementById('toggleControlsBtn').addEventListener('click', () => {        
        const controls = document.getElementById('controls');
        const toggleBtn = document.getElementById('toggleControlsBtn');
    
        const showControls = () => {
            controls.style.maxHeight = '50px'; // Adjust to fit the controls content
            controls.style.opacity = 1;
            controls.style.overflow = 'visible';
            toggleBtn.classList.remove('down');
            toggleBtn.classList.add('up');
    
            areControlsVisible = true;
        };

        const hideControls = () => {
            controls.style.maxHeight = '0';
            controls.style.opacity = 0;
            controls.style.overflow = 'hidden';
            toggleBtn.classList.remove('up');
            toggleBtn.classList.add('down');
    
            areControlsVisible = false;
        };

        if (areControlsVisible) { 
            hideControls(controls, toggleBtn);
        } else {
            showControls(controls, toggleBtn);
        } 
    });
};
