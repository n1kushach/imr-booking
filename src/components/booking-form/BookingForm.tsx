import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useForm } from "@tanstack/react-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

import { ROOMS, EMPLOYEES, CURRENT_USER, TIMES } from "../../data/mockData";

import { useSnapshot } from "valtio";
import {
  bookingFormDefault,
  BookingsStore,
  BookingStoreActions,
} from "@/store/Bookings.store";
import { bookingSchema } from "@/schemas/booking.schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { useEffect } from "react";

const BookingForm = () => {
  const form = useForm({
    defaultValues: bookingFormDefault,
    validators: {
      onChange: bookingSchema,
      onSubmit: bookingSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing && snapshot.editBooking?.id) {
        const result = BookingStoreActions.editBooking(
          snapshot.editBooking.id,
          value,
        );

        if (!result.success) {
          toast.error("Booking update failed", {
            description: result.error,
          });
          return;
        }

        toast.success("Booking updated", {
          description: `Your booking "${value.title}" was updated successfully!`,
        });
      } else {
        const result = BookingStoreActions.createBooking(value);

        if (!result.success) {
          toast.error("Booking failed", {
            description: result.error,
          });
          return;
        }

        toast.success("Booking created", {
          description: `Your booking for ${value.title} was created successfully!`,
        });
      }

      BookingStoreActions.closeForm();
      form.reset(bookingFormDefault);
    },
  });

  const snapshot = useSnapshot(BookingsStore) as typeof BookingsStore;
  const today = new Date().toISOString().split("T")[0];
  const isEditing = !!snapshot.editBooking?.id;

  useEffect(() => {
    if (!snapshot.formOpen) return;

    if (snapshot.editBooking) {
      form.reset({
        title: snapshot.editBooking.title,
        roomId: snapshot.editBooking.roomId,
        date: snapshot.editBooking.date,
        startTime: snapshot.editBooking.startTime,
        endTime: snapshot.editBooking.endTime,
        attendees: [...snapshot.editBooking.attendees],
        notes: snapshot.editBooking.notes,
      });
    } else {
      form.reset({
        ...bookingFormDefault,
        roomId: snapshot.preselectedRoom ? snapshot.preselectedRoom.id : "",
        date: snapshot.preselectedDate ? snapshot.preselectedDate : "",
      });
    }
  }, [
    snapshot.formOpen,
    snapshot.editBooking,
    form,
    snapshot.preselectedRoom,
    snapshot.preselectedDate,
  ]);

  return (
    <Dialog
      open={snapshot.formOpen}
      onOpenChange={(open) => {
        if (!open) {
          BookingStoreActions.closeForm();
          form.reset();
        }
      }}
    >
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Booking" : "New Booking"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="grid gap-4 py-2">
            <FieldGroup>
              <div className="grid gap-1.5">
                <form.Field
                  name="title"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Meeting Title
                        </FieldLabel>
                        <Input
                          className="bg-card border border-slate-500!"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          placeholder="e.g. Sprint Planning"
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>

              <div className="grid gap-1.5">
                <form.Field
                  name="roomId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>Room</FieldLabel>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger
                            className="bg-card border border-slate-500!"
                            aria-invalid={isInvalid}
                          >
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                          <SelectContent className="bg-black">
                            {ROOMS.map((room) => (
                              <SelectItem key={room.id} value={room.id}>
                                {room.name} — Floor {room.floor},{" "}
                                {room.capacity} seats
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                ></form.Field>
              </div>

              <div className="grid gap-1.5">
                <form.Field
                  name="date"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                        <Input
                          className="bg-card border border-slate-500!"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          type="date"
                          onClick={(e) => {
                            e.currentTarget.showPicker?.();
                          }}
                          min={today}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                ></form.Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <form.Field
                    name="startTime"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel>Start Time</FieldLabel>
                          <Select
                            name={field.name}
                            value={field.state.value}
                            onValueChange={field.handleChange}
                          >
                            <SelectTrigger
                              className="bg-card border border-slate-500!"
                              aria-invalid={isInvalid}
                            >
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent className="max-h-48 bg-black">
                              {TIMES.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  ></form.Field>
                </div>

                <div className="grid gap-1.5">
                  <form.Field
                    name="endTime"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      const startTime = form.getFieldValue("startTime");
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel>End Time</FieldLabel>
                          <Select
                            name={field.name}
                            value={field.state.value}
                            onValueChange={field.handleChange}
                          >
                            <SelectTrigger
                              className="bg-card border border-slate-500!"
                              aria-invalid={isInvalid}
                            >
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent className="max-h-48 bg-black">
                              {TIMES.filter((time) => time > startTime).map(
                                (time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  ></form.Field>
                </div>
              </div>

              <form.Field
                name="attendees"
                children={(field) => (
                  <div className="grid gap-1.5">
                    <FieldLabel>Attendees</FieldLabel>

                    <div className="flex flex-wrap gap-1.5">
                      {EMPLOYEES.filter(
                        (employee) => employee !== CURRENT_USER,
                      ).map((employee) => {
                        const selected = field.state.value.includes(employee);

                        return (
                          <button
                            key={employee}
                            type="button"
                            onClick={() => {
                              field.handleChange((current) =>
                                current.includes(employee)
                                  ? current.filter(
                                      (attendee) => attendee !== employee,
                                    )
                                  : [...current, employee],
                              );
                            }}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                              selected
                                ? "bg-primary/20 border-primary/40 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                            }`}
                          >
                            {employee}
                          </button>
                        );
                      })}
                    </div>

                    {field.state.meta.isTouched &&
                      !field.state.meta.isValid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                  </div>
                )}
              />

              <div className="grid gap-1.5">
                <form.Field
                  name="notes"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Notes (optional)
                        </FieldLabel>

                        <Textarea
                          className="bg-card border border-slate-500!"
                          id={field.name}
                          placeholder="Any additional details..."
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          rows={2}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                ></form.Field>
              </div>
            </FieldGroup>
          </div>
        </form>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              BookingsStore.editBooking = undefined;
              BookingStoreActions.closeForm();
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            onClick={() => {
              form.handleSubmit();
            }}
          >
            {isEditing ? "Save Changes" : "Book Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
