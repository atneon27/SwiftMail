import { useAtom } from 'jotai'
import { searchValueAtom, isSearchingAtom } from './SearchBar'
import { useDebounceValue } from 'usehooks-ts'
import { api } from '@/trpc/react'
import { useEffect } from 'react'
import { useThreads } from '@/hooks/use-thread'
import DOMPurify from 'dompurify'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'


const SearchDisplay = () => {
    const [searchValue, setSearchValue] = useAtom(searchValueAtom)
    const [isSearching, setIsSearching] = useAtom(isSearchingAtom)

    const [debouncedSearchValue] = useDebounceValue(searchValue, 800)
    const { accountId, setThreadId } = useThreads()

    const search = api.account.searchEmails.useMutation()

    useEffect(() => {
        if(!debouncedSearchValue || !accountId) return
        search.mutate({
            accountId,
            query: debouncedSearchValue
        })
    }, [debouncedSearchValue])

    return (
        <div className="p-4 max-h-[calc(100vh-70px)] overflow-y-scroll">
            <div className="flex items-center gap-2 mb-4">
                <h2 className='text-gray-600 dark:text-gray-400 text-md font-medium'>
                    Search Results for &qoute;{searchValue}&qoute; came back with {search.data?.count ?? 0} matches
                </h2>
                {search.isPending && <Loader2 className="size-4 animate-spin text-gray-400" />}
            </div>

            <ul className="flex flex-col gap-2">
                    {search.data?.hits.map((hit) => (
                        <li onClick={() => {
                            if (!hit.document.threadId) { toast.error("This message is not part of a thread"); return }
                            setIsSearching(false)
                            setThreadId(hit.document.threadId)
                        }} key={hit.id} className="border rounded-md p-4 hover:bg-gray-100 cursor-pointer transition-all dark:hover:bg-gray-900">
                            <h3 className="text-base font-medium">{hit.document.subject}</h3>
                            <div className='pt-2'>
                                <p className="text-sm text-gray-500 font-medium">
                                    From: {hit.document.from}
                                </p>
                                <p className="text-sm text-gray-500 font-medium">
                                    To: {(hit.document.to as string[]).join(", ")}
                                </p>
                                <p className="text-sm mt-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(hit.document.rawBody, { USE_PROFILES: { html: true } }) }} />
                            </div>
                        </li>
                    ))}
                </ul>
        </div>
    )
}

export default SearchDisplay
