import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { requireAuthentication } from "../Shared/auth";
import { deleteEntry, getCosmosRepository, getEntry, updateEntry } from "../Shared/db";
import { sendResponse, STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR, STATUS_NOT_FOUND, STATUS_NO_CONTENT, STATUS_OK } from "../Shared/http";
import { EntryPayload } from "../Shared/types";

const repo = getCosmosRepository();

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    requireAuthentication(context);

    const entryId: string = req.params["entryId"];

    switch (req.method) {
        case "GET":
            await handleGET(context, entryId)
            break;
        case "PUT":
            await handlePUT(context, req, entryId);
            break;
        case "DELETE":
            await handleDELETE(context, entryId);
            break;

    }
};

const handleGET: AzureFunction = async (context: Context, entryId: string): Promise<void> => {
    try {
        const entry = await getEntry(entryId)
        if (!entry) {
            sendResponse(context, STATUS_NOT_FOUND, { error: "Not Found" });
            return;
        }

        sendResponse(context, STATUS_OK, entry);
    } catch (e) {
        context.log(e);
    }
}

const handlePUT: AzureFunction = async (context: Context, req: HttpRequest, entryId: string): Promise<void> => {
    const payload: EntryPayload = req.body

    if (payload.timestamp == undefined || payload.content == undefined) {
        sendResponse(context, STATUS_BAD_REQUEST, { error: "Bad Request" });
        return;
    }

    try {
        const updatedEntry = await updateEntry(entryId, payload.timestamp, payload.content);
        if (updatedEntry) {
            sendResponse(context, STATUS_OK, updatedEntry);
        } else {
            sendResponse(context, STATUS_NOT_FOUND);
        }
    } catch (e) {
        context.log(e);
        sendResponse(context, STATUS_INTERNAL_SERVER_ERROR);
    }
}

const handleDELETE: AzureFunction = async (context: Context, entryId: string): Promise<void> => {
    try {
        await deleteEntry(entryId);
        sendResponse(context, STATUS_NO_CONTENT);
    } catch (e) {
        context.log(e);
        sendResponse(context, STATUS_INTERNAL_SERVER_ERROR);
    }

}

export default httpTrigger;
