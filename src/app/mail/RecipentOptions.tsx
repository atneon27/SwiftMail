import { useThreads } from '@/hooks/use-thread'
import { api } from '@/trpc/react'
import { useState } from 'react'
import Avatar from 'react-avatar'
import Select from 'react-select'

type Props = {
    placeholder: string
    label: string
    
    onChange: (values: { label: string, value: string }[]) => void
    val: { label: string, value: string }[]
}

const RecipentOptions = ({ placeholder, label, onChange, val }: Props) => {
    const { accountId } = useThreads()

    const { data: suggestions } = api.account.getSuggestions.useQuery({
        accountId
    })

    const options = suggestions?.map(suggestions => ({
        label: (
            <span className='flex items-center gap-2'>
                <Avatar name={suggestions.address} size='25' textSizeRatio={2} round={true} />
                {suggestions.address}
            </span>
        ), 
        value: suggestions.address
    }))
    
    const [inputValue, setInputValue] = useState<string>("")

    return (
        <div className="border rounded-md flex items-center gap-2">
            <span className='ml-3 text-sm text-gray-500'>
                {label}
            </span>
            <Select
                onInputChange={setInputValue}
                value={val}
                className='w-full flex-1 dark:text-black'
                // @ts-ignore
                options={inputValue ? options?.concat({
                    // @ts-ignore
                    label: inputValue,
                    value: inputValue
                }) : options}
                // @ts-ignore
                onChange={onChange}
                placeholder={placeholder}
                isMulti
                classNames={{
                    control: () => {
                        return '!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent'
                    },
                    multiValue: () => {
                        return 'dark:!bg-gray-700'
                    }, 
                    multiValueLabel: () => {
                        return 'dark:text-white dark:bg-gray-700 rounded-md'
                    },
                    input: () => {
                        return 'dark:text-white'
                    }
                }}
            />
        </div>
    )
}

export default RecipentOptions;
