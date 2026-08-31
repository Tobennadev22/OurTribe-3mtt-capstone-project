// "use client";

// import { useEffect, useState } from "react";

// import { Archive, CalendarDays, Eye, MapPin } from "lucide-react";

// import { Button } from "@/components/ui/button";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// export default function MemberEvents() {
//   // const [events, setEvents] = useState([]);

//   const [selectedEvent, setSelectedEvent] = useState(null);

//   const [viewOpen, setViewOpen] = useState(false);

//   const [eventList, setEventList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // const { data: session, status } = useSession();

//   const [eventError, setEventError] = useState("");

//   // =======================================
//   // FETCH EVENTS
//   // ========================================

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   async function fetchEvents() {
//     try {
//       setLoading(true);
//       setEventError("");

//       const response = await fetch("/api/events", {
//         method: "GET",
//         cache: "no-store",
//       });

//       const text = await response.text();

//       let data = [];

//       if (text) {
//         data = JSON.parse(text);
//       }

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to fetch events");
//       }

//       setEventList(data);
//     } catch (error) {
//       console.error("FETCH EVENTS ERROR:", error);
//       setEventError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Temporary UI data.
//   // API connection comes next.

//   function formatDate(date) {
//     if (!date) return "—";

//     return new Date(date).toLocaleDateString("en-US", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   }

//   function handleView(event) {
//     setSelectedEvent(event);
//     setViewOpen(true);
//   }

//   function handleArchive(event) {
//     console.log("ARCHIVE EVENT:", event.id);

//     // API connection comes next.
//   }

//   return (
//     <>
//       <div>
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold">Events</h2>

//           <p className="text-sm text-muted-foreground">
//             Stay updated with upcoming OurTribe events.
//           </p>
//         </div>

//         {eventList.length === 0 ? (
//           <Card>
//             <CardContent className="flex h-40 items-center justify-center">
//               <p className="text-sm text-muted-foreground">
//                 No events available.
//               </p>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//             {eventList.map((event) => (
//               <Card key={event.id} className="overflow-hidden">
//                 {event.image ? (
//                   <img
//                     src={event.image}
//                     alt={event.title}
//                     className="h-48 w-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-48 items-center justify-center bg-muted">
//                     <CalendarDays className="h-12 w-12 text-muted-foreground" />
//                   </div>
//                 )}

//                 <CardHeader>
//                   <CardTitle className="text-base">{event.title}</CardTitle>

//                   <CardDescription>{event.description}</CardDescription>
//                 </CardHeader>

//                 <CardContent className="space-y-4">
//                   <div className="space-y-2 text-sm">
//                     <div className="flex items-center gap-2">
//                       <CalendarDays className="h-4 w-4 text-muted-foreground" />

//                       <span>{formatDate(event.eventDate)}</span>
//                     </div>

//                     <div className="text-muted-foreground">
//                       {event.startTime} – {event.endTime}
//                     </div>

//                     {event.location && (
//                       <div className="flex items-center gap-2">
//                         <MapPin className="h-4 w-4 text-muted-foreground" />

//                         <span>{event.location}</span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       className="flex-1"
//                       onClick={() => handleView(event)}
//                     >
//                       <Eye className="mr-2 h-4 w-4" />
//                       View
//                     </Button>

//                     <Button
//                       variant="outline"
//                       onClick={() => handleArchive(event)}
//                     >
//                       <Archive className="mr-2 h-4 w-4" />
//                       Archive
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* VIEW EVENT */}

//       <Dialog open={viewOpen} onOpenChange={setViewOpen}>
//         <DialogContent className="sm:max-w-lg">
//           {selectedEvent && (
//             <>
//               <DialogHeader>
//                 <DialogTitle>{selectedEvent.title}</DialogTitle>

//                 <DialogDescription>Event details</DialogDescription>
//               </DialogHeader>

//               {selectedEvent.image && (
//                 <img
//                   src={selectedEvent.image}
//                   alt={selectedEvent.title}
//                   className="h-56 w-full rounded-lg object-cover"
//                 />
//               )}

//               <div className="space-y-4">
//                 <p className="text-sm text-muted-foreground">
//                   {selectedEvent.description}
//                 </p>

//                 <div className="space-y-2 text-sm">
//                   <p>
//                     <strong>Date:</strong> {formatDate(selectedEvent.eventDate)}
//                   </p>

//                   <p>
//                     <strong>Time:</strong> {selectedEvent.startTime} –{" "}
//                     {selectedEvent.endTime}
//                   </p>

