import { Context } from "@azure/functions";

export type StatusCode = number
export const STATUS_OK: StatusCode = 200;
export const STATUS_CREATED: StatusCode = 201;
export const STATUS_NO_CONTENT: StatusCode = 204;
export const STATUS_BAD_REQUEST: StatusCode = 400;
export const STATUS_UNAUTHORIZED: StatusCode = 401;
export const STATUS_NOT_FOUND: StatusCode = 404
export const STATUS_INTERNAL_SERVER_ERROR: StatusCode = 500;

export const sendResponse = async (context: Context, status: StatusCode, body?: any): Promise<void> => {
    context.res = { status: status, body: body, headers: { "Content-Type": "application/json" } }
    context.done();
}
