import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { updateUserProfilePicture, updateUserRole } from "@/app/_actions/users.actions";
import { showConfirmationMessage } from "@/lib/general_functions";
import Image from "next/image";

const UpdateUserRole = ({
    clerkId,
    firstName,
    lastName,
    role,
    profilePicture,
}: {
    clerkId: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicture: string;
}) => {
    const [selectedValue, setSelectedValue] = useState<string>(role);
    const [image, setImage] = useState<File | null>(null); // Profile picture file

    // Update role function
    const _updateRole = async () => {
        await updateUserRole(clerkId, selectedValue);
        showConfirmationMessage("success", "User role was updated successfully");
    };

    // Update profile picture function
    const _updateProfilePicture = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append("file", image);

        try {
            // Mock upload to a file storage (e.g., Cloudinary, S3)
            const response = await fetch("/api/upload", { method: "POST", body: formData });
            const { url } = await response.json();

            // Update the profile picture in Clerk and MongoDB
            await updateUserProfilePicture(clerkId, url);
            showConfirmationMessage("success", "Profile picture updated successfully");
        } catch (error) {
            console.error("Error uploading image:", error);
            showConfirmationMessage("error", "Failed to update profile picture");
        }
    };

    return (
        <div className="flex items-center gap-2 rounded-[10px]">
            <Dialog>
                <DialogTrigger>
                    <button className="border px-1 rounded-[5px] bg-blue-700 text-white">...</button>
                </DialogTrigger>
                <DialogContent className="bg-white rounded-[10px]">
                    <DialogHeader>
                        <DialogTitle>Update User Details</DialogTitle>
                        <div className="mt-4 border-t py-4">
                            {/* User Info */}
                            <div className="flex flex-col gap-4 border-b pb-4">
                                <h1>
                                    First Name: <span className="font-semibold">{firstName}</span>
                                </h1>
                                <h1>
                                    Last Name: <span className="font-semibold">{lastName}</span>
                                </h1>
                                <h1>
                                    Current Role: <span className="font-semibold text-red-600">{role}</span>
                                </h1>
                            </div>

                            {/* New Role */}
                            <div>
                                <h1 className="font-bold my-2">New Role:</h1>
                                <RadioGroup
                                    defaultValue={role}
                                    className="flex items-center gap-10"
                                    onValueChange={(value) => setSelectedValue(value)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="member" id="option-member" />
                                        <Label htmlFor="option-member">Member</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="admin" id="option-admin" />
                                        <Label htmlFor="option-admin">Admin</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Profile Picture Update */}
                            <div className="mt-4">
                                <h1 className="font-bold">Update Profile Picture:</h1>
                                <Image src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full mt-2" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="mt-2"
                                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                                />
                                <Button className="mt-2" onClick={_updateProfilePicture}>
                                    Upload Picture
                                </Button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 border-t pt-3 rounded">
                            <Button className="bg-primary hover:bg-primary/70" onClick={_updateRole}>
                                Update Role
                            </Button>
                            <DialogClose>
                                <Button className="bg-red-600 text-white rounded hover:bg-red-400">Cancel</Button>
                            </DialogClose>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UpdateUserRole;
