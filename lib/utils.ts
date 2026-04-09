import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { polarClient } from "./polar";
import { openDB } from "idb";
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



// Lazy initialization - only runs in browser, never on server
let dbPromiseInstance: ReturnType<typeof openDB> | null = null;

function getDBPromise() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }
  if (!dbPromiseInstance) {
    dbPromiseInstance = openDB("workflow-builder-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("node-configs")) {
          db.createObjectStore("node-configs");
        }
      },
    });
  }
  return dbPromiseInstance;
}

export async function saveNodeConfigToIDB(key: string, value: any) {
  const db = await getDBPromise();
  await db.put("node-configs", value, key);
}

export async function getNodeConfigFromIDB(key: string) {
  const db = await getDBPromise();
  return db.get("node-configs", key);
}
