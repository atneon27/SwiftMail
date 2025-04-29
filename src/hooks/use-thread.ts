import { api } from '@/trpc/react'
import { atom, useAtom } from 'jotai'
import { useLocalStorage } from 'usehooks-ts'

export const threadIdAtom = atom<string | null>(null)

export const useThreads = () => {
    const { data: accounts } = api.account.getAccounts.useQuery()
    const [accountId] = useLocalStorage('accountId', '')
    const [tab] = useLocalStorage('swiftmail-tab', 'inbox')
    const [opened] = useLocalStorage('smail-done', false)

    const [threadId, setThreadId] = useAtom(threadIdAtom)

    const { data: threads, isFetching, refetch, isPending } = api.account.getThreads.useQuery({
        accountId, 
        tab, 
        opened
    }, {
        enabled: !!accountId && !!tab,
        placeholderData: e => e,
        refetchInterval: 3000
    })

    return {
        threads,
        isFetching,
        isPending,
        refetch,
        accountId,
        threadId,
        setThreadId,
        account: accounts?.find(e => e.id === accountId)
    }
}