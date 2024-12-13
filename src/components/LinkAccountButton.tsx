"use client"

import React from 'react'
import { Button } from './ui/button'
import { getAurinkoAuthUrl } from '@/lib/aurinko'

interface Props {
    ButtonText: string
}

export const LinkAccountButton = ({ ButtonText }: Props) => {
    return (
        <Button onClick={async () => {
            const aurinkoUrl = await getAurinkoAuthUrl('Google')
            window.location.href = aurinkoUrl
        }}>
            {ButtonText}
        </Button>
    )
}
