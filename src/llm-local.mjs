import ollama from 'ollama'

const modals = {
    tinyllama: 'tinyllama',
    llama2: 'llama2',
    codellama: 'codellama:7b',
    phi: 'phi'
}

async function makeGenerate(input, model) {
    const prompt = input.prompt
    const temperature = input.temperature || 0.9
    const seed = input.seed || undefined
    const system = input.system || undefined
    const stop = input.stop || undefined
    const json = input.json || false

    const payload = {
        model: model,
        system,
        options: {
            temperature: temperature,
            seed: seed,
            stop: stop
        },
        prompt: `[INST]${prompt}[/INST]`
    }
    if (json) {
        payload.format = 'json'
    }

    return await ollama.generate(payload)
}

async function meta(input) {
    return makeGenerate(input, modals.llama2)
}

async function code(input) {
    return makeGenerate(input, modals.codellama)
}

async function fast(input) {
    return makeGenerate(input, modals.tinyllama)
}

async function micro(input) {
    return makeGenerate(input, modals.phi)
}

async function vector(text) {
    const x = await ollama.embeddings({
        model: 'nomic-embed-text',
        prompt: text
    })

    return x
}

export default {
    meta,
    code,
    fast,
    micro,
    vector
}
