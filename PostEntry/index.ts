import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { v4 as uuid } from "uuid";
import { requireAuthentication } from "../Shared/auth";
import { getCosmosRepository } from "../Shared/db";
import { toPublic } from "../Shared/entry";
import { sendResponse, STATUS_BAD_REQUEST, STATUS_CREATED } from "../Shared/http";
import { DBEntry, EntryPayload } from "../Shared/types";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    requireAuthentication(context);

    const repo = getCosmosRepository();
    const payload: EntryPayload = req.body

    if (payload.timestamp !== undefined && payload.content != undefined) {
        const newEntry: DBEntry = {
            id: uuid(),
            timestamp: payload.timestamp,
            content: payload.content.trim()
        }
        await repo.items.create(newEntry);

        context.bindings.postEntry = JSON.stringify(newEntry)
        sendResponse(context, STATUS_CREATED, toPublic(newEntry));
    } else {
        sendResponse(context, STATUS_BAD_REQUEST, { error: "Bad Request" });
    }
};

export default httpTrigger;
