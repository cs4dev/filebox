import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Link, Loader2 } from "lucide-react";
import Image from "next/image";

export function Header() {
  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="items-center container mx-auto justify-between flex">
        <div className="flex gap-2 items-center">
          <Image src="/logo.svg" width={40} height={40} alt="file box logo" />
          FileBox
        </div>
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="size-8 animate-spin text-gray-400" />
          </ClerkLoading>
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
