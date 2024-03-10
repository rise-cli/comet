import comet from '../../src/index.mjs'

const server = comet.server()

server.front('front/')

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
     * Get HTML documents
     */
    let htmlResult = ''
    const res = await comet.website.search(data.question)
    for (const r of res) {
        const html = await comet.website.getHtml(r.url)
        const text = comet.website.getTextFromHtml(html)
        htmlResult = htmlResult + text
    }

    /**
     * Make Prompt
     */
    const prompt = `I have a question: ${data.question}

When searching the internet, I found these html documents and pulled out the text. They may help in answering the question: 
${htmlResult}
    
Can you help me answer this using the context above and your best understanding of the topic?`

    const messages = [
        {
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: data.question
                }
            ]
        }
    ]

    /**
     * Execute LLM call
     */
    const result = await comet.llm.aws.sonnet({ messages })
    return {
        answer: result,
        time: getTime()
    }
})

server.start()
