# Comet

A library for building LLM apps. Why its called Comet? Who knows :shrug, it just needed a name.

## Install

Just copy the dist.mjs file into your project.

## Usage

### Website Scraping

```js
import comet from './comet.mjs'

async function main() {
    const results = await comet.website.search('nintendo switch 2')
    for (const r of results) {
        const html = await comet.website.getHtml(r.url)
        const text = comet.website.getTextFromHtml(html)
        console.log(text)
    }
}

main()
```

### LLM Local

Local (requires Ollama):

```js
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
```

Models available:

```
tinyllama: 'tinyllama',
llama2: 'llama2',
codellama: 'codellama:7b',
phi: 'phi'
vector: 'nomic-embed-text'
```

### LLM AWS

```js
import comet from './comet.mjs'

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
```

### Vector Local

Create new local vector db:

```js
import comet from './comet.mjs'

const data = {
    f34: {
        id: '234',
        data: "Air is the invisible mixture of gases that makes up the earth's atmosphere. It is composed primarily of nitrogen and oxygen, with small amounts of water vapor, carbon dioxide, and other trace gases. Air provides the oxygen needed for respiration and provides a medium for sound and heat transfer, making it vital for life on earth.",
        vectors: [
            0.890625, 0.036865234, 0.6875, 0.51171875, -0.375, 0.33789062,
            -0.068847656, 0.00020694733, -0.00078964233, -0.13183594,
            0.16601562, 0.10888672, -0.083496094, -0.21582031, 0.14160156,
            -0.1328125, 0.00091552734, -0.03857422, -0.12451172, 0.24707031
        ]
    },
    a34: {
        id: 'a34',
        data: 'Rock is a naturally occurring solid aggregate of one or more minerals or mineraloids. Rocks are extremely varied in their composition and can range from soft, fine-grained sedimentary rocks like clay and silt to hard, coarse-grained igneous rocks like granite. Dirt is loose particulate matter covering the surface of the earth, containing a mixture of organic matter, minerals, gases, liquids, and organisms that together support life.',
        vectors: [
            0.3984375, -0.234375, 0.22167969, 0.15039062, -0.15625, 0.43359375,
            0.2421875, 0.00035476685, 0.40625, -0.23632812, 0.31054688,
            0.15429688, -0.11816406, -0.22558594, -0.045654297, -0.035888672,
            0.14941406, -0.014953613, 0.014892578, 0.109375
        ]
    },
    '2f4': {
        id: '2f4',
        data: "Water is a clear, odorless, and tasteless liquid. It is composed of two hydrogen atoms bonded to one oxygen atom. Water is fundamental to life on Earth and makes up the majority of the Earth's surface.",
        vectors: [
            0.6484375, -0.28515625, 0.61328125, 0.50390625, -0.48242188,
            0.047851562, 0.13183594, -0.000076293945, 0.36328125, -0.056884766,
            0.079589844, -0.1640625, 0.057373047, -0.15722656, 0.21582031,
            -0.05419922, 0.19824219, 0.038085938, -0.5546875, 0.17089844
        ]
    },
    '2x3': {
        id: '233',
        data: 'Fire is the rapid oxidation of a material in the exothermic chemical process of combustion, releasing heat, light, and various reaction products. It requires fuel, oxygen, and an ignition source to initiate the combustion reaction. Fire has been an important part of human culture, being used for heat, cooking, industry, and as a visual representation of energy.',
        vectors: [
            -0.28125, 0.04296875, 0.20019531, 0.12695312, -0.41992188,
            0.15820312, 0.18164062, 0.00012874603, 0.09863281, -0.16503906,
            0.34765625, -0.17382812, 0.0036468506, -0.06542969, 0.22460938,
            -0.0020141602, 0.27539062, -0.17871094, -0.3203125, 0.11669922
        ]
    }
}

const query = [
    0.890625, 0.036865234, 0.6875, 0.51171875, -0.375, 0.33789062, -0.068847656,
    0.00020694733, -0.00078964233, -0.13183594, 0.16601562, 0.10888672,
    -0.083496094, -0.21582031, 0.14160156, -0.1328125, 0.00091552734,
    -0.03857422, -0.12451172, 0.24707031
]

async function main() {
    const db = await comet.vector.createNewLocalDb({
        data,
        path: './data.json'
    })

    const found = await db.search(query, 3)
    console.log(found)
}

main()
```

Open existing db:

```js
import comet from './comet.mjs'

const query = [
    0.890625, 0.036865234, 0.6875, 0.51171875, -0.375, 0.33789062, -0.068847656,
    0.00020694733, -0.00078964233, -0.13183594, 0.16601562, 0.10888672,
    -0.083496094, -0.21582031, 0.14160156, -0.1328125, 0.00091552734,
    -0.03857422, -0.12451172, 0.24707031
]

async function main() {
    const db = await comet.vector.openExistingLocalDb({ path: './data.json' })

    const result = await db.search(query, 2)
    console.log(result)
}

main()
```
