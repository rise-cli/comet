import pkg from 'faiss-node'
import { JSONFilePreset } from 'lowdb/node'
const { IndexFlatL2, Index, IndexFlatIP, MetricType } = pkg

/**
 * Make Vector Index
 */
export function makeIndex(data, size = 3) {
    const dimension = size
    const index = new IndexFlatL2(dimension)
    // add each items vectors in db, and keep track of which id corresponds to
    // each set of vectors
    let idIndex = []
    Object.keys(data).forEach((k) => {
        const x = data[k]
        index.add(x.vectors)
        idIndex.push(k)
    })

    return {
        search: (vectors, amount = 3) => {
            // search vectors and get index of vectors that match most closely
            const results = index.search(vectors, amount)
            // look up the id that matches the vectors we found
            let distanceIndex = 0
            return results.labels.map((i) => {
                const result = {
                    distance: results.distances[distanceIndex],
                    id: idIndex[i]
                }
                distanceIndex++
                return result
            })
        }
    }
}

/**
 * Make DB
 */
async function makeLowDb(path) {
    const db = await JSONFilePreset(path, { items: {} })

    async function batchSet(items) {
        Object.keys(items).forEach((id) => {
            if (!items[id].vectors) {
                throw new Error('Items must have "vectors" defined')
            }
        })
        db.data.items = {
            ...db.data.items,
            ...items
        }
        await db.write()
    }

    async function set(item) {
        if (!item.vectors) {
            throw new Error('Items must have "vectors" defined')
        }
        if (!item.id) {
            throw new Error('Items must have "id" defined')
        }
        await db.update(({ items }) => (items[item.id] = item))
    }

    async function remove(item) {
        await db.update(({ items }) => delete items[item.id])
    }

    async function get(id) {
        return db.data.items[id]
    }

    async function getFirst() {
        const id = Object.keys(db.data.items)[0]
        return db.data.items[id]
    }

    async function getAll() {
        return db.data.items
    }

    return {
        set,
        get,
        remove,
        batchSet,
        getFirst,
        getAll
    }
}

/**
 * Make Vector db
 */
async function createNewLocalDb({ data, path }) {
    const SIZE = data[Object.keys(data)[0]].vectors.length
    const vindex = makeIndex(data, SIZE)

    const db = await makeLowDb(path)
    console.log('jlkjlkjl ', db)
    await db.batchSet(data)

    return {
        search: async (vectors, amount = 3) => {
            const found = vindex.search(vectors, amount)
            let results = []
            for (const f of found) {
                const item = await db.get(f.id)
                results.push({
                    distance: f.distance,
                    item: {
                        id: item.id,
                        data: item.data
                    }
                })
            }

            return results
        }
    }
}

async function openExistingLocalDb({ path }) {
    const db = await makeLowDb(path)
    const firstItem = await db.getFirst()
    const SIZE = firstItem.vectors.length
    const allData = await db.getAll()
    const vindex = makeIndex(allData, SIZE)

    return {
        search: async (vectors, amount = 3) => {
            const found = vindex.search(vectors, amount)
            let results = []
            for (const f of found) {
                const item = await db.get(f.id)
                results.push({
                    distance: f.distance,
                    item: {
                        id: item.id,
                        data: item.data
                    }
                })
            }

            return results
        }
    }
}

export default {
    makeIndex,
    createNewLocalDb,
    openExistingLocalDb
}
