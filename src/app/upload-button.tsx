"use client";

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  ALLOWED_CONTENT_TYPES,
  ALLOWED_MAX_FILE_SIZE,
} from "../../convex/schema";

// const formSchema = z.object({
//   title: z.string().min(1).max(200),
//   file: z
//     .custom<FileList>((val) => val instanceof FileList, "Required")
//     .refine((files) => files.length > 0, "Required")
//     // .refine(
//     //   (files) =>
//     //     Object.keys(ALLOWED_CONTENT_TYPES).includes(files[0].type as any),
//     //   "Only PDF, JPG and PNG files are allowed"
//     // )
//     .refine(
//       (files) => files[0].size <= ALLOWED_MAX_FILE_SIZE,
//       "Maximum file size allowed is 10MB"
//     ),
// });

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`)
    .refine(
      (files) =>
        files.length > 0 &&
        Object.keys(ALLOWED_CONTENT_TYPES).includes(files[0].type),
      `Only PDF, JPG and PNG files are allowed`
    )
    .refine(
      (files) => files.length > 0 && files[0].size <= ALLOWED_MAX_FILE_SIZE,
      "Maximum file size allowed is 10MB"
    ),
});

export function UploadButton() {
  const { toast } = useToast();
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;

    const postUrl = await generateUploadUrl();
    const fileType = values.file[0].type;
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": fileType },
      body: values.file[0],
    });

    const { storageId } = await result.json();

    try {
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
        type: ALLOWED_CONTENT_TYPES[fileType],
        size: values.file[0].size,
      });

      form.reset();
      setIsFileDialogOpen(false);
      toast({
        variant: "success",
        title: "File Uploaded",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Your filed could not be uploaded, try again later",
      });
    }
  }

  const orgId =
    organization.isLoaded && user.isLoaded
      ? organization.organization?.id ?? user.user?.id
      : null;

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const createFile = useMutation(api.files.createFile);
  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => {}}>Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8">Upload</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input type="file" {...fileRef} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="text-xs text-rose-700">
                        Accepted file types: PDF, JPG, PNG. Max file size: 10MB.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex gap-1"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
