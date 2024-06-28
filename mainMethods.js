import { createMobileGraph, createPCGraph } from './methods/graphMethods.js';

let Graph;

export const setupGraph = () => {
    if (isMobileDevice()) {
        Graph = createMobileGraph();
    } else {
        Graph = createPCGraph();
    }
}

export const getGraph = () => Graph;

export const moveCamera = (distance, point, dur) => {
    const distRatio = 1 + distance / Math.hypot(point.x, point.y, point.z);
    const newPos = point.x || point.y || point.z  ?  { x: point.x * distRatio, y: point.y * distRatio, z: point.z * distRatio }  :  { x: 0, y: 0, z: distance };
    Graph.cameraPosition(newPos, point, dur)
}

export const isMobileDevice = () => {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

export const prepareData = elements => elements.map((el, index) => index < elements.length - 1 ? el + "<br>" : el).join("");

export function appendElements(parentElement, elements) {
    elements.forEach(element => parentElement.appendChild(element));
}

export const setHtmlElementTextAndId = (element, text, id) => { element.textContent = text; element.id = id; };

export const setImgSrcAndWidth = (element, src, width) => { element.src = src; element.style.width = width; };

export function setupContainer(container, id, className) {
    container.id = id;
    container.className = className;
    container.style.visibility = 'hidden';
}