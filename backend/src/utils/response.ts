import { Response } from "express";

interface SuccessResponseOptions {
  res: Response;
  statusCode?: number;
  message: string;
  data?: unknown;
}

interface ErrorResponseOptions {
  res: Response;
  statusCode?: number;
  message: string;
  errors?: unknown[];
}

export const sendSuccess = ({ res, statusCode = 200, message, data }: SuccessResponseOptions) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
};

export const sendError = ({ res, statusCode = 500, message, errors }: ErrorResponseOptions) => {
  const body: Record<string, unknown> = {
    success: false,
    message,
  };
  if (errors && errors.length > 0) {
    body.errors = errors;
  }
  return res.status(statusCode).json(body);
};
