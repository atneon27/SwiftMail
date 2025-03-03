import React, { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import EmailEditor from './EmailEditor'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { useThreads } from '@/hooks/use-thread'

const EmailComposeDrawer = () => {
    const { account } = useThreads()
    const [subject, setSubject] = useState<string>("")
    const [toValues, setToValues] = useState<{ label: string, value: string }[]>([])
    const [ccValues, setCcValues] = useState<{ label: string, value: string }[]>([])

    const sendEmail = api.account.sendEmail.useMutation()

    const handelSend = async (value: string) => {
        if(!account) return
        sendEmail.mutate({
            accountId: account.id,
            threadId: undefined,
            body: value,
            from: { name: account.name ?? 'Me', address: account.emailAddress ?? 'me@example.com' },
            to: toValues.map(to => ({ name: to.value, address: to.value })),
            cc: ccValues.map(cc => ({ name: cc.value, address: cc.value })),
            replyTo: { name: account.name ?? 'Me', address: account.emailAddress ?? 'me@example.com'},
            subject: subject
        }, {
            onSuccess: () => {
                toast.success("Email Sent!")
            },
            onError: (error) => {
                console.log(error)
                toast.success("Error Sending Email")
            }
        })
    }

    return (
        <Drawer>
            <DrawerTrigger>
                <Button >
                    <Pencil className='size-4 mr-1' />
                    Compose
                </Button>
            </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Compose Email</DrawerTitle>
                    </DrawerHeader>
                    <EmailEditor 
                        subject={subject}
                        toValues={toValues}
                        ccValues={ccValues}
                        setSubject={setSubject}
                        setToValues={setToValues}
                        setCcValues={setCcValues}
                        to={toValues.map(to => to.value)}
                        defaultToolbarExpanded={true}
                        isSending={sendEmail.isPending}
                        handleSend={handelSend}
                    />
            </DrawerContent>
        </Drawer>

    )
}

export default EmailComposeDrawer
