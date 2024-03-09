import {
    BedrockRuntimeClient,
    InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-east-1' })

async function sonnet({
    messages,
    system = '',
    temperature = 0.9,
    maxTokens = 400,
    topK = 250,
    topP = 0.999,
    stop = []
}) {
    const promptParams = {
        system: system,
        messages: messages,
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        stop_sequences: stop,
        temperature,
        top_k: topK,
        top_p: topP
    }

    const params = {
        modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
        contentType: 'application/json',
        accept: '*/*',
        body: JSON.stringify(promptParams)
    }

    const command = new InvokeModelCommand(params)
    const data = await client.send(command)

    const asciiDecoder = new TextDecoder('ascii')
    const res = asciiDecoder.decode(data.body)

    return JSON.parse(res).content[0].text
}

export default {
    sonnet
}
