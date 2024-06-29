import { setupGraph } from './mainMethods.js';
import { setupEventListeners } from './listeners.js';

setupGraph();
setupEventListeners();
document.querySelector('.scene-nav-info').textContent = 'Link data 1999-2024. Nodes and links in dataset were thresholded by average values in touchdowns, targets and yards.';
