import website from './website.mjs'
import llmLocal from './llm-local.mjs'
import llmAws from './llm-aws.mjs'
import vector from './vector.mjs'
import server from './server.mjs'

export default {
    website,
    llm: {
        local: llmLocal,
        aws: llmAws
    },
    vector,
    server
}
