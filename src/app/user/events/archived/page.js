"use client";

import { useEffect, useState } from "react";

import { Archive, CalendarDays, Eye, MapPin } from "lucide-react";

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

export default function ArchivedEvents() {
  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ========================================
  // FETCH ARCHIVED EVENTS
  // ========================================

  useEffect(() => {
    fetchArchivedEvents();
  }, []);

  async function fetchArchivedEvents() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/events/archived", {
        method: "GET",
        cache: "no-store",
      });

      const text = await response.text();

      let data = [];

      try {
        data = text ? JSON.parse(text) : [];
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch archived events");
      }

      setEvents(data);
    } catch (error) {
      console.error("FETCH ARCHIVED EVENTS ERROR:", error);

      setError(error.message || "Failed to fetch archived events");
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // VIEW EVENT
  // ========================================

  async function handleView(event) {
    try {
      setError("");

      const response = await fetch(`/api/events/${event.id}`, {
        method: "GET",
        cache: "no-store",
      });

      const text = await response.text();

      let data;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch event");
      }

      setSelectedEvent(data);
      setViewOpen(true);
    } catch (error) {
      console.error("VIEW ARCHIVED EVENT ERROR:", error);

      setError(error.message || "Failed to view event");
    }
  }

  // ========================================
  // DATE
  // ========================================

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Archived Events</h2>

          <p className="text-sm text-muted-foreground">
            Events you have archived.
          </p>
        </div>

        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Loading archived events...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div>
        {/* HEADER */}

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Archive className="h-5 w-5 text-muted-foreground" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Archived Events</h2>

              <p className="text-sm text-muted-foreground">
                Events you have archived.
              </p>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}

        {events.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-56 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Archive className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="font-medium">No archived events</h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Events you archive will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* EVENTS */

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                {/* IMAGE */}

                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-48 w-full object-cover grayscale"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-muted">
                    <CalendarDays className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{event.title}</CardTitle>

                      <CardDescription className="mt-1 line-clamp-2">
                        {event.description}
                      </CardDescription>
                    </div>

                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      Archived
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    {/* DATE */}

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />

                      <span>{formatDate(event.eventDate)}</span>
                    </div>

                    {/* TIME */}

                    <div className="text-muted-foreground">
                      {event.startTime} – {event.endTime}
                    </div>

                    {/* LOCATION */}

                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />

                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* VIEW */}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleView(event)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Event
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ======================================
          VIEW EVENT
      ======================================= */}

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>

                <DialogDescription>Archived event details</DialogDescription>
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

              <div className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {selectedEvent.description}
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="font-medium">Date</p>

                      <p className="text-muted-foreground">
                        {formatDate(selectedEvent.eventDate)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Time</p>

                    <p className="text-muted-foreground">
                      {selectedEvent.startTime} – {selectedEvent.endTime}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="font-medium">Location</p>

                      <p className="text-muted-foreground">
                        {selectedEvent.location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {selectedEvent.createdBy && (
                    <div className="border-t pt-3">
                      <p className="text-xs text-muted-foreground">
                        Created by
                      </p>

                      <p className="text-sm font-medium">
                        {selectedEvent.createdBy.firstName}{" "}
                        {selectedEvent.createdBy.lastName}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