//                   <p>
//                     <strong>Location:</strong>{" "}
//                     {selectedEvent.location || "Not specified"}
//                   </p>
//                 </div>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MemberEvents() {
  const [eventList, setEventList] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [eventError, setEventError] = useState("");

  const [archivingId, setArchivingId] = useState(null);

  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [eventToArchive, setEventToArchive] = useState(null);

  // ========================================
  // FETCH EVENTS
  // ========================================

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      setEventError("");

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

      setEventList(data);
    } catch (error) {
      console.error("FETCH EVENTS ERROR:", error);

      setEventError(error.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // VIEW EVENT
  // ========================================

  async function handleView(event) {
    try {
      setEventError("");

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
      console.error("VIEW EVENT ERROR:", error);

      setEventError(error.message || "Failed to view event");
    }
  }

  // ========================================
  // ARCHIVE EVENT
  // ========================================

  function handleArchiveClick(event) {
    setEventToArchive(event);
    setArchiveConfirmOpen(true);
  }

  async function confirmArchive() {
    if (!eventToArchive) {
      return;
    }

    const event = eventToArchive;

    try {
      setArchivingId(event.id);
      setEventError("");

      const response = await fetch(`/api/events/${event.id}/archive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to archive event");
      }

      // Remove it from the active list entirely
      setEventList((previous) =>
        previous.filter((item) => item.id !== event.id),
      );

      setArchiveConfirmOpen(false);
      setEventToArchive(null);
    } catch (error) {
      console.error("ARCHIVE EVENT ERROR:", error);
      setEventError(error.message || "Failed to archive event");
    } finally {
      setArchivingId(null);
    }
  }

  // ========================================
  // DATE FORMAT
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
          <h2 className="text-xl font-semibold">Events</h2>

          <p className="text-sm text-muted-foreground">
            Stay updated with upcoming OurTribe events.
          </p>
        </div>

        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading events...</p>
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
          <h2 className="text-xl font-semibold">Events</h2>

          <p className="text-sm text-muted-foreground">
            Stay updated with upcoming OurTribe events.
          </p>
        </div>

        {/* ERROR */}

        {eventError && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {eventError}
          </div>
        )}

        {/* EVENTS */}

        {eventList.length === 0 ? (
          <Card>
            <CardContent className="flex h-40 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No events available.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {eventList.map((event) => (
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

                {/* HEADER */}

                <CardHeader>
                  <CardTitle className="text-base">{event.title}</CardTitle>

                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>

                {/* CONTENT */}

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    {/* DATE */}

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />

                      <span>{formatDate(event.eventDate)}</span>
                    </div>

                    {/* TIME */}

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>
                        {event.startTime} – {event.endTime}
                      </span>
                    </div>

                    {/* LOCATION */}

                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />

                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-2">
                    {/* VIEW */}

                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleView(event)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>

                    {/* ARCHIVE */}

                    {!event.archived && (
                      <Button
                        variant="outline"
                        onClick={() => handleArchiveClick(event)}
                        disabled={archivingId === event.id}
                      >
                        <Archive className="mr-2 h-4 w-4" />

                        {archivingId === event.id ? "Archiving..." : "Archive"}
                      </Button>
                    )}

                    {/* ALREADY ARCHIVED */}

                    {event.archived && (
                      <Button variant="secondary" disabled>
                        Archived
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ======================================
          VIEW EVENT DIALOG
      ======================================= */}

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>

                <DialogDescription>Event details</DialogDescription>
              </DialogHeader>

              {/* IMAGE */}

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

              {/* DETAILS */}

              <div className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {selectedEvent.description}
                </p>

                <div className="space-y-3 text-sm">
                  {/* DATE */}

                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="font-medium">Date</p>

                      <p className="text-muted-foreground">
                        {formatDate(selectedEvent.eventDate)}
                      </p>
                    </div>
                  </div>

                  {/* TIME */}

                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 text-muted-foreground">
                      <span className="text-xs">🕐</span>
                    </div>

                    <div>
                      <p className="font-medium">Time</p>

                      <p className="text-muted-foreground">
                        {selectedEvent.startTime} – {selectedEvent.endTime}
                      </p>
                    </div>
                  </div>

                  {/* LOCATION */}

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="font-medium">Location</p>

                      <p className="text-muted-foreground">
                        {selectedEvent.location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* CREATED BY */}

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

      {/* ======================================
          ARCHIVE CONFIRMATION
      ======================================= */}

      <AlertDialog
        open={archiveConfirmOpen}
        onOpenChange={setArchiveConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive event?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to archive{" "}
              <span className="font-medium text-foreground">
                {eventToArchive?.title}
              </span>
              ? You can still view it from Archived Events afterwards.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={archivingId === eventToArchive?.id}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              type="button"
              disabled={archivingId === eventToArchive?.id}
              onClick={confirmArchive}
            >
              {archivingId === eventToArchive?.id ? "Archiving..." : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
