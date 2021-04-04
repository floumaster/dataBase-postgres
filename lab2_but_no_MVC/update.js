const readlineSync = require('readline-sync');
const dbFunctions = require('./createData.js');
const def_ops = require('./default_ops.js');
const createAuthor = dbFunctions.createAuthor;
const createBook = dbFunctions.createBook;
const createReader = dbFunctions.createReader;
const getEntitiesId = dbFunctions.getEntitiesId;
const update = def_ops.update;
const select = def_ops.select;
async function opUpdate(entity, client) {
    await select(entity, client);
    switch (entity) {
        case 'authors':
            const auid = readlineSync.question('Enter authors id: ');
            const ids = await getEntitiesId(entity, client);
            if (!ids.includes(parseInt(auid))) {
                throw new Error('Invalid id');
            }
            const auth = createAuthor();
            await update("authors", ["surname", "age", "email"], auth, "id", auid, client);
            break;
        case 'books':
            const booid = readlineSync.question('Enter book id: ');
            const ids1 = getEntitiesId(entity, client);
            if (!((await ids1).includes(parseInt(booid)))) {
                throw new Error('Invalid id');
            }
            const book = createBook();
            await update("books", ["name", "genre", "number_of_pages"], book, "id", booid, client);
            break;
        case 'subscriptions':
            const subid = readlineSync.question('Enter Subscription id: ');
            const ids2 = getEntitiesId(entity, client);
            if (!((await ids2).includes(parseInt(subid)))) {
                throw new Error('Invalid id');
            }
            const reader = createReader();
            await update("readers", ["expiration_date"], reader, "subscription_id", subid, client);
            break;
        case 'readers':
            const readid = readlineSync.question('Enter Reader id: ');
            const ids3 = getEntitiesId(entity, client);
            if (!((await ids3).includes(parseInt(readid)))) {
                throw new Error('Invalid id');
            }
            const reader1 = createReader();
            reader1.pop();
            await update("readers", ["surname", "age", "city", "email"], reader1, "id", readid, client);
            break;
        default:
            break;
    }
}

module.exports = opUpdate;