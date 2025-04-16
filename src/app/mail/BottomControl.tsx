import React from 'react'
import { UserButton } from '@clerk/nextjs'
import ThemeToggle from '@/components/ThemeToggle'  
import EmailComposeDrawer from './EmailComposeDrawer'

interface Props {
    isCollapsed: boolean
}

const BottomControl = ({ isCollapsed }: Props) => {
    return !isCollapsed ? (
        <div className="flex items-center gap-2">
            <UserButton />
            <ThemeToggle />    
            <EmailComposeDrawer isCollapsed={false} />
        </div>
    ) : (
        <div className='flex flex-col items-center gap-2'>
            <EmailComposeDrawer isCollapsed={true} />
            <ThemeToggle />    
            <UserButton />
        </div>
    )
}

export default BottomControl
