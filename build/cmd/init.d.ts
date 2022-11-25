export default function init(_path: string | undefined, args: {
    headers?: string[];
    yes: boolean;
}, withRunningCheck?: boolean): Promise<void>;
