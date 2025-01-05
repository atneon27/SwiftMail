import { db } from "@/server/db";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from 'zod'

const hasAccess = async (accountId: string, userId: string) => {
    const account = await db.account.findFirst({
        where: {
            id: accountId,
            userId
        }, 
        select: {
            id: true,
            name: true,
            emailAddress: true,
            accessToken: true
        }
    })

    if(!account) throw new Error("Unauthorized Access!")
    return account
}

export const accountRouter = createTRPCRouter({
    getAccounts: privateProcedure.query(async ({ctx}) => {
        return await ctx.db.account.findMany({
            where: {
                userId: ctx.auth.userId
            }, 
            select: {
                id: true,
                emailAddress: true,
                name: true
            }
        })
    }),
    getNumThreads: privateProcedure.input(z.object({
        accountId: z.string(),
        tab: z.string()
    })).query(async ({ctx, input}) => {
        const account = await hasAccess(input.accountId, ctx.auth.userId)
        const data =  await ctx.db.thread.count({
            where: {
                accountId: input.accountId,
                inboxStatus: input.tab === 'inbox' ? true : false,
                sentStatus: input.tab === 'sent' ? true : false,
                draftStatus: input.tab === 'draft' ? true : false,
                spamStatus: input.tab === 'spam' ? true : false,
                spoofStatus: input.tab === 'spoof' ? true : false
            }
        })

        return data
    }),
    getThreads: privateProcedure.input(z.object({
        accountId: z.string(),
        tab: z.string(),
        done: z.boolean()
    })).query(async ({ctx, input}) => { 
        const account = await hasAccess(input.accountId, ctx.auth.userId);
        const data = await ctx.db.thread.findMany({
            where: {
                accountId: input.accountId,
                inboxStatus: input.tab === 'inbox' ? true : false,
                sentStatus: input.tab === 'sent' ? true : false,
                draftStatus: input.tab === 'draft' ? true : false,
                spamStatus: input.tab === 'spam' ? true : false,
                spoofStatus: input.tab === 'spoof' ? true : false,
                done: input.done
            }, 
            include: {
                emails: {
                    orderBy: {
                        sentAt: 'asc'
                    }, 
                    select: {
                        from: true,
                        body: true,
                        bodySnippet: true,
                        emailLabel: true,
                        subject: true,
                        id: true,
                        sentAt: true,
                        sysLabels: true
                    }
                }
            },
            take: 25,
            orderBy: {
                lastMessageDate: 'desc'
            }
        })

        return data
    })
})