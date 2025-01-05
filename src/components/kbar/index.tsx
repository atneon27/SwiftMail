"use client"

import { type Action, KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarSearch } from 'kbar'
import ShortcutOptions from './ShortcutOptions'
import { useLocalStorage } from 'usehooks-ts'

export default function KBar({children}: {children: React.ReactNode}) {
    const [tab, setTab] = useLocalStorage('swiftmail-tab', 'inbox') 

    const actions: Action[] = [
        {
            id: 'inboxAction',
            name: 'Inbox',
            shortcut: ['g', 'i'],
            section: 'Navigation',
            subtitle: 'View Inbox',
            perform: () => {
                setTab('inbox')
            }
        }, {
            id: 'draftAction',
            name: 'Draft',
            shortcut: ['g', 'd'],
            section: 'Navigation',
            subtitle: 'View Draft',
            perform: () => {
                setTab('draft')
            }
        }, {
            id: 'sentAction',
            name: 'Sent',
            shortcut: ['g', 's'],
            section: 'Navigation',
            subtitle: 'View Sent',
            perform: () => {
                setTab('sent')
            }
        }, 
        // {
        //     id: 'pendingAction',
        //     name: 'See Pending',
        //     shortcut: ['g','p'],
        //     section: 'Navigation',
        //     subtitle: 'See Unseen Mails',
        //     perform: () => {

        //     }
        // }, {
        //     id: 'doneAction',
        //     name: 'See Done',
        //     shortcut: ['g','s'],
        //     section: 'Navigation',
        //     subtitle: 'See Seen Mails',
        //     perform: () => {
                
        //     }
        // }
    ]

    return <KBarProvider actions={actions}>
        <WrappedComponent>
            {children}
        </WrappedComponent>
    </KBarProvider>    
} 

const WrappedComponent = ({children}: {children: React.ReactNode}) => {
    return <>
        <KBarPortal>
            <KBarPositioner className='fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm scrollbar-hide !p-0 z-[999]'>
                <KBarAnimator className='max-w-[600px] !mt-64 w-full bg-white dark:bg-gray-800 text-foreground dark:text-gray-200 shadow-lg border dark:border-gray-600 rounded-lg overflow-hidden relative !-translate-y-12'>
                    <div className="bg-white dark:bg-gray-800">
                        <div className="border-x-0 border-b-2 dark:border-gray-700">
                            <KBarSearch className='py-4 px-6 text-lg w-full bg-white dark:bg-gray outline-none border-none focus:outline-none focus:ring-0 focus:ring-offset-0' />
                        </div>
                        <ShortcutOptions />
                    </div>
                </KBarAnimator>
            </KBarPositioner>
        </KBarPortal>
        {children}
    </>
}