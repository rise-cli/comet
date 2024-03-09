import comet from '../src/index.mjs'

async function main() {
    const result = await comet.llm.local.micro({
        prompt: 'what is console logging in js?'
    })
    console.log(result.response)

    const vector = await comet.llm.local.vector(
        'i want to get text about somethin'
    )
    console.log(vector)
}

main()
