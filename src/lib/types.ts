import { z } from 'zod'

export interface SyncResponse {
    syncUpdatedToken: string;
    syncDeletedToken: string;
    ready: boolean;
}

export const emailAddressSchema = z.object({
    name: z.string(),
    address: z.string()
})

export interface SyncUpdatedResponse {
    nextPageToken: string;
    nextDeltaToken: string;
    length: number;
    records: EmailMessage[];
}

export interface EmailAddress {
    name?: string;
    address: string;
    raw?: string;
}

export interface EmailAttachment {
    id: string;
    name: string;
    mimeType: string;
    size: number
    inline: boolean
    contentId?: string
    content?: string
    contentLocation?: string
}

export interface EmailHeaders {
    name: string;
    value: string;
}

export interface EmailMessage {
    id: string;
    threadId: string;
    createdTime: string;
    lastModifiedTime: string;
    sentAt: string;
    receivedAt: string;
    internetMessageId: string;
    subject: string;
    sysLabels: Array<"junk" | "trash" | "sent" | "inbox" | "unread" | "flag" | "important" | "draft">;
    keywords: string[];
    sysClassifications: Array<"personal" | "social" | "promotions" | "updates" | "forums">;
    sensitivity: "normal" | "private" | "personal" | "confidential";
    from: EmailAddress;
    to: EmailAddress[]; 
    cc: EmailAddress[]; 
    bcc: EmailAddress[]; 
    replyTo: EmailAddress[];
    hasAttachments: string;
    body?: string;
    bodySnippet?: string; 
    attachments: EmailAttachment[];
    inReplyTo?: string;
    references?: string;
    threadIndex?: string;
    internetHeaders: EmailHeaders[]
    nativeProperties: Record<string, string>;
    folderId?: string;
    omitted: Array<"threadId" | "body" | "attachments" | "recipients" | "internetHeaders">;
}  