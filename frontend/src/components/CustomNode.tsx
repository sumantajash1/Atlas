import { api } from "@/lib/api";
import { Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";

export default function CustomNode({ data, selected, setNodes }: any) {
  console.log("asifs dataaa", data)
  /**
   data ==>
   {
    "_id": "e09566d7-ab50-46ac-8a09-a4bca35ecb46",
    "parentId": "979d1d46-4d82-45c4-9d22-b7916620e140",
    "authorId": "68514a5e3fa53d441783768a",
    "label": "Document Findings and Feedback",
    "startDate": "26.06.2025",
    "endDate": "30.07.2025",
    "hrsAssigned": 1,
    "remHrs": 0,
    "priority": 0,
    "_class": "com.sumanta.prototype.Entity.Task"
    }
   */
  console.log("asifs cust", data);
  const [isLeafNode, setIsLeafNode] = useState(
    !data.children || data.children.length === 0
  );

  useEffect(() => {
    setIsLeafNode(!data.children || data.children.length === 0);
  }, [data.children]);

  function handleComplete() {
    async function update() {
      const res = await api.post("/task/updateTask", { taskId: data.taskId, completed: !data.status })
      console.log("asifs ress", res.data)
      if (res.status === 200) {
        setNodes((prev: any) =>
          prev.map((n: any) =>
            n.id === data.taskId
              ? { ...n, data: { ...n.data, status: !n.data.status } }
              : n
          )
        );
      }
    }
    update()

  }
  return (
    <div
      className={`overflow-hidden relative w-[260px] min-h-[100px] h-auto rounded-2xl bg-neutral-900 border-1 border-neutral-400 shadow-lg flex flex-col justify-start items-stretch p-3 transition-all duration-200 ${selected ? "ring-2 ring-white" : ""
        }`}
    >
      {/* Completion progress bar (background layer) */}
      <div
        className={`absolute left-0 top-0 h-full bg-green-500/25 transition-all duration-1000 z-[1] ${data.status ? "w-full" : "w-0"
          }`}
      />
      {/* Top row: circle and plus icon */}
      <div className="flex items-center justify-between mb-2 z-[2] h-6">
        {isLeafNode && (
          <button
            type="button"
            tabIndex={0}
            className={`hover:cursor-pointer w-7 h-7 rounded-full bg-green-800 border-2 border-neutral-400 bg-transparent flex items-center justify-center hover:bg-neutral-700 transition focus:outline-none ${data.status ? "!bg-white" : "bg-transparent"
              }`}
            onClick={handleComplete}
            aria-label="Circle Action"
          >
            {data.status && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8.5L7 11.5L12 5.5"
                  stroke="#016630"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        )}
        {/* Plus icon */}
        {isLeafNode && (
          <button
            tabIndex={-1}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-transparent text-neutral-200 hover:bg-neutral-700 transition"
            type="button"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 5v10M5 10h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
      {/* Divider */}
      {/* <div className="border-t border-neutral-600 mb-2" /> */}
      <hr className="border-neutral-600 border-0 border-t-1 -mx-3" />
      {/* Centered label */}
      <div className="flex-1 flex items-center justify-center flex-col z-[2]">
        <span className="text-lg text-white font-medium text-center whitespace-pre-line">
          {data.label}
        </span>
        {data.assignedDate && (
          <span className="text-xs text-neutral-300 mt-1 text-center">
            Assigned: {data.assignedDate}
          </span>
        )}
      </div>
      {/* React Flow handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-white z-[2]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-white z-[2]"
      />
    </div>
  );
}


