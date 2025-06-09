"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function SignOutPage() {
  useEffect(() => {
    // Force a complete signout with redirect to sign in page with flag
    const performSignout = async () => {
      try {
        // Clear any localStorage items that might be used for session persistence
        localStorage.clear();
        
        // Clear any sessionStorage items
        sessionStorage.clear();
        
        // Use NextAuth signOut with redirect to signin page and a query param to prevent auto-redirect
        await signOut({ 
          callbackUrl: "/auth/signin?from=signout",
          redirect: true
        });
      } catch (error) {
        console.error("Error during sign out:", error);
        // Fallback - redirect to signin page if signOut fails
        window.location.href = "/auth/signin?from=signout";
      }
    };
    
    performSignout();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto p-6 space-y-6 text-center">
        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
        <h1 className="text-2xl font-semibold">Signing out...</h1>
        <p className="text-muted-foreground">You will be redirected shortly.</p>
      </div>
    </div>
  );
}