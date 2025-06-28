const ENABLE_LOGGING = true; // Set to false to disable all console logs

// --- Custom Logging Functions ---
export const log = (message: string, ...args: any[]) => {
  if (ENABLE_LOGGING) {
    console.log(message, ...args);
  }
};
export const warn = (message: string, ...args: any[]) => {
  if (ENABLE_LOGGING) {
    console.warn(message, ...args);
  }
};
export const error = (message: string, ...args: any[]) => {
  if (ENABLE_LOGGING) {
    console.error(message, ...args);
  }
};
