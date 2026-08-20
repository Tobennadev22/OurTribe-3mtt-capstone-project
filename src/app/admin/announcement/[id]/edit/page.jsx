// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";

// export default function EditAnnouncementPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");

//   // -----------------------------
//   // GET SINGLE ANNOUNCEMENT
//   // -----------------------------

//   useEffect(() => {
//     async function fetchAnnouncement() {
//       try {
//         const response = await fetch(`/api/announcements/${id}`);

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.error || "Failed to fetch announcement");
//         }

//         setTitle(data.title);
//         setDescription(data.description);
//       } catch (error) {
//         console.error(error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) {
//       fetchAnnouncement();
//     }
//   }, [id]);

//   // -----------------------------
//   // UPDATE ANNOUNCEMENT
//   // -----------------------------

//   async function handleSubmit(event) {
//     event.preventDefault();

//     setSaving(true);
//     setError("");

//     try {
//       const response = await fetch(`/api/announcements/${id}`, {
//         method: "PUT",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           title,
//           description,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to update announcement");
//       }

//       // Go back to announcement list
//       router.push("/admin/announcement");

//       // Refresh the page data
//       router.refresh();
//     } catch (error) {
//       console.error(error);
//       setError(error.message);
//     } finally {
//       setSaving(false);
//     }
//   }

//   // -----------------------------
//   // LOADING
//   // -----------------------------

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="mx-auto max-w-3xl">
//           <p className="text-sm text-muted-foreground">
//             Loading announcement...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // -----------------------------
//   // PAGE
//   // -----------------------------

//   return (
//     <div className="p-6">
//       <div className="mx-auto max-w-3xl">
//         <Card>
//           <CardHeader>
//             <CardTitle>Edit Announcement</CardTitle>

//             <CardDescription>
//               Update the announcement information below.
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* TITLE */}

//               <div className="space-y-2">
//                 <Label htmlFor="title">Announcement Title</Label>

//                 <Input
//                   id="title"
//                   value={title}
//                   onChange={(event) => setTitle(event.target.value)}
//                   placeholder="Enter announcement title"
//                   required
//                 />
//               </div>

//               {/* DESCRIPTION */}

//               <div className="space-y-2">
//                 <Label htmlFor="description">Announcement Description</Label>

//                 <Textarea
//                   id="description"
//                   value={description}
//                   onChange={(event) => setDescription(event.target.value)}
//                   placeholder="Write your announcement..."
//                   className="min-h-[180px] resize-none"
//                   required
//                 />
//               </div>

//               {/* ERROR */}

//               {error && <p className="text-sm text-red-500">{error}</p>}

//               {/* BUTTONS */}

//               <div className="flex justify-end gap-3">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.push("/admin/announcement")}
//                   disabled={saving}
//                 >
//                   Cancel
//                 </Button>

//                 <Button
//                   type="submit"
//                   disabled={saving}
//                   className="bg-lime-700 hover:bg-lime-600"
//                 >
//                   {saving ? "Saving..." : "Save Changes"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

export default function EditAnnouncement() {
  const params = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH ANNOUNCEMENT
  // ==========================================

  useEffect(() => {
    async function fetchAnnouncement() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/announcements/${params.id}`);

        const text = await response.text();

        let data;

        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          throw new Error("The server returned an invalid response.");
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch announcement");
        }

        setTitle(data.title || "");
        setDescription(data.description || "");
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

  // ==========================================
  // UPDATE ANNOUNCEMENT
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Announcement title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Announcement description is required.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/announcements/${params.id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      // --------------------------------
      // READ RESPONSE SAFELY
      // --------------------------------

      const text = await response.text();

      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          console.error("SERVER RETURNED:", text);

          throw new Error("The server returned an invalid response.");
        }
      }

      // --------------------------------
      // CHECK RESPONSE
      // --------------------------------

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to update announcement (${response.status})`,
        );
      }

      // --------------------------------
      // SUCCESS
      // --------------------------------

      setSuccess("Announcement updated successfully.");

      setTimeout(() => {
        router.push("/admin/announcement");
      }, 1500);
    } catch (error) {
      console.error("UPDATE ANNOUNCEMENT ERROR:", error);

      setError(
        error.message ||
          "Something went wrong while updating the announcement.",
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex h-32 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading announcement...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/admin/announcement")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Announcements
      </Button>

      <Separator />

      <Card className="mx-auto mt-8 max-w-5xl">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Announcement</CardTitle>

          <CardDescription>
            Update the announcement information below.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TITLE */}

            <div className="space-y-2">
              <Label htmlFor="title">Announcement Title</Label>

              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter announcement title"
                disabled={saving}
              />
            </div>

            {/* DESCRIPTION */}

            <div className="space-y-2">
              <Label htmlFor="description">Announcement Description</Label>

              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter announcement description"
                rows={10}
                disabled={saving}
              />
            </div>

            {/* BUTTONS */}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/announcement")}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
