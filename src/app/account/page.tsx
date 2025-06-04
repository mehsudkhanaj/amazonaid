
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { UserCog, Save, UploadCloud, Mail, User as UserIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateProfile, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth, storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState(""); // For changing password, more complex flow
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(user?.photoURL || null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setProfilePicturePreview(user.photoURL || null);
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      let newPhotoURL = user.photoURL;
      if (profilePictureFile) {
        const storageRef = ref(storage, `profilePictures/${user.uid}/${profilePictureFile.name}`);
        await uploadBytes(storageRef, profilePictureFile);
        newPhotoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: displayName,
        photoURL: newPhotoURL,
      });
      
      // Firestore update (optional, if you store user data there)
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        displayName: displayName,
        photoURL: newPhotoURL,
      });

      // Email update is more complex, requires re-authentication often
      if (email !== user.email) {
        // This is a simplified example. Production email change needs robust error handling & re-auth.
        // const currentPassword = prompt("Please enter your current password to change email:");
        // if (currentPassword) {
        //   const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        //   await reauthenticateWithCredential(user, credential);
        //   await updateEmail(user, email);
        // } else {
        //   throw new Error("Password required to change email.");
        // }
        toast({ title: "Info", description: "Email change requires re-authentication. Feature currently simplified." });
      }
      
      toast({ title: "Success", description: "Profile updated successfully." });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({ variant: "destructive", title: "Update Failed", description: error.message || "Could not update profile." });
    } finally {
      setIsSaving(false);
    }
  };
  
  const getUserInitials = (email?: string | null) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <AppHeader title="Account Settings" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <p className="font-body">Loading account details...</p>
        </main>
      </div>
    );
  }

  if (!user) {
     return (
      <div className="flex-1 flex flex-col">
        <AppHeader title="Account Settings" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <p className="font-body">Please log in to view account settings.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title="Account Settings" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><UserCog className="mr-2 h-6 w-6 text-primary" />Manage Your Account</CardTitle>
            <CardDescription className="font-body">Update your profile information and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 border-4 border-primary/50 shadow-md">
                <AvatarImage src={profilePicturePreview || undefined} alt={displayName || "User"} />
                <AvatarFallback className="text-4xl">{getUserInitials(user.email)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="font-body">
                <UploadCloud className="mr-2 h-4 w-4" /> Change Picture
              </Button>
              <Input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept="image/*"
                onChange={handleFileChange} 
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName" className="font-body flex items-center"><UserIcon className="mr-2 h-4 w-4 text-muted-foreground"/>Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your Name" className="font-body mt-1"/>
              </div>
              <div>
                <Label htmlFor="email" className="font-body flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="font-body mt-1"/>
                <p className="text-xs text-muted-foreground mt-1 font-body">Changing email requires re-authentication (simplified for now).</p>
              </div>
              
              {/* Password change can be a separate section or modal due to its sensitivity and re-auth flow */}
              <div>
                <Label htmlFor="newPassword" className="font-body">New Password (Optional)</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current password" className="font-body mt-1"/>
                <p className="text-xs text-muted-foreground mt-1 font-body">Full password change functionality coming soon.</p>
              </div>
            </div>
            
            <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full font-body bg-accent hover:bg-accent/90">
              {isSaving ? <Save className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
