import { ItemDefinition } from "@azure/cosmos";

export interface EntryPayload {
    timestamp: number,
    content: string
}

export interface Entry {
    id: string;
    timestamp: number;
    content: string;
}

export interface DBEntry extends ItemDefinition {
    id: string;
    timestamp: number;
    content: string
}
