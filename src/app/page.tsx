"use client"

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignOutButton, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { fromUnixTime } from "date-fns";

export default function Home() {
  const organization = useOrganization()
  const user = useUser()
  const orgId = organization.isLoaded && user.isLoaded
  ? organization.organization?.id ?? user.user?.id
  : null;

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip")
  const createFile = useMutation(api.files.createFile)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {files?.map(file => {
        return <div key={file._id}>{file.name} {fromUnixTime(file._creationTime).toUTCString()}</div>
      })}

      <Button onClick={() => {
        if (!orgId) return
        createFile({ name: 'hello world', orgId })}}
        >Click Me</Button>
    </main>
  );
}
