"use client"

import { api } from '@/trpc/react'
import React from 'react'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '../../components/ui/select'
import { useLocalStorage } from 'usehooks-ts'
import { cn } from '@/lib/utils'
import { LogOutIcon, Plus } from 'lucide-react'
import { getAurinkoAuthUrl } from '@/lib/aurinko'
import { SignOutButton, useClerk, UserButton } from '@clerk/nextjs'

type Props = {
    isCollapsed: boolean
}

const AccountSwitcher = ({ isCollapsed }: Props) => {
    const { signOut } = useClerk()
    const { data } = api.account.getAccounts.useQuery()
    const [accountId, setAccountId] = useLocalStorage('accountId', data?.[0]?.id ?? "") 

    if(!data) return null

    return (
        <Select defaultValue={accountId} onValueChange={setAccountId}>
            <SelectTrigger 
                className={cn('flex w-full flex-1 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-8',
                    isCollapsed && 'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden'
                )}
                aria-label='Select Account'
            >
                <SelectValue placeholder="Select an Account">
                    <span className={cn({'hidden': !isCollapsed})}>
                        {data.find((acc) => {
                            return acc.id === accountId
                        })?.emailAddress[0]?.toUpperCase()}
                    </span>
                    <span className={cn({'hidden': isCollapsed, 'ml-2': true})}>
                        {data.find((acc) => acc.id === accountId)?.emailAddress}
                    </span>
                </SelectValue>

                <SelectContent>
                    {data.map((acc) => {
                        return <SelectItem key={acc.id} value={acc.id}>
                            {acc.emailAddress}
                        </SelectItem>
                    })}
                    <div 
                        onClick={async () => {
                            const aurinkoUrl = await getAurinkoAuthUrl('Google')
                            window.location.href = aurinkoUrl
                        }}
                        className='flex relative items-center w-full rounded-sm hover:bg-gray-50 cursor-pointer text-sm py-1.5 pr-2 pl-8 outline-none focus:bg-asccent'
                    >
                        <Plus className="size-4 mr-1" />
                        Add another account 
                    </div>
                    {/* <div 
                        onClick={async() => {
                            await signOut()
                        }}
                        className='flex relative items-center w-full text-red-500 rounded-sm hover:bg-gray-50 cursor-pointer text-sm py-1.5 pr-2 pl-8 outline-none focus:bg-asccent'
                    > 
                        <LogOutIcon className='size-4 mr-1' />
                        Sign Out
                    </div> */}
                    <button
                        onClick={async() => {
                            await signOut()
                        }}
                        className='flex relative items-center w-full text-red-500 rounded-sm hover:bg-gray-50 cursor-pointer text-sm py-1.5 pr-2 pl-8 outline-none focus:bg-asccent'
                    >
                        <LogOutIcon className='size-4 mr-1' />
                        <SignOutButton />
                    </button>
                </SelectContent>
            </SelectTrigger>
        </Select>
    )
}

export default AccountSwitcher
