import { db } from "@/server/db"
import { create, insert, search } from "@orama/orama"
import { OramaClient } from "@/lib/orama"

const orama = new OramaClient('110370')
await orama.initialize()

// const orama = await create({
//     schema: {
//         subject: "string",
//         body: "string",
//         from: "string",
//         to: "string[]",
//         sentAt: "string",
//         threadId: "string"
//     }
// })

// const emails = await db.email.findMany({
//     select: {
//         subject: true,
//         body: true,
//         from: true,
//         to: true,
//         sentAt: true,
//         threadId: true
//     }
// })

// for(const email of emails) {
//     await insert(orama, {
//         subject: email.subject,
//         body: email.body ?? '',
//         from: email.from.address,
//         to: email.to.map(to => to.address),
//         sentAt: email.sentAt.toLocaleString(),
//         threadId: email.threadId
//     })
// }

// const results = await search(orama, {
//     term: 'intern'
// })

// for(const result of results.hits) {
//     console.log(result.document.subject)    
// }

// for(const email of emails) {
//     await orama.insert({
//         subject: email.subject,
//         body: email.body ?? '',
//         from: email.from.address,
//         to: email.to.map(to => to.address),
//         sentAt: email.sentAt.toLocaleString(),
//         threadId: email.threadId
//     })
// }

// await orama.saveIndex()

const results = await orama.search({
    term: 'internshala'
})

console.log(results.count)