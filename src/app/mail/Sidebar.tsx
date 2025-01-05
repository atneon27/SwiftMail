import React from 'react'
import { Nav } from './Nav'
import { File, Inbox, MailQuestion, MailWarning, Send } from 'lucide-react'
import { useLocalStorage } from 'usehooks-ts'
import { api } from '@/trpc/react'

interface Props {
    isCollapsed: Boolean
}

export const Sidebar = ({ isCollapsed }: Props) => {
    const [accountId] = useLocalStorage('accountId', '')
    const [tab] = useLocalStorage<'inbox' | 'draft' | 'sent' | 'spam' | 'spoof'>('swiftmail-tab', 'inbox')

    const { data: inboxThread } = api.account.getNumThreads.useQuery({
        accountId,
        tab: 'inbox'
    })

    const { data: draftThread } = api.account.getNumThreads.useQuery({
        accountId,
        tab: 'draft'
    })

    const { data: sentThread } = api.account.getNumThreads.useQuery({
        accountId,
        tab: 'sent'
    })

    const { data: spamThread } = api.account.getNumThreads.useQuery({
        accountId,
        tab: 'spam'
    })

    const { data: spoofThread } = api.account.getNumThreads.useQuery({
        accountId,
        tab: 'spoof'
    })

    return (
        <div>
           <Nav
                isCollapsed={false}
                links={[{
                    title: 'Inbox',
                    label: inboxThread?.toString() ?? '0',
                    icon: Inbox,
                    variant: tab === 'inbox' ? 'default' : 'ghost'
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
                }, {
                    title: 'Spam', 
                    label: spamThread?.toString() ?? '0',
                    icon: MailQuestion,
                    variant: tab === 'spam' ? 'default' : 'ghost'
                }, {
                    title: 'Spoof', 
                    label: spoofThread?.toString() ?? '0',
                    icon: MailWarning,
                    variant: tab === 'spoof' ? 'default' : 'ghost'
                }]}
           />
        </div>
    )
}
