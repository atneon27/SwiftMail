import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useThreads } from '@/hooks/use-thread'
import { Archive, ArchiveX, Clock, MoreVertical, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from 'date-fns'
import DisplayEmail from './DisplayEmail'
import ReplyBox from './ReplyBox'



const ThreadDisplay = () => {
    const {threads, threadId} = useThreads()

    const currThread = threads?.find((thread) => {
        return thread.id === threadId
    })

    return (
        <div className="flex flex-col h-full">
            <div className='flex flex-row'>
                <div className="flex items-center p-2">
                    <div className='flex items-center gap-2'>
                        <Button variant={'ghost'} size={'icon'} disabled={!currThread} >
                            <Archive className='size-4' />
                        </Button>
                        <Button variant={'ghost'} size={'icon'} disabled={!currThread} >
                            <ArchiveX className='size-4' />
                        </Button>
                        <Button variant={'ghost'} size={'icon'} disabled={!currThread} >
                            <Trash2 className='size-4' />
                        </Button>
                    </div> 
                    <Separator className='ml-2' orientation='vertical' />
                    <Button className='ml-2' variant={'ghost'} size={'icon'} disabled={!currThread} >
                        <Clock className='size-4' />
                    </Button>
                </div>
                <div className='flex items-center ml-auto'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={!currThread}>
                            <Button className='ml-2' variant={'ghost'} size={'icon'} disabled={!currThread} >
                                <MoreVertical className='size-4' />
                                <span className='sr-only'>More</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem>Mark As Unread</DropdownMenuItem>
                            <DropdownMenuItem>Star Thread</DropdownMenuItem>
                            <DropdownMenuItem>Add Label</DropdownMenuItem>
                            <DropdownMenuItem>Mute Thread</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Separator />

            {currThread 
                ? (<>
                    <div className='flex flex-col flex-1 overflow-scroll'>
                        <div className='flex items-center p-4'>
                            <div className='flex items-center gap-4 text-sm'>
                                <Avatar>
                                    <AvatarImage alt='avatar'/>
                                    <AvatarFallback>
                                        {currThread.emails[0]?.from.name?.split(' ').map(part => part[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <div className="font-semibold">
                                        {currThread.emails[0]?.from.name}
                                        <div className="text-xs line-clamp-1">
                                            {currThread.emails[0]?.subject}
                                        </div>
                                        <div className="text-xs line-clamp-1">
                                            <span className='font-medium mr-1'>
                                                Reply-To: 
                                            </span>
                                            {currThread.emails[0]?.from.address}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {currThread.emails[0]?.sentAt && (
                                <div className='ml-auto text-xs text-muted-foreground'>
                                    {formatDate(new Date(currThread.emails[0].sentAt), 'PPpp')}
                                </div>
                            )}
                        </div>

                        <Separator />
                        
                        {/* change the height to 100vh - 500px when the reply component is ready */}
                        <div className='max-h-[calc(100vh-500px)] overflow-scroll flex flex-col'>
                            <div className="p-6 flex flex-col gap-4">
                                {currThread.emails.map((email) => {
                                    return <DisplayEmail key={email.id} email={email} />
                                })}
                            </div>
                        </div>

                        <div className="flex-1"></div>
                        <Separator className='mt-auto' />
                        <ReplyBox />
                    </div>
                </>)
                : (<div className='p-8 text-muted-foreground text-center'>
                    No Message Selected
                </div>)
            }
        </div>
    )
}

export default ThreadDisplay
