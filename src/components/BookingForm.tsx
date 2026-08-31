import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";

import { ROOMS, EMPLOYEES, CURRENT_USER } from "../data/mockData";

import type { Booking } from "@/types/booking";

import { useSnapshot } from "valtio";
import { RoomsStore, RoomStoreActions } from "@/store/Rooms.store";

interface BookingFormProps {
  onSave: (booking: Booking) => void;
}

const TIMES = Array.from({ length: 24 }, (_, i) => {
  const h = String(i).padStart(2, "0");

  return [`${h}:00`, `${h}:30`];
}).flat();

export default function BookingForm({ onSave }: BookingFormProps) {
  const snapshot = useSnapshot(RoomsStore);

  const form = snapshot.bookingForm;

  const today = new Date().toISOString().split("T")[0];

  const isEditing = !!snapshot.editBooking?.id;

  const toggleAttendee = (name: string) => {
    const attendees = RoomsStore.bookingForm.attendees;

    // eslint-disable-next-line react-hooks/immutability
    RoomsStore.bookingForm.attendees = attendees.includes(name)
      ? attendees.filter((attendee) => attendee !== name)
      : [...attendees, name];
  };

  const handleSave = () => {
    if (
      !form.title ||
      !form.roomId ||
      !form.date ||
      !form.startTime ||
      !form.endTime
    ) {
      return;
    }

    const booking: Booking = {
      id: snapshot.editBooking?.id ?? `b${Date.now()}`,
      roomId: form.roomId,
      title: form.title,
      organizer: CURRENT_USER,
      attendees: [...form.attendees],
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      notes: form.notes || undefined,
    };

    onSave(booking);

    RoomStoreActions.closeForm();
  };

  console.log(snapshot, "Snapshot");

  return (
    <Dialog
      open={snapshot.formOpen}
      onOpenChange={(open) => {
        if (!open) {
          RoomStoreActions.closeForm();
        }
      }}
    >
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Booking" : "New Booking"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Meeting Title */}
          <div className="grid gap-1.5">
            <Label htmlFor="title">Meeting Title</Label>

            <Input
              id="title"
              placeholder="e.g. Sprint Planning"
              value={form.title}
              onChange={(e) => {
                RoomsStore.bookingForm.title = e.target.value;
              }}
            />
          </div>

          {/* Room */}
          <div className="grid gap-1.5">
            <Label>Room</Label>

            <Select
              value={form.roomId}
              onValueChange={(value) => {
                RoomsStore.bookingForm.roomId = value;
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>

              <SelectContent>
                {ROOMS.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} — Floor {room.floor}, {room.capacity} seats
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="grid gap-1.5">
            <Label htmlFor="date">Date</Label>

            <Input
              id="date"
              type="date"
              value={form.date}
              min={today}
              onChange={(e) => {
                RoomsStore.bookingForm.date = e.target.value;
              }}
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            {/* Start Time */}
            <div className="grid gap-1.5">
              <Label>Start Time</Label>

              <Select
                value={form.startTime}
                onValueChange={(value) => {
                  RoomsStore.bookingForm.startTime = value;
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="max-h-48">
                  {TIMES.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* End Time */}
            <div className="grid gap-1.5">
              <Label>End Time</Label>

              <Select
                value={form.endTime}
                onValueChange={(value) => {
                  RoomsStore.bookingForm.endTime = value;
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="max-h-48">
                  {TIMES.filter((time) => time > form.startTime).map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attendees */}
          <div className="grid gap-1.5">
            <Label>Attendees</Label>

            <div className="flex flex-wrap gap-1.5">
              {EMPLOYEES.filter((employee) => employee !== CURRENT_USER).map(
                (employee) => {
                  const selected = form.attendees.includes(employee);

                  return (
                    <button
                      key={employee}
                      type="button"
                      onClick={() => toggleAttendee(employee)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                        selected
                          ? "bg-primary/20 border-primary/40 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {employee}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="grid gap-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>

            <Textarea
              id="notes"
              placeholder="Any additional details..."
              value={form.notes}
              onChange={(e) => {
                RoomsStore.bookingForm.notes = e.target.value;
              }}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={RoomStoreActions.closeForm}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={!form.title || !form.roomId || !form.date}
          >
            {isEditing ? "Save Changes" : "Book Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
