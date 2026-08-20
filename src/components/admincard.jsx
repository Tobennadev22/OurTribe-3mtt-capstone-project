// import { User, Calendar1, Megaphone } from "lucide-react";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";

// const items = [
//   {
//     numeric: 10,
//     description: "All Members",
//     icon: User,
//   },
//   {
//     numeric: 0,
//     description: "Upcoming Events",
//     icon: Calendar1,
//   },

//   {
//     numeric: 4,
//     description: "Announcements",
//     icon: Megaphone,
//   },
// ];

// const StatCard = () => {
//   return (
//     <div className=" flex flex-row  gap-4 mt-4">
//       {items.map((item, index) => (
//         <Card className="w-1/3" key={index}>
//           <item.icon className="w-8 h-8 ml-4" />
//           <CardContent>{item.description}</CardContent>
//           <CardHeader className="text-4xl font-bold">{item.numeric}</CardHeader>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default StatCard;

"use client";

import { useEffect, useState } from "react";
import { User, Calendar1, Megaphone } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const statConfig = [
  {
    key: "totalMembers",
    description: "All Members",
    icon: User,
  },
  {
    key: "upcomingEvents",
    description: "Upcoming Events",
    icon: Calendar1,
  },
  {
    key: "totalAnnouncements",
    description: "Announcements",
    icon: Megaphone,
  },
];

const StatCard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/stats", {
        method: "GET",
        cache: "no-store",
      });

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch stats");
      }

      setStats(data);
    } catch (error) {
      console.error("FETCH STATS ERROR:", error);
      setError(error.message || "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-row gap-4 mt-4">
      {statConfig.map((item) => (
        <Card className="w-1/3" key={item.key}>
          <item.icon className="w-8 h-8 ml-4" />
          <CardContent>{item.description}</CardContent>
          <CardHeader className="text-4xl font-bold">
            {loading ? "—" : error ? "—" : (stats?.[item.key] ?? 0)}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default StatCard;
