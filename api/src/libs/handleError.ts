import { Response } from "express";

export const handle500Error = (
  res: Response,
  error: unknown,
  customMessage?: string
): void => {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  const context = customMessage || "Internal server error";
  
  console.error(`[${new Date().toISOString()}] ${context}:`, error);
  
  res.status(500).json({
    success: false,
    message: context,
    ...(process.env.NODE_ENV === "development" && { error: errorMessage }),
  });
};
