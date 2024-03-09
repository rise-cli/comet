import comet from '../../src/index.mjs'

const server = comet.server()

server.front('front/') // where my html, css, js, png, jpgs are

server.api('/name', async (data) => {
    return {
        id: 'hi'
    }
})

server.start()
