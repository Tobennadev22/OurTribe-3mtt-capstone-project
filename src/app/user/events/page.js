"use client";

import { useState } from "react";
import { CalendarDays, Clock, MapPin, Eye, Archive } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UserEvents() {
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/events");

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch events");
      }

      setEventList(data);
    } catch (error) {
      console.error("FETCH EVENTS ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleView(event) {
    setSelectedEvent(event);
    setViewOpen(true);
  }

  async function handleArchive(id) {
    try {
      const response = await fetch(`/api/events/${id}/archive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to archive event");
      }

      setEventList((previous) =>
        previous.map((event) =>
          event.id === id
            ? {
                ...event,
                archived: true,
              }
            : event,
        ),
      );
    } catch (error) {
      console.error("ARCHIVE EVENT ERROR:", error);

      setError(error.message);
    }
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
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

  const upcomingEvents = eventList.filter((event) => !event.archived);

  const archivedEvents = eventList.filter((event) => event.archived);

  return (
    <div className="p-6">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Events</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Discover upcoming events and activities happening within OurTribe.
        </p>
      </div>

      {/* UPCOMING EVENTS */}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>

          <p className="text-sm text-muted-foreground">
            Events happening soon.
          </p>
        </div>

        {upcomingEvents.length === 0 ? (
          <Card>
            <CardContent className="flex h-40 items-center justify-center">
              <div className="text-center">
                <CalendarDays className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                <p className="text-sm text-muted-foreground">
                  There are no upcoming events.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onView={handleView}
                onArchive={handleArchive}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}
      </section>

      {/* ARCHIVED EVENTS */}

      <section className="mt-12">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Archived Events</h2>

          <p className="text-sm text-muted-foreground">
            Events you have archived.
          </p>
        </div>

        {archivedEvents.length === 0 ? (
          <Card>
            <CardContent className="flex h-32 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                You haven't archived any events.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {archivedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onView={handleView}
                formatDate={formatDate}
                formatTime={formatTime}
                archived
              />
            ))}
          </div>
        )}
      </section>

      {/* VIEW EVENT */}

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>

                <DialogDescription>Event details</DialogDescription>
              </DialogHeader>

              {selectedEvent.image ? (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="h-56 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center rounded-lg bg-muted">
                  <CalendarDays className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              <div className="space-y-5">
                <p className="text-sm leading-6 text-muted-foreground">
                  {selectedEvent.description}
                </p>

                <div className="space-y-4">
                  {/* DATE */}

                  <div className="flex gap-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="text-sm font-medium">Date</p>

                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedEvent.eventDate)}
                      </p>
                    </div>
                  </div>

                  {/* TIME */}

                  <div className="flex gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="text-sm font-medium">Time</p>

                      <p className="text-sm text-muted-foreground">
                        {formatTime(selectedEvent.startTime)} –{" "}
                        {formatTime(selectedEvent.endTime)}
                      </p>
                    </div>
                  </div>

                  {/* LOCATION */}

                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="text-sm font-medium">Location</p>

                      <p className="text-sm text-muted-foreground">
                        {selectedEvent.location || "Location not specified"}
                      </p>
                    </div>
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
   EVENT CARD
===================================================== */

function EventCard({
  eventList,
  onView,
  onArchive,
  formatDate,
  formatTime,
  archived = false,
}) {
  return (
    <Card className="overflow-hidden">
      {/* IMAGE */}

      {eventList.image ? (
        <img
          src={eventList.image}
          alt={eventList.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-muted">
          <CalendarDays className="h-12 w-12 text-muted-foreground" />
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-base">{eventList.title}</CardTitle>

        <CardDescription className="line-clamp-2">
          {eventList.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* DATE */}

        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />

          <span>{formatDate(eventList.eventDate)}</span>
        </div>

        {/* TIME */}

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />

          <span>
            {formatTime(eventList.startTime)} – {formatTime(eventList.endTime)}
          </span>
        </div>

        {/* LOCATION */}

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />

          <span>{eventList.location || "Location not specified"}</span>
        </div>

        {/* ACTIONS */}

        <div className="flex gap-2 border-t pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onView(eventList)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>

          {!archived && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onArchive(eventList.id)}
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
