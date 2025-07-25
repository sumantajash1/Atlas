import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as d3 from "d3";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function jsonToReactFlowWithD3(data: any) {
  /**
     type Node = {
      data: { data of each tree node as recieved from json };
      children?: Node[];
      parent?: Node;
      depth?: number;
      height?: number;
      x: number;
      y: number;
      }
  
      root is of type Node;
     */
  const root = d3.hierarchy(data, (d: any) => {
    console.log("asifs obj", d);
    return d.children;
  });
  console.log("asifs root", root);
  const treeLayout = d3.tree().nodeSize([100, 500]); // vertical spacing, horizontal spacing
  // Custom separation: more space for leaf nodes
  console.log("asifs treeLayout", treeLayout);
  treeLayout.separation((a, b) => {
    // If both are leaf nodes, increase separation
    if (!a.children && !b.children) return 1.5;
    // If one is a leaf, moderate separation
    if (!a.children || !b.children) return 1.5;
    // Both are parents, less separation
    return 1.2;
  });

  treeLayout(root);
  console.log("asifs root 2", root.descendants());

  const nodes: any = [];
  const edges: any = [];

  // root.descendants() returns all nodes in the tree in array
  root.descendants().forEach((d) => {
    nodes.push({
      id: d.data.taskId,
      data: { ...d.data },
      position: { x: d.y, y: d.x },
      type: "customNode", // <-- use your custom node type
      sourcePosition: "right",
      targetPosition: "left",
    });

    if (d.parent) {
      edges.push({
        id: `${d.parent.data.taskId}-${d.data.taskId}`,
        source: d.parent.data.taskId,
        target: d.data.taskId,
        type: "bezier",
        style: { stroke: "#fff", strokeWidth: 2 },
        animated: true,
        markerEnd: { type: "arrowclosed", color: "#fff" },
        sourcePosition: "right",
        targetPosition: "left",
      });
    }
  });

  return { nodes, edges };
}

// Utility function to calculate completion percentage for non-leaf nodes
export function calculateNonLeafCompletion(nodes: any[]) {
  // Create a map for quick lookup by id
  const nodeMap = new Map(nodes.map((n: any) => [n.id || n.taskId, n]));

  // Store results as { nodeId: percentage }
  const completion: Record<string, number> = {};

  nodes.forEach((node: any) => {
    // Non-leaf: has children and children.length > 0
    if (node.children && node.children.length > 0) {
      // Get child nodes
      const childNodes = node.children
        .map((childId: string) => nodeMap.get(childId))
        .filter(Boolean);

      const total = childNodes.length;
      const completed = childNodes.filter((n: any) => n.status).length;
      completion[node.id || node.taskId] = total > 0 ? (completed / total) * 100 : 0;
    }
  });

  return completion;
}
