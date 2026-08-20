"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  EllipsisVertical,
  MapPin,
  Plus,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import DashboardHeaders from "@/components/dashboardheaders";
import { ModeToggle } from "@/components/mode-toggle";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const emptyForm = {
  title: "",
  description: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  location: "",
  image: "",
};

export default function AdminEvents() {
  // Single source of truth for the events list.
  // (Previously there were two separate state vars — `events` and
  // `eventList` — which caused freshly-fetched events to never render.)
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/events", {
        method: "GET",
        cache: "no-store",
      });

      const text = await response.text();

      let data = [];

      if (text) {
        data = JSON.parse(text);
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch events");
      }

      setEvents(data);
    } catch (error) {
      console.error("FETCH EVENTS ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setFormData(emptyForm);
  }

  function openCreate() {
    resetForm();
    setCreateOpen(true);
  }

  async function handleCreate() {
    try {
      if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.eventDate ||
        !formData.startTime ||
        !formData.endTime
      ) {
        setError("Please complete all required fields.");
        return;
      }

      setError("");

      const response = await fetch("/api/events", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      setEvents((previous) => [data.event, ...previous]);

      setCreateOpen(false);

      resetForm();
    } catch (error) {
      console.error("CREATE EVENT ERROR:", error);

      setError(error.message);
    }
  }

  function openView(event) {
    setSelectedEvent(event);
    setViewOpen(true);
  }

  function openEdit(event) {
    setSelectedEvent(event);

    setFormData({
      title: event.title || "",
      description: event.description || "",

      eventDate: event.eventDate
        ? new Date(event.eventDate).toISOString().split("T")[0]
        : "",

      startTime: event.startTime || "",
      endTime: event.endTime || "",
      location: event.location || "",
      image: event.image || "",
    });

    setEditOpen(true);
  }

  async function handleUpdate() {
    try {
      if (!selectedEvent?.id) return;

      setError("");

      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update event");
      }

      setEvents((previous) =>
        previous.map((event) =>
          event.id === selectedEvent.id ? data.event : event,
        ),
      );

      setEditOpen(false);
      setSelectedEvent(null);

      resetForm();
    } catch (error) {
      console.error("UPDATE EVENT ERROR:", error);

      setError(error.message);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event");
      }

      setEvents((previous) => previous.filter((event) => event.id !== id));
    } catch (error) {
      console.error("DELETE EVENT ERROR:", error);

      setError(error.message);
    }
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(time) {
    if (!time) return "—";

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="p-6">
      <DashboardHeaders
        title="Events"
        description="Create and manage events for OurTribe members."
      />

      <Separator />
      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* PAGE HEADER */}

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">All Events</h2>

          <p className="text-sm text-muted-foreground">
            Manage upcoming and archived events.
          </p>
        </div>

        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {loading && (
        <div className="mt-8 flex h-32 items-center justify-center rounded-lg border">
          <p className="text-sm text-muted-foreground">Loading events...</p>
        </div>
      )}

      {/* EVENTS */}

      {!loading && events.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="flex h-40 items-center justify-center">
            <div className="text-center">
              <CalendarDays className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                No events created yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              {/* IMAGE */}

              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-muted">
                  <CalendarDays className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base">
                      {event.title}
                    </CardTitle>

                    <CardDescription className="mt-1 line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </div>

                  {/* ACTION MENU */}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openView(event)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => openEdit(event)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />

                  <span>{formatDate(event.eventDate)}</span>
                </div>

                <div className="text-sm text-muted-foreground">
                  {formatTime(event.startTime)} – {formatTime(event.endTime)}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />

                  <span>{event.location}</span>
                </div>

                <div className="border-t pt-3 text-xs text-muted-foreground">
                  Created by {event.createdBy?.firstName || "Unknown"}{" "}
                  {event.createdBy?.lastName || ""}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE EVENT */}

      <EventFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Event"
        description="Create a new event for OurTribe members."
        formData={formData}
        onChange={handleChange}
        onSubmit={handleCreate}
        submitText="Create Event"
        onCancel={resetForm}
      />

      {/* EDIT EVENT */}

      <EventFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Event"
        description="Update the event information."
        formData={formData}
        onChange={handleChange}
        onSubmit={handleUpdate}
        submitText="Save Changes"
        onCancel={resetForm}
      />

      {/* VIEW EVENT */}

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>

                <DialogDescription>Event details</DialogDescription>
              </DialogHeader>

              {selectedEvent.image && (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="h-56 w-full rounded-lg object-cover"
                />
              )}

              <div className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {selectedEvent.description}
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="font-medium">Date</p>

                      <p className="text-muted-foreground">
                        {formatDate(selectedEvent.eventDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="font-medium">Time</p>

                      <p className="text-muted-foreground">
                        {formatTime(selectedEvent.startTime)} –{" "}
                        {formatTime(selectedEvent.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="font-medium">Location</p>

                      <p className="text-muted-foreground">
                        {selectedEvent.location}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Created by</p>

                    <p className="text-muted-foreground">
                      {selectedEvent.createdBy?.firstName}{" "}
                      {selectedEvent.createdBy?.lastName}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =====================================================
   EVENT FORM
===================================================== */

function EventFormDialog({
  open,
  onOpenChange,
  title,
  description,
  formData,
  onChange,
  onSubmit,
  submitText,
  onCancel,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* TITLE */}

          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>

            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="OurTribe Community Hangout"
            />
          </div>

          {/* DESCRIPTION */}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Tell members about this event..."
              rows={4}
            />
          </div>

          {/* DATE */}

          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date</Label>

            <Input
              id="eventDate"
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={onChange}
            />
          </div>

          {/* TIME */}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>

              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>

              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={onChange}
              />
            </div>
          </div>

          {/* LOCATION */}

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>

            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={onChange}
              placeholder="Lagos, Nigeria"
            />
          </div>

          {/* IMAGE */}

          <div className="space-y-2">
            <Label htmlFor="image">Event Image</Label>

            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={onChange}
              placeholder="Image URL"
            />

            <p className="text-xs text-muted-foreground">
              Image upload will be connected later.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onCancel?.();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>

          <Button onClick={onSubmit}>{submitText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
