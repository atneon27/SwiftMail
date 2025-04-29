import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useThreads } from '@/hooks/use-thread'
import { Clock, MailQuestion, MoreVertical, PanelTopDashed, Trash2 } from 'lucide-react'
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
import { useAtom } from 'jotai'
import { isSearchingAtom } from './SearchBar'
import SearchDisplay from './SearchDisplay'
import { api } from '@/trpc/react'
import { useLocalStorage } from 'usehooks-ts'
import { toast } from 'sonner'



const ThreadDisplay = () => {
    const {threads, threadId} = useThreads()
    const [accountId] = useLocalStorage('accountId', '')
    const [isSearching] = useAtom(isSearchingAtom)

    const markAsUnread = api.account.markAsUnread.useMutation()
    const markNotSpam = api.account.markNotSpam.useMutation()
    const starThread = api.account.starThread.useMutation()
    const deleteThread = api.account.deleteThread.useMutation()

    const currThread = threads?.find((thread) => {
        return thread.id === threadId
    })

    const handleMarkUnread = (threadId: string) => {
        markAsUnread.mutate({
            accountId,
            threadId
        }, {
            onSuccess: () => {
                toast.success("Marked as Unread")
            },
            onError: () => {
                toast.error("Error, while marking thread as unread")
            }
        })   
    }

    const handleMarkNotSpam = (threadId: string) => {
        markNotSpam.mutate({
            accountId,
            threadId
        }, {
            onSuccess: () => {
                toast.success("Marked Not as Spam")
            },
            onError: () => {
                toast.error("Error, while marking thread not as spam")
            }
        })
    }

    const handleStarThread = (threadId: string) => {
        starThread.mutate({
            accountId,
            threadId
        }, {
            onSuccess: () => {
                toast.success("Star marked the thread")
            },
            onError: () => {
                toast.error("Error, while star marking the thread")
            }
        })
    }

    const handleDeleteThread = (threadId: string) => {
        deleteThread.mutate({
            accountId,
            threadId
        }, {
            onSuccess: () => {
                toast.success("Thread Deleted Successfully")
            },
            onError: () => {
                toast.error("Error, while deleting the thread!!")
            }
        })
    }

    return (
        <div className="flex flex-col h-full">
            <div className='flex flex-row'>
                <div className="flex items-center p-2">
                    <div className='flex items-center gap-2'>
                        {/* <Button variant={'ghost'} size={'icon'} disabled={!currThread} >
                            <Archive className='size-4' />
                        </Button> */}
                        {/* Mark as not spam button */}
                        <Button 
                            onClick={() => {
                                handleMarkNotSpam(threadId ?? '')
                            }}
                            variant={'ghost'} 
                            size={'icon'} 
                            disabled={!currThread} 
                        >
                            <MailQuestion className='size-4' />
                        </Button>
                        {/* delete thread button */}
                        <Button 
                            onClick={() => {
                                handleDeleteThread(threadId ?? '')
                            }}
                            variant={'ghost'} 
                            size={'icon'} 
                            disabled={!currThread} 
                        >
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
                            <DropdownMenuItem onClick={() => handleMarkUnread(threadId ?? '')}>Mark As Unread</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStarThread(threadId ?? '')}>Star Thread</DropdownMenuItem>
                            {/* <DropdownMenuItem>Add Label</DropdownMenuItem>
                            <DropdownMenuItem>Mute Thread</DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Separator />

            {isSearching 
            ? <SearchDisplay />
                : (
                    <>
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
                            : (
                                <div className='p-8 text-muted-foreground text-center flex flex-col items-center justify-center h-full'>
                                    No Thread Selected
                                </div>
                            )
                        }
                    
                    </>
                )}
        </div>
    )
}

export default ThreadDisplay
