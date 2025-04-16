import React from 'react'
import { cookies } from 'next/headers'
import { Mail } from './Mail'

export default async function Page() {
    const cookieStore = await cookies()

    const layout = cookieStore.get("react-resizable-panels:layout:mail")
    const collapsed = cookieStore.get("react-resizable-panels:collapsed")

    const defaultLayout = layout ? JSON.parse(layout.value) : undefined
    const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined
     
    return (
        <div className='relative'>
            <>   
                <Mail
                    defaultLayout={defaultLayout}
                    navCollapsedSize={4}
                    defaultCollapsed={defaultCollapsed}
                />
            </>
        </div>
    ) 
}
