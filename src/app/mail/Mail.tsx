import React, { useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Tabs } from '@/components/ui/tabs'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'
import AccountSwitcher from '@/app/mail/AccountSwitcher'
import { Sidebar } from './Sidebar'
import ThreadList from './ThreadList'
import ThreadDisplay from './ThreadDisplay'

type Props = {
    defaultLayout: number[] | undefined
    navCollapsedSize: number
    defaultCollapsed: boolean
}

export const Mail = ({ defaultLayout = [15, 35, 50], navCollapsedSize, defaultCollapsed }: Props) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    
    return (
        <TooltipProvider delayDuration={0} >
            <ResizablePanelGroup direction='horizontal' onLayout={(sizes: number[]) => {
                console.log(sizes)
            }} className='items-stretch h-full min-h-screen'>
                <ResizablePanel 
                    defaultSize={defaultLayout[0]} 
                    collapsedSize={navCollapsedSize}
                    collapsible={true}
                    minSize={15}
                    maxSize={40}
                    onCollapse={() => {
                        setIsCollapsed(true)
                    }}
                    onResize={() => {

                    }}  
                    className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}  
                >
                    <div className='flex flex-col h-full flex-1'>
                       <div className={cn('flex h-[52px] items-center justify-between', isCollapsed ? 'h-[52px]' : 'px-2')}>
                        {/* email account switcher */}
                            <AccountSwitcher isCollapsed={false} />
                        </div> 
                        <Separator />
                        
                        <Sidebar isCollapsed={false} />

                        <div className='flex-1'></div>
                        {/* Ask AI */}
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel 
                    defaultSize={defaultLayout[1]}
                    collapsible={false}
                    minSize={30}
                >
                    <Tabs defaultValue='inbox'>
                        <div className='flex justify-between items-center p-4 py-2'>
                            <h1 className='text-xl font-bold'>Inbox</h1>
                            <TabsList className='ml-auto bg-gray-100 dark:bg-gray-800'>
                                <TabsTrigger value='inbox' className='text-zinc-600 dark:text-zinc-200'>
                                    Inbox
                                </TabsTrigger>
                                <TabsTrigger value='done' className='text-zinc-600 dark:text-zinc-200'>
                                    Done
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <Separator />
                        <div className='h-4'></div>
                        {/* Search Bar */}

                        <TabsContent value='inbox'>
                            <ThreadList /> 
                        </TabsContent>
                        <TabsContent value='done'>
                            Unread
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    defaultSize={defaultLayout[2]}
                    minSize={30}
                >   
                    <ThreadDisplay />
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    )
}
