import comet from '../../src/index.mjs'
import fs from 'fs'

const html = fs.readFileSync('./crawled/_services_dynamodb.html', {
    encoding: 'utf-8'
})

const text = comet.website.getTextFromHtml(html)
console.log(text)
