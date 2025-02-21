'use client'

import React, { useState } from 'react'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Text } from '@tiptap/extension-text'
import EditorMenu from './EditorMenu'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import RecipentOptions from './RecipentOptions'
import { Input } from '@/components/ui/input'
import AIComposeButton from './AIComposeButton'
import { autoGenerate } from './action'
import { readStreamableValue } from 'ai/rsc'

type Props = {
    subject: string
    setSubject: (value: string) => void
    
    toValues: { label: string, value: string }[]
    setToValues: (value: { label: string, value: string }[]) => void
    
    ccValues: { label: string, value: string }[]
    setCcValues: (value: { label: string, value: string }[]) => void
    
    to: string[]
    handleSend: (value: string) => void
    
    isSending: boolean
    defaultToolbarExpanded: boolean
}

const EmailEditor = ({
    subject,
    toValues,
    ccValues,
    to,
    setSubject,
    setToValues,
    setCcValues,
    handleSend,
    isSending,
    defaultToolbarExpanded
}: Props) => {
    const [val, setValue] = useState<string>('')
    const [expanded, setExpended] = useState<boolean>(defaultToolbarExpanded)
    
    const autoComplete = async (text: string, editor: Editor) => {
        const {output} = await autoGenerate(text)
        
        let generatedText = ''
        
        for await (const token of readStreamableValue(output)) {
            generatedText += token
        }
        
        if(generatedText) {
            editor.commands.clearContent()
            editor.commands.insertContent(generatedText)
        }
    }
    
    const CustomText = Text.extend({
        addKeyboardShortcuts() {
            return {
                'Ctrl-j': () => {
                    const editor = this.editor;
                    const text = editor.getText()
                    autoComplete(text, editor)
                    return true
                }
            }
        }
    })
    
    const editor = useEditor({
        autofocus: false,
        extensions: [StarterKit, CustomText],
        onUpdate: ({editor}) => {
            setValue(editor.getHTML())
        }
    })
    
    const onGenerate = (token: string) => {
        editor?.commands.insertContent(token)
    }
    
    if(!editor) return null
    
    return (
        <div>
            <div className='flex p-4 py-2 border-b'>
                <EditorMenu editor={editor} />
            </div>

            <div className='p-4 space-y-2 pb-0'>
                {expanded && (
                    <>
                        <RecipentOptions 
                            label='To'
                            onChange={setToValues}
                            placeholder='add recipents'
                            val={toValues}
                        />
                        <RecipentOptions 
                            label='Cc'
                            onChange={setCcValues}
                            placeholder='add recipents'
                            val={ccValues}
                        />
                       <Input
                            id='subject'
                            placeholder='Subject'
                            value={subject}
                            onChange={(e) => {
                                setSubject(e.target.value)
                            }}
                        />
                    </>
                )}

                <div
                    onClick={() => {
                        setExpended(!expanded)
                    }} 
                    className='cursor-pointer flex items-center gap-2'
                >
                    <span className='text-green-400 font-medium'>
                        Draft {" "}
                    </span>
                    <span>
                        to {to.join(' ')}
                    </span>
                    <AIComposeButton isComposing={defaultToolbarExpanded} onGenerate={onGenerate}/>
                </div>
            </div>

            <div className='prose w-full p-4'>
                <EditorContent editor={editor} />
            </div>
            
            <Separator />

            <div className='py-3 px-4 flex items-center justify-between gap-2'>
                <span className='text-sm'>
                    Tip: Press {" "}
                <kbd className='px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg'>
                    Ctrl + J
                </kbd> {" "}
                For AI Autocomplete
                </span>
                <Button onClick={() => {
                    editor.commands.clearContent()
                    handleSend(val)
                }} disabled={isSending}>
                    Send
                </Button>
            </div>
        </div>
    )
}

export default EmailEditor
