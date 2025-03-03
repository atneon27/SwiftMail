"use client"

import ThemeToggle from '@/components/ThemeToggle'
import dynamic from 'next/dynamic'
import React, { useState,useEffect } from 'react'
import CountdownTimer from './CountdownTimer'
import { api } from '@/trpc/react'
import { useLocalStorage } from 'usehooks-ts'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import EmailComposeDrawer from './EmailComposeDrawer'
// import { Mail } from './Mail'

const Mail = dynamic(() => import('./Mail').then(mod => mod.Mail), { ssr: false })

export default function Page() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 30000)
    }, [isLoading])

    // const isLoading = false
     
    return (
        <div className='relative'>
            {isLoading 
                ? (<div className='flex justify-center items-center h-screen text-muted-foreground gap-2'>
                    <div>Syncying Mails</div>
                    <CountdownTimer />
                </div>) 
                : (
                    <>
                        <div className="absolute bottom-4 left-4">
                            <div className="flex items-center gap-2">
                                <UserButton />
                                <ThemeToggle />    
                                <EmailComposeDrawer />
                            </div>
                        </div>    
                        <Mail
                            defaultLayout={[10,38,52]}
                            navCollapsedSize={4}
                            defaultCollapsed={true}
                        />
                    </>
                )
            }
        </div>
    )
}
