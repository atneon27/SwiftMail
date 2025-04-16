'use client'

import DOMPurify from 'dompurify'
import { useThreads } from '@/hooks/use-thread'
import React from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

const ThreadList = () => {
    const { threads, threadId, setThreadId } = useThreads()
    const groupedThreads = threads?.reduce((acc, thread) => {
        const date = format(thread.emails[0]?.sentAt ?? new Date(), 'dd-MM-yyyy')
        if(!acc[date]) {
            acc[date] = []
        }
        acc[date].push(thread)
        return acc
    }, {} as Record<string, typeof threads>)

    console.log(groupedThreads)

    return (
        <div className='max-w-full overflow-y-scroll max-h-[calc(100vh-130px)]'>
            {threads ? (<div className='flex flex-col gap-2 p-4 pt-0'>
                {Object.entries(groupedThreads ?? {}).map(([date, threads]) => {
                    return <React.Fragment key={date}>
                        <div className='text-xs font-medium text-muted-foreground mt-5 first:mt-0'>
                            {date}
                        </div>
                        {threads?.map((thread) => {
                            return <button 
                                onClick={() => {
                                    setThreadId(thread.id)
                                }}
                                key={thread.id} className={
                                cn('flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all relative', {
                                    'bg-accent': thread.id === threadId
                                })
                            }>
                                <div className='flex flex-col w-full gap-2'>
                                    <div className='flex items-center'>
                                        <div className='flex items-center gap-2'>
                                            <div className='font-semibold'>
                                                {thread.emails.at(-1)?.from.name ? thread.emails.at(-1)?.from.name : thread.subject}
                                            </div>
                                        </div>
                                        <div className='ml-auto text-xs'>
                                            {formatDistanceToNow(thread.emails.at(-1)?.sentAt ?? new Date(), {addSuffix: true})}
                                        </div>
                                    </div>
                                    <div className='text-xs font-medium'>
                                        {thread.emails.at(-1)?.subject}
                                    </div>
                                </div>
                                <div 
                                    className='text-xs line-clamp-2 font-medium text-muted-foreground'
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(thread.emails.at(-1)?.bodySnippet ?? "", {
                                            USE_PROFILES: {html: true}
                                        })
                                    }}    
                                >
                                </div>  
                            </button>
                        })}
                    </React.Fragment>
                })}
            </div>) : (<div className='p-8 text-muted-foreground mt-4 text-center h-[calc(100vh-120px)] flex flex-col items-center justify-center'>
                Nothing in Inbox
            </div>)}
        </div>
    )
}

export default ThreadList
