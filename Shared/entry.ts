import { Entry } from './types';

export const toPublic = (entry: any): Entry => {
    return {
        id: entry.id,
        timestamp: entry.timestamp,
        content: entry.content
    }
}
