import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { sign } from "jsonwebtoken"
import { createToken } from "../Shared/auth";
import { sendResponse, STATUS_OK, STATUS_UNAUTHORIZED } from "../Shared/http";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const email = req.body.email ?? ""
    const password = req.body.password ?? ""

    const token = createToken(email, password);
    if (!token) {
        sendResponse(context, STATUS_UNAUTHORIZED);
        return;
    }

    sendResponse(context, STATUS_OK, { token: token });
};

export default httpTrigger;
