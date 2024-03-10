import cheerio from 'cheerio'
import request from 'request'
import fs from 'fs'
import url from 'url'

export default (theUrl) => {
    // The URL of the website you want to crawl
    const baseUrl = theUrl

    // An array to store the URLs of all the pages to be crawled
    const pagesToCrawl = [baseUrl]

    // An array to store the URLs of the pages that have already been crawled
    const crawledPages = []

    // A function to crawl a page
    function crawlPage(pageUrl) {
        request(pageUrl, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                // Load the HTML content of the page using Cheerio
                const $ = cheerio.load(body)

                // Save the HTML content to a file
                const fileName = url.parse(pageUrl).pathname.replace(/\//g, '_')
                fs.writeFileSync(`pages/${fileName}.html`, body)

                // Add the current page to the list of crawled pages
                crawledPages.push(pageUrl)

                // Find all links on the page
                const links = $('a')
                links.each((index, link) => {
                    const href = $(link).attr('href')
                    const absoluteUrl = url.resolve(baseUrl, href)

                    // Check if the link is on the same domain and has not been crawled yet
                    if (
                        absoluteUrl.startsWith(baseUrl) &&
                        !crawledPages.includes(absoluteUrl) &&
                        !pagesToCrawl.includes(absoluteUrl)
                    ) {
                        pagesToCrawl.push(absoluteUrl)
                    }
                })

                // Crawl the next page in the queue
                crawlNextPage()
            } else {
                console.error(`Error crawling page ${pageUrl}: ${error}`)
                crawlNextPage()
            }
        })
    }

    // A function to crawl the next page in the queue
    function crawlNextPage() {
        if (pagesToCrawl.length > 0) {
            const nextPage = pagesToCrawl.shift()
            crawlPage(nextPage)
        } else {
            console.log('Crawling complete!')
        }
    }

    // Create a directory to store the downloaded pages
    fs.mkdirSync('pages', { recursive: true })

    // Start crawling the website
    crawlNextPage()
}
