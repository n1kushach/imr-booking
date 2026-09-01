import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/classic";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";
import type { Booking } from "@/types/booking";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSnapshot } from "valtio";
import { RoomsStore } from "@/store/Rooms.store";
import { BookingsStore, BookingStoreActions } from "@/store/Bookings.store";

interface ISchedule {
  bookings: Booking[];
}

const Schedule = (props: ISchedule) => {
  const { bookings } = props;
  const roomsSnapshot = useSnapshot(RoomsStore) as typeof RoomsStore;
  const bookingsSnapshot = useSnapshot(BookingsStore) as typeof BookingsStore;
  const events = bookings.map((booking) => ({
    id: booking.id,
    title: booking.title,

    start: `${booking.date}T${booking.startTime}:00`,
    end: `${booking.date}T${booking.endTime}:00`,

    allDay: false,

    extendedProps: {
      bookingId: booking.id,
      roomId: booking.roomId,
      organizer: booking.organizer,
      attendees: booking.attendees,
      notes: booking.notes,
    },
  }));

  return (
    <FullCalendar
      plugins={[themePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      // Your data starts on Aug 31
      initialDate="2026-08-31"
      colorScheme="dark"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "timeGridWeek,timeGridDay",
      }}
      events={events}
      allDaySlot={false}
      weekends={true}
      dateClick={(date) => {
        const formattedDate = date.date.toISOString().split("T")[0];
        BookingStoreActions.openNew(undefined, formattedDate);
      }}
      slotMinTime="08:00:00"
      slotMaxTime="20:00:00"
      slotDuration="00:30:00"
      eventClick={(event) => {
        const booking = bookingsSnapshot.bookings.find(
          (item) => item.id == event.event.extendedProps.bookingId,
        );
        if (!booking) return;
        BookingStoreActions.openEdit(booking);
      }}
      height="700px"
      eventContent={(eventInfo) => {
        const room = roomsSnapshot.rooms.find(
          (item) => item.id == eventInfo?.event?.extendedProps?.roomId,
        );
        return (
          <Tooltip>
            <div className="p-1">
              <TooltipTrigger>
                <div className="font-semibold text-[10px]">
                  {eventInfo.event.title}{" "}
                </div>
              </TooltipTrigger>

              <TooltipContent>
                <div className="flex flex-col">
                  <div className="text-xs">Room: {room?.name}</div>
                  <div className="text-xs">Floor: {room?.floor}</div>
                  <div className="text-xs">{eventInfo.timeText}</div>
                  <div className="text-xs">
                    {eventInfo.event.extendedProps.notes}
                  </div>
                </div>
              </TooltipContent>
            </div>
          </Tooltip>
        );
      }}
    />
  );
};

export default Schedule;
