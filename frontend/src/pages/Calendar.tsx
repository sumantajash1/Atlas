import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import type { EventContentArg } from "@fullcalendar/core";
import { api } from "@/lib/api";
import { useUser } from "@/context/UserContext";

function renderEventContent(eventInfo: EventContentArg) {
  const props = eventInfo.event.extendedProps;
  return (
    <div
      className="min-h-[100px] w-[80%] flex flex-col bg-zinc-800 rounded-lg px-2 py-1.5 cursor-pointer border border-zinc-700 text-white font-medium text-sm min-w-[180px]"
    // onClick={() => alert(`Clicked event: ${eventInfo.event.title}`)}
    >
      <div className="flex items-center gap-2 flex-col">
        {/* <input type="checkbox" className="mr-1.5" /> */}
        <span className="break-words whitespace-normal text-center">{eventInfo.event.title}</span>
        {props.duration && <span className="break-words whitespace-normal">{Math.ceil(props.duration / 60)}h</span>}
      </div>
      <div className="text-xs text-zinc-300 mt-1">
        {/* {Object.entries(props).map(([key, value]) => (
          <div key={key}>
            <b>{key}:</b> {String(value)}
          </div>
        ))} */}
      </div>
    </div>
  );
}

export default function Calender() {
  const [events, setEvents] = useState([]);
  const { user } = useUser()

  console.log("asifs Events:", events);

  useEffect(() => {
    // fetch("/task.json")
    //   .then((res) => res.json())
    //   .then((data) =>
    //     setEvents(
    //       data.map((task: any) => ({
    //         id: task.id,
    //         title: task.task_name,
    //         start: task.assigned_date,
    //         end: task.assigned_date,
    //         allDay: true,
    //         ...task,
    //       }))
    //     )
    //   );

    async function getEvents() {
      try {
        const res = await api.get(`/task/CalendarData/${user?.userId}`)
        const { data } = res
        if (res.status === 200) {
          setEvents(
            data.map((task: any) => ({
              id: task.taskId,
              title: task.label,
              start: task.assignedDate,
              end: task.assignedDate,
              allDay: true,
              ...task,
            }))
          )
        }
      } catch (err) {
        console.log(err)
      }
    }
    getEvents();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        events={events}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridWeek,dayGridMonth",
        }}
        slotMinTime={undefined}
        slotMaxTime={undefined}
        displayEventTime={false}
        eventContent={renderEventContent}
      />
    </div>
  );
}
