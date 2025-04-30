import { clerkClient } from "@clerk/nextjs/server";
import { deleteImage, getImage } from "~/server/queries";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export default async function FullPageImageView(props: { id: number }) {

    let image;
    try {
        image = await getImage(props.id);
    } catch (err) {
        redirect("/");
    }

    const client = await clerkClient();
    const uploaderInfo= await client.users.getUser(image.userId);
    return (
        <div className="flex h-full w-screen min-w-0 items-center justify-center text-white">
            <div className="flex-shrink flex-grow">
                <img src={image.url} className="object-contain" alt={image.name}/>
            </div>

            <div className="flex h-full w-56 flex-shrink-0 flex-col border-l">
                <div className="border-b p-2 text-center text-xl">{image.name}</div>

                <div className="p-2">
                    <div>Uploaded By: </div>
                    <div>{uploaderInfo.fullName}</div>
                </div>
                <div className="p-2">
                    <div>Created On: </div>
                    <div>{image.createdAt.toLocaleDateString()}</div>
                </div>
                <div className="p-2">
                    <form
                        action={async () => {
                            "use server";

                            await deleteImage(props.id);
                        }}
                    >
                        <Button type="submit" variant="destructive">
                            Delete
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}