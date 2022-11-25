export declare class HoudiniError extends Error {
    filepath: string | null;
    description: string | null;
    constructor({ filepath, message, description, }: {
        filepath?: string | null;
        message: string;
        description?: string | null;
    });
}
