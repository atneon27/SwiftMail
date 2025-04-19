'use server'

import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'

export async function generateEmail(context: string, prompt: string) {
    const stream = createStreamableValue('');

    void (
        async () => {
            const { textStream } = streamText({
                model: openai('gpt-4o'),
                prompt: `
                You are a helpful AI embedded in a email client app that is used to answer questions about the emails in the inbox.
                
                THE TIME NOW IS ${new Date().toLocaleString()}

                START CONTEXT BLOCK
                ${context}
                END CONTEXT BLOCK

                USER PROMPT:
                ${prompt}

                when responding, keep in mind
                - Be helpful, clever and articulate.
                - Rely on the provided email context to inform you response.
                - If the contex dose not contain enough information to fully address the entire prompt, politely give a draft response.
                - Avoid apologizing for previous response, Insted, indicate that you have updated you knowledge based on the previous information.
                - In the response do not add the subject again.
                - Directly give the reply to the email only, do not add any pleasentries like 'Certaily, I will help with that' or 'Here's your mail' etc.
                `,
            })

            for await (const delta of textStream) {
                stream.update(delta)
            }

            stream.done()
        }
    )()

    return { output: stream.value }
}

export async function autoGenerate(input: string) {
    const stream = createStreamableValue('');

    void (
        async () => {
            const { textStream } = streamText({
                model: openai('gpt-4o'),
                prompt: `
                ALWAYS RESPOND IN PLAIN TEXT, NOT IN HTML OR MARKDOWN
                Help me complete my train of thought here: <input>${input}</input>

                - The AI is embedded in an email app and offers autocompletion similar to the Google Gmail client.
                - The AI's traits include expertise, helpfulness, cleverness, and articulateness.
                - AI responses are polite, professional, and concise.
                - The AI maintains a friendly, kind, and inspiring tone and always provides thoughtful responses.
                - The AI should match the tone and context of the input without adding fluff, pleasantries, or unnecessary phrases like "understood" or "here is your response."
                - The AI only completes the sentence or provides a direct response when needed, maintaining brevity.
                - Do not add new lines, markdown, or any extra formatting.

                Example:
                Dear Alice, I'm sorry that you are feeling down.

                Output:
                Unfortunately, I can't help you with that.

                return the output directly without any formatting.
                `,
            })

            for await (const delta of textStream) {
                stream.update(delta)
            }

            stream.done()
        }
    )()

    return { output: stream.value }
}