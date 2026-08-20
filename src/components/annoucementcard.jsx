// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { Megaphone, ArrowRight } from "lucide-react";
// import Link from "next/link";

// const announcements = [
//   {
//     id: 1,
//     title: "Annual General Meeting",
//     message: "The AGM has been scheduled for 20th August, 2026.",
//     status: "Important",
//   },
//   {
//     id: 2,
//     title: "Registration Deadline",
//     message: "Event registration closes on 15th August.",
//     status: "Reminder",
//   },
//   {
//     id: 3,
//     title: "System Maintenance",
//     message: "The platform will be unavailable on Sunday from 2AM–4AM.",
//     status: "Info",
//   },
// ];

// export default function AnnouncementCard() {
//   return (
//     <Card className="mt-8 w-2/4">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex text-sm items-center gap-2">
//               <Megaphone className="h-5 w-5 text-sm" />
//               Announcements
//             </CardTitle>

//             {/* <CardDescription>Latest updates for members.</CardDescription> */}
//           </div>

//           <Link
//             href="/admin/announcements"
//             className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
//           >
//             View All
//             <ArrowRight className="h-4 w-4" />
//           </Link>
//         </div>
//       </CardHeader>

//       <Separator />

//       <CardContent className="space-y-4 pt-4">
//         {announcements.slice(0, 3).map((item, index) => (
//           <div key={item.id}>
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <h3 className="font-medium">{item.title}</h3>

//                 <p className="mt-1 text-sm text-muted-foreground">
//                   {item.message}
//                 </p>
//               </div>

//               <Badge variant="secondary">{item.status}</Badge>
//             </div>

//             {index !== announcements.length - 1 && (
//               <Separator className="mt-4" />
//             )}
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Megaphone, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AnnouncementCard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/announcements", {
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
        throw new Error(data.message || "Failed to fetch announcements");
      }

      setAnnouncements(data.slice(0, 3));
    } catch (error) {
      console.error("FETCH ANNOUNCEMENTS ERROR:", error);
      setError(error.message || "Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-8 w-2/4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex text-sm items-center gap-2">
              <Megaphone className="h-5 w-5 text-sm" />
              Announcements
            </CardTitle>
          </div>

          <Link
            href="/admin/announcements"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 pt-4">
        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading announcements...
          </p>
        )}

        {!loading && error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && announcements.length === 0 && (
          <p className="text-sm text-muted-foreground">No announcements yet.</p>
        )}

        {!loading &&
          !error &&
          announcements.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{item.title}</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>

              {index !== announcements.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
