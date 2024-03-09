import comet from '../src/index.mjs'

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
