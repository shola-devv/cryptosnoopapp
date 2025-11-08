// utils/deleteAccount.ts or lib/deleteAccount.ts

import { signOut } from "next-auth/react";

export const deleteAccount = async (userId: string) => {
  try {
    // Call the DELETE API endpoint with userId as query parameter
    const response = await fetch(`/api/users?userId=${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parse the JSON response
    const data = await response.json();

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete account");
    }

    // If deletion was successful, sign out the user
    // and redirect them to the home page
    await signOut({ 
      callbackUrl: "/",
      redirect: true 
    });

    return { 
      success: true, 
      message: data.message 
    };

  } catch (error: any) {
    console.error("Error deleting account:", error);
    return { 
      success: false, 
      message: error.message || "An error occurred while deleting the account"
    };
  }
};