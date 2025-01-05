"use client"

import ThemeToggle from '@/components/ThemeToggle'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
// import { Mail } from './Mail'

const Mail = dynamic(() => import('./Mail').then(mod => mod.Mail), { ssr: false })

export default function Page() {
    // const [isLoading, setIsLoading] = useState<boolean>(true)
    
    // useEffect(() => {
    //     setTimeout(() => {
    //         setIsLoading(false)
    //     }, 120000)
    // }, [isLoading])

    let isLoading = false
     
    return (
        <div>
            {isLoading 
                ? (<div>Loading...</div>) 
                : (
                    <>
                        <div className="absolute bottom-4 left-4">
                            <ThemeToggle />    
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
