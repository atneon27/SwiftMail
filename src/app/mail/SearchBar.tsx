import { Input } from "@/components/ui/input";
import { useAtom, atom } from "jotai";
import { Search, X } from "lucide-react";
import { useThreads } from "@/hooks/use-thread";

export const searchValueAtom = atom("")
export const isSearchingAtom = atom(false)

const SearchBar = () => {
    const [searchValue, setSearchValue] = useAtom(searchValueAtom)
    const [isSearching, setIsSearching] = useAtom(isSearchingAtom)
    const { isFetching } = useThreads()

    const handelBlur = () => {
        if(searchValue != '') return
        console.log(isSearching)
    }

    return (
        <div className="relative">
            <Search className="absolute left-2 top-3 size-4 text-muted-foreground" />
            <Input 
                placeholder="Search..." 
                className="pl-8 py-5"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearching(true)}
                onBlur={() => handelBlur()}
            />
            <div className="absolute right-2 top-3 flex items-center gap-2">
                {/* {isFetching && <Loader2 className="size-4 animate-spin text-grey-400" />} */}
                <button 
                    className="rounded-sm hover:bg-gray-400/20"
                    onClick={() => {
                        setSearchValue('')
                        setIsSearching(false)
                    }}
                >
                    <X className="size-4 text-gray-400"/>
                </button>
            </div>
        </div>
    )
}

export default SearchBar;