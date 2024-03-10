import fs from 'fs'
import comet from '../../src/index.mjs'

async function main() {
    function getTextFromCrawledFolder() {
        const res = fs.readdirSync('./crawled', { withFileTypes: true })
        return res
            .map((x) => './crawled/' + x.name)
            .map((path) => {
                return fs.readFileSync(path, { encoding: 'utf-8' })
            })
            .map((html) => comet.website.getTextFromHtml(html))
    }

    const texts = getTextFromCrawledFolder()

    let count = 0
    let data = {}
    for (const text of texts) {
        const vectors = await comet.llm.local.vector(text)
        const id = 'id-' + count
        count++

        data[id] = {
            id,
            data: text,
            vectors: vectors.embedding
        }
    }

    const db = await comet.vector.createNewLocalDb({
        data,
        path: './db.json'
    })

    console.log(names)
}

main()
