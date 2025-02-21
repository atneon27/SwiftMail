import React, { useEffect, useState } from 'react'
import EmailEditor from './EmailEditor'
import { api, RouterOutputs } from '@/trpc/react'
import { useThreads } from '@/hooks/use-thread'

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

    const handelSend = async (value: string) => {
        console.log(value)
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
            isSending={false}
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
