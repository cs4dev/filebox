"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon, MoreHorizontal, TrashIcon } from "lucide-react";
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
import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

function formatBytesToKB(bytes: number, decimals: number = 2): number {
  if (bytes === 0) return 0;
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const kbSize = parseFloat((bytes / k).toFixed(dm));
  return kbSize;
}

function AreYouSureDialog({
  open,
  onOpenChange,
  onClick,
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            file(s) and remove from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function FileAction({ file }: { file: Doc<"files"> }) {
  const fileUrl = useQuery(api.files.getFileUrl, { fileId: file.fileId });
  const deleteFile = useMutation(api.files.deleteFile);
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  return (
    <>
      <AreYouSureDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onClick={async () => {
          await deleteFile({ fileId: file._id });
          toast({
            variant: "default",
            title: "File Deleted",
          });
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex gap-1 items-center"
            onClick={() => {
              {
                fileUrl && window.open(fileUrl, "_blank");
              }
            }}
          >
            <DownloadIcon className="size-4" /> Download
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsConfirmOpen(true)}
            className="flex gap-1 text-rose-600 items-center"
          >
            <TrashIcon className="size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function FilesAction({ files }: { files: Doc<"files">[] }) {
  const deleteFiles = useMutation(api.files.deleteFiles);
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  return (
    <div>
      <AreYouSureDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onClick={async () => {
          await deleteFiles({ files });
          toast({
            variant: "default",
            title: `${files.length} File(s) Deleted`,
          });
        }}
      />
      <Button
        variant="ghost"
        className="gap-1 text-rose-600 hover:bg-transparent"
        onClick={() => setIsConfirmOpen(true)}
      >
        <TrashIcon className="size-4" /> Delete ({files.length})
      </Button>
    </div>
  );
}

export const columns: ColumnDef<Doc<"files">>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex gap-2 items-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <FilesAction
            files={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
          />
        )}
      </div>
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "_creationTime",
    header: "Upload Date",
    cell: ({ row }) =>
      format(new Date(row.getValue("_creationTime")), "dd/MM/yyyy hh:mm:ss a"),
  },
  {
    accessorKey: "type",
    header: "File Type",
    cell: ({ row }) => String(row.getValue("type")).toUpperCase(),
  },

  {
    accessorKey: "size",
    header: "File Size (KB)",
    cell: ({ row }) => String(formatBytesToKB(row.getValue("size"))),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const file = row.original;
      return <FileAction file={file} />;
    },
  },
];
