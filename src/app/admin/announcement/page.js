"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardHeader } from "@/components/dashboardheaders";

import { Plus, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

export default function AnnouncementPage() {
  // ========================================
  // ANNOUNCEMENTS
  // ========================================

  const [announcements, setAnnouncements] = useState([]);

  // ========================================
  // CREATE FORM
  // ========================================

  const [createOpen, setCreateOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // ========================================
  // DELETE
  // ========================================

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // ========================================
  // STATES
  // ========================================

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!success && !error) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [success, error]);

  // ========================================
  // FETCH ANNOUNCEMENTS
  // ========================================

  async function fetchAnnouncements() {
    try {
      setFetching(true);
      setError("");

      const response = await fetch("/api/announcements");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch announcements");
      }

      console.log(data);

      setAnnouncements(data);
    } catch (error) {
      console.error("FETCH ANNOUNCEMENTS:", error);
      setError(error.message);
    } finally {
      setFetching(false);
    }
  }

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ========================================
  // CREATE ANNOUNCEMENT
  // ========================================

  async function handleCreateAnnouncement(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/announcements", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create announcement");
      }

      // Reset form
      setTitle("");
      setDescription("");

      // Close modal
      setCreateOpen(false);

      // Refresh table
      await fetchAnnouncements();

      setSuccess("Announcement created successfully.");
    } catch (error) {
      console.error("CREATE ANNOUNCEMENT:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // DELETE ANNOUNCEMENT
  // ========================================

  async function handleDelete() {
    if (!selectedAnnouncement?.id) {
      console.log("No announcement selected");
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess("");

    console.log("Deleting announcement:", selectedAnnouncement.id);

    try {
      const response = await fetch(
        `/api/announcements/${selectedAnnouncement.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      console.log("Delete response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete announcement");
      }

      // Remove it immediately from the table
      setAnnouncements((current) =>
        current.filter(
          (announcement) => announcement.id !== selectedAnnouncement.id,
        ),
      );

      // Close dialog
      setDeleteOpen(false);

      // Clear selected announcement
      setSelectedAnnouncement(null);

      setSuccess("Announcement deleted successfully.");
    } catch (error) {
      console.error("DELETE ERROR:", error);
      setError(error.message);
    } finally {
      setDeleting(false);
    }
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ==================================
            PAGE HEADER
        ================================== */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Announcements</h1>

            <p className="text-sm text-muted-foreground">
              Create and manage announcements for members.
            </p>
          </div>

          {/* CREATE BUTTON */}

          <Button
            onClick={() => {
              setError("");
              setCreateOpen(true);
            }}
            className="bg-lime-700 hover:bg-lime-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Announcement
          </Button>
        </div>

        {/* ==================================
            SUCCESS MESSAGE
        ================================== */}

        {success && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* ==================================
            ERROR MESSAGE
        ================================== */}

        {error && !createOpen && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ==================================
            ANNOUNCEMENTS TABLE
        ================================== */}

        <Card>
          <CardHeader>
            <CardTitle>All Announcements</CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>

                  <TableHead>Created By</TableHead>

                  <TableHead>Date</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* LOADING */}

                {fetching && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading announcements...
                    </TableCell>
                  </TableRow>
                )}

                {/* EMPTY */}

                {!fetching && announcements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <p className="font-medium">No announcements yet</p>

                        <p className="text-sm text-muted-foreground">
                          Create your first announcement using the button above.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* DATA */}

                {!fetching &&
                  announcements.length > 0 &&
                  announcements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      {/* TITLE */}

                      <TableCell className="font-medium">
                        {announcement.title}
                      </TableCell>

                      {/* CREATED BY */}

                      <TableCell>
                        {announcement.createdBy
                          ? `${announcement.createdBy.firstName} ${announcement.createdBy.lastName}`
                          : "Unknown"}
                      </TableCell>

                      {/* DATE */}

                      <TableCell>
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </TableCell>

                      {/* ACTIONS */}

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />

                              <span className="sr-only">
                                Open announcement actions
                              </span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            {/* VIEW */}

                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/announcement/${announcement.id}`}
                              >
                                {/* <Eye className="mr-2 h-4 w-4" /> */}
                                View
                              </Link>
                            </DropdownMenuItem>

                            {/* EDIT */}

                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/announcement/${announcement.id}/edit`}
                              >
                                {/* <Pencil className="mr-2 h-4 w-4" /> */}
                                Edit
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* DELETE */}

                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => {
                                setSelectedAnnouncement(announcement);
                                setDeleteOpen(true);
                              }}
                            >
                              {/* <Trash2 className="mr-2 h-4 w-4" /> */}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ==================================
            CREATE MODAL
        ================================== */}

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>

              <DialogDescription>
                Create an announcement that will be visible to OurTribe members.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateAnnouncement} className="space-y-5">
              {/* TITLE */}

              <div className="space-y-2">
                <Label htmlFor="announcement-title">Title</Label>

                <Input
                  id="announcement-title"
                  placeholder="Enter announcement title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div className="space-y-2">
                <Label htmlFor="announcement-description">Description</Label>

                <Textarea
                  id="announcement-description"
                  placeholder="Write your announcement..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-[140px] resize-none"
                  required
                />
              </div>

              {/* ERROR */}

              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* FOOTER */}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-lime-700 hover:bg-lime-600"
                >
                  {loading ? "Creating..." : "Create Announcement"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ==================================
            DELETE CONFIRMATION
        ================================== */}

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete announcement?</AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  {selectedAnnouncement?.title}
                </span>
                ?
                <br />
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

              <AlertDialogAction
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Delete Announcement"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
