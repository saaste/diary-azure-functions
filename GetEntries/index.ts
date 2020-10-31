import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { requireAuthentication } from "../Shared/auth";
import { searchEntries } from "../Shared/db";
import { sendResponse, STATUS_OK } from "../Shared/http";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    requireAuthentication(context);

    const now = Math.floor(Date.now() / 1000);
    const defaultFrom = now - (60 * 60 * 24 * 24)

    const q = req.query['q'] || null;
    const from = parseInt(req.query['from']) || defaultFrom
    const to = parseInt(req.query['to']) || now

    const entries = await searchEntries(q, from, to)
    sendResponse(context, STATUS_OK, entries);
};

export default httpTrigger;
