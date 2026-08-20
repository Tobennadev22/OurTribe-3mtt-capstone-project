// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { Button } from "./ui/button";
// import { Separator } from "@/components/ui/separator";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";

// // import { EllipsisVertical } from "lucide-react";

// export function TableUi({ data, onEdit, onDelete, onView }) {
//   return (
//     <Card className="mt-8">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle>Recent Registrations</CardTitle>

//             <CardDescription>
//               Recently registered members on the platform.
//             </CardDescription>
//           </div>
//         </div>
//       </CardHeader>

//       <Separator />

//       <CardContent className="p-0">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>First Name</TableHead>
//               <TableHead>Last Name</TableHead>
//               <TableHead>Phone Number</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Date Registered</TableHead>
//               <TableHead className="text-center w-20">Action</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody className="text-xs">
//             {data.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="h-32 text-center">
//                   No members registered yet.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               data.map((user) => (
//                 <TableRow key={user.ID}>
//                   <TableCell>{user.ID}</TableCell>

//                   <TableCell>{user.firstName}</TableCell>

//                   <TableCell>{user.lastName}</TableCell>

//                   <TableCell>{user.phone_Number}</TableCell>

//                   <TableCell>{user.email}</TableCell>

//                   <TableCell>{user.dateRegistered}</TableCell>

//                   <TableCell>
//                     <div className="flex justify-center">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" className="rounded-md p-2">
//                             {user.action}
//                           </Button>
//                         </DropdownMenuTrigger>

//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem onClick={() => onView?.(user)}>
//                             View
//                           </DropdownMenuItem>

//                           <DropdownMenuItem onClick={() => onEdit?.(user)}>
//                             Edit
//                           </DropdownMenuItem>

//                           <DropdownMenuItem
//                             onClick={() => onDelete?.(user)}
//                             className="text-red-600"
//                           >
//                             Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { EllipsisVertical } from "lucide-react";

export function TableUi({ data, onEdit, onDelete, onView }) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Registrations</CardTitle>

            <CardDescription>
              Recently registered members on the platform.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>

              <TableHead>First Name</TableHead>

              <TableHead>Last Name</TableHead>

              <TableHead>Phone Number</TableHead>

              <TableHead>Email</TableHead>

              <TableHead>Date Registered</TableHead>

              <TableHead className="text-center w-20">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-xs">
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  No members registered yet.
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => (
                <TableRow key={user.ID}>
                  <TableCell>{user.ID}</TableCell>

                  <TableCell>{user.firstName}</TableCell>

                  <TableCell>{user.lastName}</TableCell>

                  <TableCell>{user.phone_Number}</TableCell>

                  <TableCell>{user.email}</TableCell>

                  <TableCell>{user.dateRegistered}</TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="rounded-md p-2">
                            <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView?.(user)}>
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => onEdit?.(user)}>
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onDelete?.(user)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
