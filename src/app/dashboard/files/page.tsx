"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { columns } from "@/app/files/columns";
import { DataTable } from "@/app/files/data-table";
import { UploadButton } from "@/app/upload-button";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  const orgId =
    organization.isLoaded && user.isLoaded
      ? organization.organization?.id ?? user.user?.id
      : null;

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto pt-12">
      {isLoading && user.isSignedIn && (
        <div className="flex flex-col gap-8 items-center mt-24">
          <Loader2 className="size-24 animate-spin text-gray-600" />
          Loading...
        </div>
      )}
      {!isLoading && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <div className="flex gap-2">
              <UploadButton />
            </div>
          </div>
          <div className="mt-10">
            <DataTable columns={columns} data={files} />
          </div>
        </>
      )}
    </main>
  );
}
