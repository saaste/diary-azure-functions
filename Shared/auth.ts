import { Context } from "@azure/functions"
import { sign, verify } from "jsonwebtoken"
import { sendResponse, STATUS_UNAUTHORIZED } from "./http";

export const createToken = (email: string, password: string): string | null => {
    if (email === process.env['EMAIL'] && password === process.env['PASSWORD']) {
        return sign({ isValid: true }, process.env['SECRET'], { expiresIn: '1d' });
    }
    return null;
}

export const requireAuthentication = async (context: Context): Promise<void> => {
    const authHeader = context.req.headers['authorization'];
    if (authHeader == undefined || authHeader === "") {
        sendResponse(context, STATUS_UNAUTHORIZED, { error: "Unauthorized" });
        return;
    }

    try {
        const token = authHeader.replace("Bearer", "").trim();
        verify(token, process.env['SECRET']);
    } catch (err) {
        sendResponse(context, STATUS_UNAUTHORIZED, { error: "Unauthorized" });
        return
    }
}
