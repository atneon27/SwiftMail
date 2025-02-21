'use client'

import React, { use, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateEmail } from './action'
import { readStreamableValue } from 'ai/rsc'
import { useThreads } from '@/hooks/use-thread'
import { turndown } from '@/lib/turndown'


interface Props {
    isComposing: boolean,
    onGenerate: (token: string) => void   
}

const AIComposeButton = (props: Props) => {
    const [open, setOpen] = useState<boolean>(false)
    const [prompt, setPrompt] = useState<string>("")
    const { threads, threadId, account } = useThreads()

    const thread = threads?.find(thread => thread.id === threadId)

    const generateResponse = async () => {
        let context = ''
    
        if(!props.isComposing) {
            for(const email of thread?.emails ?? []) {
                const content = `
                    from: ${email.from}
                    subject: ${email.subject}
                    sentAt: ${new Date(email.sentAt).toLocaleString()}
                    Body: ${turndown.turndown(email.body ?? email.bodySnippet ?? '')}
                `
    
                context += content
            }
    
            context += `The email sender name is ${account?.name} and email address is ${account?.emailAddress}`
        }   
    
        const { output } = await generateEmail(context, prompt)
        for await (const token of readStreamableValue(output)) {
            if(token) {
                props.onGenerate(token)
            }
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button size='icon' variant='outline' onClick={() => {
                    setOpen(true)
                }}>
                    <Bot className='size-5' />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI Email Compose</DialogTitle>
                    <DialogDescription>
                        Auto Compose your email's with the help of AI
                    </DialogDescription>
                    <div className='h-2'></div>
                    <textarea 
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)} 
                        className='p-2 focus:outline-none border rounded-md dark:bg-black dark:text-slate-300 border-slate-400' 
                        placeholder='Enter a prompt to generate an email'
                    />
                    <Button onClick={() => {
                        generateResponse()
                        setOpen(false)
                        setPrompt("")
                    }}>
                        Generate
                    </Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AIComposeButton
