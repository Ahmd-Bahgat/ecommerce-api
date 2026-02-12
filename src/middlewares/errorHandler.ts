import { Request, Response, NextFunction } from "express";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.data || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};