import React from 'react'
import { Nav } from './Nav'
import { File, Inbox, MailQuestion, Send } from 'lucide-react'
import { useLocalStorage } from 'usehooks-ts'
import { api } from '@/trpc/react'
import BottomControl from './BottomControl'

interface Props {
    isCollapsed: boolean
}

export const Sidebar = ({ isCollapsed }: Props) => {
    const [accountId] = useLocalStorage('accountId', '')
    const [tab] = useLocalStorage<'inbox' | 'draft' | 'sent' | 'spam' | 'spoof'>('swiftmail-tab', 'inbox')

    const { data: inboxThread } = api.account.getNumThreads.useQuery({
        accountId,
        tab: 'inbox'
    }, {
        refetchInterval: 5000
    })

    const { data: draftThread } = api.account.getNumThreads.useQuery({
        accountId,
        tab: 'draft'
    }, {
        refetchInterval: 5000
    })

    const { data: sentThread } = api.account.getNumThreads.useQuery({
        accountId,
        tab: 'sent'
    }, {
        refetchInterval: 5000
    })

    const { data: spamThread } = api.account.getNumThreads.useQuery({
        accountId,
        tab: 'spam'
    }, {
        refetchInterval: 5000
    })


    return (
        <div>
           <Nav
                isCollapsed={isCollapsed}
                links={[{
                    title: 'Inbox',
                    label: inboxThread?.toString() ?? '0',
                    icon: Inbox,
                    variant: tab === 'inbox' ? 'default' : 'ghost'
                }, {
                    title: 'Spam', 
                    label: spamThread?.toString() ?? '0',
                    icon: MailQuestion,
                    variant: tab === 'spam' ? 'default' : 'ghost'
                }, {
                    title: 'Draft',
                    label: draftThread?.toString() ?? '0',
                    icon:   File,
                    variant: tab === 'draft' ? 'default' : 'ghost'
                }, {
                    title: 'Sent',
                    label: sentThread?.toString() ?? '0',
                    icon: Send,
                    variant: tab === 'sent' ? 'default' : 'ghost'
                }
            ]}
           />
           <div className="absolute bottom-4 left-4">
                <BottomControl isCollapsed={isCollapsed} />
            </div> 
        </div>
    )
}
