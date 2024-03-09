import comet from '../src/index.mjs'

async function main() {
    const messages = [
        {
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: 'give me 3 reasons in concise pointform why llms are worth my time'
                }
            ]
        }
    ]
    const result = await comet.llm.aws.sonnet({ messages })
    console.log(result)
}

main()
