import { SignInButton, SignedOut, UserButton, SignedIn } from "@clerk/nextjs";
import { SimpleUploadButton } from "./simple-upload-button";

export function TopNav() {

    return (
        <nav className='flex w-full items-center justify-between border-b p-4 text-xl font-semibold'>
            <div>Gallery</div>

            <div className="flex flex-row gap-4 items-center">
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <SimpleUploadButton/>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    )
}