"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function UpcomingEventCard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  async function fetchUpcomingEvents() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/events", {
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
        throw new Error(data.message || "Failed to fetch events");
      }

      // Only future events, soonest first, top 3
      const now = new Date();

      const upcoming = data
        .filter((event) => new Date(event.eventDate) >= now)
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
        .slice(0, 3);

      setEvents(upcoming);
    } catch (error) {
      console.error("FETCH UPCOMING EVENTS ERROR:", error);
      setError(error.message || "Failed to fetch events");
    } finally {
      setLoading(false);
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

  return (
    <Card className="mt-8 w-2/4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Upcoming Events</CardTitle>

        <Link
          href="/admin/eventmanagement"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 text-xs">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading events...</p>
        )}

        {!loading && error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && events.length === 0 && (
          <p className="text-sm text-muted-foreground">No upcoming events.</p>
        )}

        {!loading &&
          !error &&
          events.map((event, index) => (
            <div key={event.id}>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold">{event.title}</h3>

                  <p className="text-sm text-muted-foreground">
                    {event.location || "Location not specified"}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(event.eventDate)}
                  </p>
                </div>
              </div>

              {index !== events.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
