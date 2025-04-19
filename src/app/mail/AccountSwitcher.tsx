"use client"

import { api } from '@/trpc/react'
import React, { useEffect } from 'react'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '../../components/ui/select'
import { useLocalStorage } from 'usehooks-ts'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { getAurinkoAuthUrl } from '@/lib/aurinko'
import { toast } from 'sonner'
import Avatar from 'react-avatar'

type Props = {
    isCollapsed: boolean
}

const AccountSwitcher = ({ isCollapsed }: Props) => {
    const { data } = api.account.getAccounts.useQuery()
    const [accountId, setAccountId] = useLocalStorage('accountId', "") 

    const handleLoginRedirect = async () => {
        try {
            const aurinkoUrl = await getAurinkoAuthUrl('Google')    
            window.location.href = aurinkoUrl
        } catch(err) {
            toast((err as Error).message)
        }
    }

    useEffect(() => {
        if(data && data.length > 0) {
            if(accountId && data.some(acc => acc.id === accountId)) return
            setAccountId(data[0]!.id)
        } else if(data && data.length === 0) {

            setAccountId("")

            toast('Link your email to get started', {
                action: {
                    label: 'Link',
                    onClick: () => {
                        void handleLoginRedirect()
                    }
                }
            })
        }
    }, [data])

    const unlinkHandler = api.account.unlinkAccount.useMutation()

    const handelAccountUnlink = async (accId: string) => {
        unlinkHandler.mutate({
            accountId: accId
        }, {
            onSuccess: () => {
                toast.success("Account Unlinked!")
            },
            onError: (error) => {
                console.log(error)
                toast.success("Error Unlinking Account")
            }
        })
        setAccountId("")
    }

    if(!data) return <></>

    return (
        <Select 
            defaultValue={accountId} 
            onValueChange={setAccountId}
        >
            <SelectTrigger 
                className={cn('flex w-full flex-1 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-8',
                    isCollapsed && 'flex h-9 w-9 shrink-0 items-center border-0 focus:outline-none justify-center p-0 [&>span]:w-auto [&>svg]:hidden'
                )}
                aria-label='Select Account'
            >
                <SelectValue placeholder="Select an Account">
                    {/* <span className={cn({'hidden': !isCollapsed})}>
                        {data.find((acc) => {
                            return acc.id === accountId
                        })?.emailAddress[0]?.toUpperCase()}
                    </span> */}
                    <span className={cn('flex justify-center items-center', {'visible': isCollapsed, 'ml-2': true})}>
                        <Avatar  name={data.find((acc) => acc.id === accountId)?.name} email={data.find((acc) => acc.id === accountId)?.emailAddress} size='28' textSizeRatio={2} round={true} />
                    </span>
                    <span className={cn({'hidden': isCollapsed, 'ml-2': true})}>
                        {data.find((acc) => acc.id === accountId)?.emailAddress}
                    </span>
                </SelectValue>

                <SelectContent>
                    <div className='flex flex-col justity-center items-center gap-2'>
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
                            className='flex relative items-center w-full rounded-sm hover:bg-gray-50 cursor-pointer dark:hover:text-black text-sm py-1.5 pr-2 pl-8 outline-none focus:bg-asccent'
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
                            onClick={async () => {
                                await handelAccountUnlink(accountId)
                            }}
                            className='flex relative justify-start items-center w-full text-red-500 rounded-sm hover:bg-gray-50 cursor-pointer text-sm py-1.5 pr-2 pl-8 outline-none focus:bg-asccent'
                        >
                            <Trash2 className='size-4 mr-1' />
                            <div>
                                Delete Linked Account
                            </div>
                        </button>
                    </div>
                </SelectContent>
            </SelectTrigger>
        </Select>
    )
}

export default AccountSwitcher
