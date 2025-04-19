import { create, insert, search, type AnyOrama } from "@orama/orama"
import { persist, restore } from "@orama/plugin-data-persistence"
import { db } from "@/server/db"
import { endOfDay } from "date-fns";

export class OramaClient {
    // @ts-expect-error: Type mismatch between Orama and AnyOrama
    private orama: AnyOrama;
    private accountId: string;

    constructor(accountId: string) {
        this.accountId = accountId;
    }

    async initialize() {
        const account = await db.account.findUnique({
            where: { id: this.accountId },
            select: { oramaIndex: true }
        });

        if (!account) throw new Error('Account not found');

        if (account.oramaIndex) {
            this.orama = await restore('json', account.oramaIndex as any);
        } else {
            this.orama = create({
                schema: {
                    subject: "string",
                    body: "string",
                    rawBody: "string",
                    from: "string",
                    to: "string[]",
                    sentAt: "string",
                    threadId: "string"
                } 
            });
            await this.saveIndex();
        }
    }

    async insert(document: any) {
        if(!this.orama) throw new Error("orama is not initalized")
        await insert(this.orama, document);
        await this.saveIndex()
    }

    async search({ term }: { term: string }) {
        return await search(this.orama, {
            term: term,
        });
    }

    async saveIndex() {
        const index = await persist(this.orama, 'json');
        await db.account.update({
            where: { id: this.accountId },
            data: { oramaIndex: index as Buffer }
        });
    }
}