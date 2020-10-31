import { Container, CosmosClient } from "@azure/cosmos";
import { toPublic } from "./entry";
import { Entry } from "./types";

export const getCosmosRepository = (): Container => {
    const endpoint = process.env['DB_ENDPOINT'];
    const key = process.env['DB_KEY'];
    return new CosmosClient({ endpoint, key }).database("entries").container("entries");
}

export const searchEntries = async (q: string, from: number, to: number): Promise<Entry[]> => {
    const repo = getCosmosRepository();
    let queryStr = "SELECT TOP 100 * FROM c WHERE c.timestamp >= @from AND c.timestamp <= @to "

    if (q) {
        queryStr += "AND CONTAINS(c.content, @q, true) "
    }

    queryStr += "ORDER BY c.timestamp DESC"

    const queryOpt = {
        query: queryStr,
        parameters: [
            { name: '@q', value: q },
            { name: '@from', value: from },
            { name: '@to', value: to }
        ]
    }


    const result = await repo.items.query(queryOpt).fetchAll()
    return result.resources.map(toPublic)
}

export const getEntry = async (entryId: string): Promise<Entry | null> => {
    if (entryId == undefined || entryId === null || entryId === "") {
        return null
    }
    const repo = getCosmosRepository();
    const queryOpt = {
        query: "SELECT TOP 1 * FROM c WHERE c.id = @entryId",
        parameters: [{ name: '@entryId', value: entryId }]
    }

    const result = await repo.items.query(queryOpt).fetchAll();
    if (result.resources.length === 0) {
        return null;
    }

    return toPublic(result.resources[0])
}

export const updateEntry = async (entryId: string, timestamp: number, content: string): Promise<Entry | null> => {
    const repo = getCosmosRepository();
    const updatedEntry: Entry = {
        id: entryId,
        timestamp: timestamp,
        content: content
    }

    try {
        await repo.item(entryId).replace(updatedEntry);
        return updatedEntry;
    } catch (e) {
        if (e.code !== undefined && e.code === 404) {
            return null;
        }
        throw e
    }
}

export const deleteEntry = async (entryId: string): Promise<void> => {
    const repo = getCosmosRepository();
    try {
        await repo.item(entryId, entryId).delete()
    } catch (e) {
        if (e.code !== undefined && e.code !== 404) {
            throw e;
        }
    }
}
