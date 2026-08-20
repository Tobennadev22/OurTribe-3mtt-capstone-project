"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

export default function AnnouncementView() {
  const params = useParams();
  const router = useRouter();

  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnnouncement() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/announcements/${params.id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch announcement");
        }

        setAnnouncement(data);
      } catch (error) {
        console.error("FETCH ANNOUNCEMENT ERROR:", error);

        setError(error.message || "Failed to fetch announcement");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchAnnouncement();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Loading announcement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="p-6">
        <p>Announcement not found.</p>
      </div>
    );
  }

  const createdBy =
    announcement.createdBy?.firstName || announcement.createdBy?.lastName
      ? `${announcement.createdBy?.firstName || ""} ${
          announcement.createdBy?.lastName || ""
        }`.trim()
      : announcement.createdBy?.email || "Unknown";

  return (
    <div className="p-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Separator />

      <Card className="mt-8 max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl">{announcement.title}</CardTitle>

          <CardDescription>
            Created by {createdBy} •{" "}
            {new Date(announcement.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <p className="whitespace-pre-wrap text-sm leading-7">
            {announcement.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
