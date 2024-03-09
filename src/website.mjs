import { stripHtml } from 'string-strip-html'
import DDG from 'duck-duck-scrape'

/**
 * Search Functions
 */
async function search(term, results = 3) {
    const searchResults = await DDG.search(term, {
        safeSearch: DDG.SafeSearchType.STRICT
    })

    return searchResults.results.slice(0, results).map((x) => ({
        title: x.title,
        url: x.url,
        summary: x.description
    }))
}

async function searchNews(term, results = 3) {
    const searchResults = await DDG.searchNews(term, {
        safeSearch: DDG.SafeSearchType.STRICT
    })

    return searchResults.results.slice(0, results).map((x) => ({
        title: x.title,
        url: x.url,
        summary: x.excerpt
    }))
}

/**
 * Get HTML Text Functions
 */
async function getHtml(url) {
    const raw = await fetch(url)
    const ht = await raw.text()
    return ht
}

function getTextFromHtml(html) {
    return stripHtml(html).result
}

export default {
    search,
    searchNews,
    getHtml,
    getTextFromHtml
}
