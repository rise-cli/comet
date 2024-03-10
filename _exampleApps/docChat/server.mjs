import comet from '../../src/index.mjs'

const server = comet.server()

server.front('front/') // where my html, css, js, png, jpgs are

function timer() {
    const start = Date.now()

    return () => {
        const end = Date.now()
        const time = end - start
        const formattedtime = (time / 1000).toFixed(2)
        return formattedtime
    }
}

server.api('/submit', async (data) => {
    const getTime = timer()

    /**
     * Get context via RAG
     */
    const db = await comet.vector.openExistingLocalDb({ path: './db.json' })
    const query = await comet.llm.local.vector(data.question)
    const result = await db.search(query.embedding, 2)
    const context = result[0].item.data + result[1].item.data

    console.log(context.slice(0, 3000))
    /**
     * Make Prompt
     */
    const finalText = `I have a question about how to use the aws-lite library. Here is my question: ${data.question}

When I searched the documentation for aws-lite I got the following:
<context>
${context}
</context>

Note that code examples are given in the context, it just isnt surrounded by template literals.

Can you help me with my question.`

    /**
     * LLM Call
     */
    const messages = [
        {
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: finalText
                }
            ]
        }
    ]
    const llmresult = await comet.llm.aws.sonnet({ messages })
    return {
        answer: llmresult,
        time: getTime()
    }
})

server.start()
