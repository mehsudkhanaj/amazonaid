
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Keep Input import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Keep Card imports
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db, app } from "@/lib/firebase"; // Assuming db is exported from firebase.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { Loader2, UploadCloud } from "lucide-react";

import { getAuth } from 'firebase/auth'; // Import getAuth

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters." }),
  profilePicture: z.instanceof(File).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("profilePicture", file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Use getAuth with the initialized app
      const userCredential = await createUserWithEmailAndPassword(getAuth(app), values.email, values.password);
      const user = userCredential.user;

      let photoURL: string | undefined = undefined;
      if (values.profilePicture) {
        const storageRef = ref(storage, `profilePictures/${user.uid}/${values.profilePicture.name}`);
        await uploadBytes(storageRef, values.profilePicture);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: values.displayName,
        photoURL: photoURL,
      });
      
      // Optionally, save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: values.displayName,
        photoURL: photoURL || null,
        createdAt: new Date().toISOString(),
      });

      toast({ title: "Success", description: "Account created successfully. Please login." });
      router.push("/login");
    } catch (error: any) {
      console.error("Signup error", error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">Create an Account</CardTitle>
        <CardDescription className="font-body">Join FinVerse and take control of your finances.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-body">Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} className="font-body"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-body">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} className="font-body"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-body">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="font-body"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-body">Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="font-body"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-body">Profile Picture (Optional)</FormLabel>
                  <FormControl>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 font-body"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadCloud className="h-4 w-4" />
                        Upload Image
                      </Button>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </div>
                  </FormControl>
                  {filePreview && (
                    <div className="mt-2 flex justify-center">
                      <img src={filePreview} alt="Profile preview" className="h-24 w-24 rounded-full object-cover" />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-body" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
