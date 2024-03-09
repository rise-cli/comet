import comet from '../src/index.mjs'

async function main() {
    const results = await comet.website.search('nintendo switch 2')
    for (const r of results) {
        const html = await comet.website.getHtml(r.url)
        const text = comet.website.getTextFromHtml(html)
        console.log(text)
    }
}

main()
