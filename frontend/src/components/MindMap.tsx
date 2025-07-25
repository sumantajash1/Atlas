import { calculateNonLeafCompletion, jsonToReactFlowWithD3 } from "@/lib/utils";
import {
  Background,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";

function MindMap({ data }: { data: any }) {
  const { nodes: initialNodes, edges: initialEdges } =
    jsonToReactFlowWithD3(data);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  console.log("asifs nodes d3", nodes);

  const nodeTypes = {
    customNode: (props: any) => {
      console.log("asifs props", props);
      return (
        <CustomNode
          {...props}
          selected={props.selected}
          data={{
            ...props.data,
            // onCollapse: (collapsed: boolean) =>
            //   handleCollapse(props.id, collapsed),
          }}
          setNodes={setNodes}
        />
      );
    },
  };

  const completion = calculateNonLeafCompletion(nodes);

  return (
    <div className="bg-slate-950 h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges.filter(
          (e) =>
            !nodes.find((n) => n.id === e.source && n.hidden) &&
            !nodes.find((n) => n.id === e.target && n.hidden)
        )}
        // edges={edges}
        nodeTypes={nodeTypes}
        fitView={true}
        nodesDraggable={true}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Background gap={30} size={1.5} color="#fff" />
      </ReactFlow>
    </div>
  );
}

export default MindMap;
