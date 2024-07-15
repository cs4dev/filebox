// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Doc } from "../../convex/_generated/dataModel";
// import { Button } from "@/components/ui/button";
// import { MoreVertical, TrashIcon } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { useState } from "react";

// function FileCardActions() {
//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//   return (
//     <>
//       <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete your
//               account and remove your data from our servers.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={() => {
//                 // TODO delete file
//               }}
//             >
//               Continue
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//       <DropdownMenu>
//         <DropdownMenuTrigger>
//           <MoreVertical />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuItem
//             onClick={() => setIsConfirmOpen(true)}
//             className="flex gap-1 text-rose-600 items-center"
//           >
//             <TrashIcon className="size-4" /> Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// }

// export function FileCard({ file }: { file: Doc<"files"> }) {
//   return (
//     <Card>
//       <CardHeader className="relative">
//         <CardTitle>{file.name}</CardTitle>
//         <div className="absolute top-2 right-2">
//           <FileCardActions />
//         </div>
//       </CardHeader>
//       <CardContent>
//         <p>Card Content</p>
//       </CardContent>
//       <CardFooter>
//         <Button>Download</Button>
//       </CardFooter>
//     </Card>
//   );
// }
