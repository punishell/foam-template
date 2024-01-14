export interface AttachmentProps {
    file?: File;
    url: string;
    type: string;
    name: string;
    progress?: number;
    createdAt?: string | Date; // Use `Date` if `createdAt` is a Date object
    size: string;
}
