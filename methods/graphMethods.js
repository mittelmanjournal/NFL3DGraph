import { CSS2DRenderer } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';
import { focusOnNode, focusOnNodeMobile, nodeSize, setupNode, showNodeHtmlOnHover } from './nodeMethods.js';
import { focusOnLinkMobile, setupLink, centerLinkHtml, showLinkHtmlOnHover } from './linkMethods.js';

export const createPCGraph = () => {
    return createGraph(20, 0.9, true, focusOnNode, true, showNodeHtmlOnHover, 3, 1, 5, 0.4, false, null, true, showLinkHtmlOnHover); // import from methods.js
};

export const createMobileGraph = () => {
    return createGraph(20, 0.9, true, focusOnNodeMobile, false, null, 3, 1, 5, 0.4, true, focusOnLinkMobile, false, null); // import from methods.js
}

const createGraph = (nodeResolution, nodeOpacity, useOnNodeClick, funcOnNodeClick, useOnNodeHover, funcOnNodeHover, arrowSize, arrowRelPos, linkHoverPrecision, linkOpacity, useOnLinkClick,
    funcOnLinkClick, useOnLinkHover, funcOnLinkHover) => {
    const Graph = ForceGraph3D({
        extraRenderers: [new CSS2DRenderer()]
    })
        (document.getElementById('3d-graph'))
        .jsonUrl('qbAndReceiverData.json')
        .nodeThreeObjectExtend(true)
        .nodeThreeObject(setupNode) // import from methods.js
        .nodeVal(nodeSize) // import from methods.js
        .nodeLabel(node => "")
        .nodeResolution(nodeResolution)
        .nodeOpacity(nodeOpacity)
        .linkThreeObjectExtend(true)
        .linkThreeObject(setupLink) // import from methods.js
        .linkPositionUpdate(centerLinkHtml) // import from methods.js
        .linkDirectionalArrowLength(arrowSize)
        .linkDirectionalArrowRelPos(arrowRelPos)
        .linkHoverPrecision(linkHoverPrecision)
        .linkOpacity(linkOpacity);

    if (useOnNodeClick) {
        Graph.onNodeClick(funcOnNodeClick);
    }

    if (useOnNodeHover) {
        Graph.onNodeHover(funcOnNodeHover);
    }

    if (useOnLinkClick) {
        Graph.onLinkClick(funcOnLinkClick);
    }

    if (useOnLinkHover) {
        Graph.onLinkHover(funcOnLinkHover);
    }

    Graph.d3Force('charge').strength(-500);
    

    return Graph;
};