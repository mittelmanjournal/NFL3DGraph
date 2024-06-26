import { createPCGraph, createMobileGraph, isMobileDevice } from './methods.js';
import { setupEventListeners } from './listeners.js';

export let namesShown = false;

let Graph;

if (isMobileDevice()) {
    Graph = createMobileGraph();
} else {
    Graph = createPCGraph();
}

export const getGraph = () => Graph;

setupEventListeners();
