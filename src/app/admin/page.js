// import { EllipsisVertical } from "lucide-react";

// import { Separator } from "@/components/ui/separator";

// import { TableUi } from "@/components/table";
// import StatCard from "@/components/admincard";
// import DashboardHeaders from "@/components/dashboardheaders";
// import { ModeToggle } from "@/components/mode-toggle";
// import UpcomingEventCard from "@/components/upcomingeventcard";
// import AnnouncementCard from "@/components/annoucementcard";

// const recentReg = [
//   {
//     ID: 1,
//     firstName: "John",
//     lastName: "Deo",
//     phone_Number: 2348098987890,
//     email: "johndoe@gmail.com",
//     dateRegistered: "22/2/2026",
//   },
//   {
//     ID: 2,
//     firstName: "John",
//     lastName: "Deo",
//     phone_Number: 2348098987890,
//     email: "johndoe@gmail.com",
//     dateRegistered: "22/2/2026",
//   },
//   {
//     ID: 3,
//     firstName: "John",
//     lastName: "Deo",
//     phone_Number: 2348098987890,
//     email: "johndoe@gmail.com",
//     dateRegistered: "22/2/2026",
//   },
//   {
//     ID: 4,
//     firstName: "John",
//     lastName: "Deo",
//     phone_Number: 2348098987890,
//     email: "johndoe@gmail.com",
//     dateRegistered: "22/2/2026",
//   },
//   {
//     ID: 5,
//     firstName: "John",
//     lastName: "Deo",
//     phone_Number: 2348098987890,
//     email: "johndoe@gmail.com",
//     dateRegistered: "22/2/2026",
//   },
// ];

// export default function Dashboard() {
//   return (
//     <div className="p-6">
//       <DashboardHeaders
//         title="Dashboard"
//         description="Welcome to your dashboard"
//         // ModeToggle={ModeToggle}
//       />

//       <Separator />
//       <StatCard />
//       <div className="flex gap-4">
//         <UpcomingEventCard />
//         <AnnouncementCard />
//       </div>
//       <TableUi data={recentReg} />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";

import { TableUi } from "@/components/table";
import StatCard from "@/components/admincard";
import DashboardHeaders from "@/components/dashboardheaders";
import { ModeToggle } from "@/components/mode-toggle";
import UpcomingEventCard from "@/components/upcomingeventcard";
import AnnouncementCard from "@/components/annoucementcard";

export default function Dashboard() {
  const [recentReg, setRecentReg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecentRegistrations();
  }, []);

  async function fetchRecentRegistrations() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/users/recent", {
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
        throw new Error(data.message || "Failed to fetch registrations");
      }

      // Map to the shape TableUi expects
      const formatted = data.map((user, index) => ({
        ID: index + 1,
        firstName: user.firstName,
        lastName: user.lastName,
        phone_Number: user.phone,
        email: user.email,
        dateRegistered: new Date(user.createdAt).toLocaleDateString("en-GB"),
      }));

      setRecentReg(formatted);
    } catch (error) {
      console.error("FETCH RECENT REGISTRATIONS ERROR:", error);
      setError(error.message || "Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <DashboardHeaders
        title="Dashboard"
        description="Welcome to your dashboard"
        // ModeToggle={ModeToggle}
      />

      <Separator />
      <StatCard />
      <div className="flex gap-4">
        <UpcomingEventCard />
        <AnnouncementCard />
      </div>

      {/* {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )} */}
      {/* 
      {loading ? (
        <div className="mt-6 flex h-32 items-center justify-center rounded-lg border">
          <p className="text-sm text-muted-foreground">
            Loading recent registrations...
          </p>
        </div>
      ) : (
        <TableUi data={recentReg} />
      )} */}
    </div>
  );
}
