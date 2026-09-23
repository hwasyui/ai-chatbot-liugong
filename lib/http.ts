import type { ErrorResponse } from "@/lib/types";

export function errorResponse(message: string, status: number) {
  const body: ErrorResponse = { error: message };
  return Response.json(body, { status });
}
