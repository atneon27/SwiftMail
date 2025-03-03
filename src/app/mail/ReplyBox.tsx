import React, { useEffect, useState } from 'react'
import EmailEditor from './EmailEditor'
import { api, RouterOutputs } from '@/trpc/react'
import { useThreads } from '@/hooks/use-thread'
import { toast } from 'sonner'

const Component = ({ replyDetails }: { replyDetails: NonNullable<RouterOutputs['account']['getReplyDetails']>}) => {
    const { threadId, accountId } = useThreads()

    const [subject, setSubject] = useState<string>(replyDetails.subject.startsWith('Re') ? replyDetails.subject : `Re ${replyDetails.subject}`)
    const [toValues, setToValues] = useState<{ label: string, value: string }[]>(replyDetails.to.map(to => ({ label: to.address, value: to.address })))
    const [ccValues, setCcValues] = useState<{ label: string, value: string }[]>(replyDetails.cc.map(cc => ({ label: cc.address, value: cc.address }))) 

    useEffect(() => {
        if(!threadId || !replyDetails) return

        if(!replyDetails.subject.startsWith('Re')) {
            setSubject(`Re ${replyDetails.subject}`)
        } else {
            setSubject(replyDetails.subject)
        }

        setToValues(replyDetails.to.map(to => ({ label: to.address, value: to.address })))
        setCcValues(replyDetails.cc.map(cc => ({ label: cc.address, value: cc.address }))) 

    }, [threadId, accountId])

    const sendEmail = api.account.sendEmail.useMutation()

    const handelSend = async (value: string) => {
        if(!replyDetails) return
        sendEmail.mutate({
            accountId,
            threadId: threadId ?? undefined,
            body: value,
            subject,
            from: replyDetails.from,
            to: replyDetails.to.map(to => ({ address: to.address, name: to.name ?? ""})),
            cc: replyDetails.to.map(cc => ({ address: cc.address, name: cc.name ?? ""})),
            replyTo: replyDetails.from,
            inReplyTo: replyDetails.id
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
        <EmailEditor 
            subject={subject}
            setSubject={setSubject}
            toValues={toValues}
            setToValues={setToValues}
            ccValues={ccValues}
            setCcValues={setCcValues}
            to={replyDetails.to.map(to => to.address)}
            handleSend={handelSend}
            isSending={sendEmail.isPending}
            defaultToolbarExpanded={false}
        />
    )

}

const ReplyBox = () => {
    const { accountId, threadId } = useThreads()

    const { data: replyDetails } = api.account.getReplyDetails.useQuery({
        accountId,
        threadId: threadId ?? ''
    })
    
    if(!replyDetails) return <></>
    return <Component replyDetails={replyDetails} />
}

export default ReplyBox
