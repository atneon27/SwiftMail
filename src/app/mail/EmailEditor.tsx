'use client'

import React, { useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Text } from '@tiptap/extension-text'
import EditorMenu from './EditorMenu'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const EmailEditor = () => {
    const [value, setValue] = useState<string>('')

    const CustomText = Text.extend({
        addKeyboardShortcuts() {
            return {
                'Meta-j': () => {
                    console.log('Auto Complete feature')
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

    if(!editor) return null

    return (
        <div>
            <div className='flex p-4 py-2 border-b'>
                <EditorMenu editor={editor} />
            </div>
            <div className='prose w-full p-4'>
                <EditorContent editor={editor} value={value} />
            </div>
            
            <Separator />

            <div className='py-3 px-4 flex items-center justify-between'>
                <span className='text-sm'>
                    Tip: Press {" "}
                <kbd className='px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg'>
                    Cmd + J
                </kbd> {" "}
                For AI Autocomplete
                </span>
                <Button>
                    Send
                </Button>
            </div>
        </div>
    )
}

export default EmailEditor
