import {
  KanbanProvider,
  KanbanBoard,
  KanbanCards,
  KanbanCard,
} from "@/components/ui/shadcn-io/kanban";
import { api } from "@/lib/api";
import { useEffect } from "react";

function Goals() {
  useEffect(() => {
    const fetchGoals = async () => {
      const res = await api.get("/task/allTasks");
      console.log(res.data);
    };
    fetchGoals();
  }, []);

  return (
    <div className=" p-6 bg-slate-950 min-h-screen">
      <KanbanProvider onDragEnd={() => {}}>
        <KanbanBoard id="planned" name="Planned" color="#00b4d8">
          <KanbanCards>
            <KanbanCard id="1" name="AI Scene Analysis" sublabel="AI Integration" description="Dec 1 - Jun 25, 2025" index={0} parent="planned" />
            <KanbanCard id="2" name="AI Scene Analysis" sublabel="AI Integration" description="Dec 1 - Jun 25, 2025" index={1} parent="done" />
          </KanbanCards>
        </KanbanBoard>
        <KanbanBoard id="inprogress" name="In Progress" color="#fbbf24">
          <KanbanCards>{null}</KanbanCards>
        </KanbanBoard>
        <KanbanBoard id="done" name="Done" color="#22c55e">
          <KanbanCards>{null}</KanbanCards>
        </KanbanBoard>
      </KanbanProvider>
    </div>
  );
}

export default Goals;
