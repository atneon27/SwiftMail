import { api } from '@/trpc/react'
import { atom, useAtom } from 'jotai'
import { useLocalStorage } from 'usehooks-ts'

export const threadIdAtom = atom<string | null>(null)

export const useThreads = () => {
    const { data: accounts } = api.account.getAccounts.useQuery()
    const [accountId] = useLocalStorage('accountId', '')
    const [tab] = useLocalStorage('swiftmail-tab', 'inbox')
    const [done] = useLocalStorage('swiftmail-done', false)

    const [threadId, setThreadId] = useAtom(threadIdAtom)

    const { data: threads, isFetching, refetch } = api.account.getThreads.useQuery({
        accountId, 
        tab, 
        done
    }, {
        enabled: !!accountId && !!tab,
        placeholderData: e => e,
        refetchInterval: 10000
    })

    return {
        threads,
        isFetching,
        refetch,
        accountId,
        threadId,
        setThreadId,
        account: accounts?.find(e => e.id === accountId)
    }
}