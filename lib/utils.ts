import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { polarClient } from "./polar";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}  
export async function getCustomerStateSafe(userId: string) {
  try {
    return await polarClient.customers.getStateExternal({
      externalId: userId,
    });
  } catch (err: any) {
    if (err?.error === "ResourceNotFound") {
      return null; // free user
    }
    throw err; // real error
  }
}

