const readlineSync = require('readline-sync');
const dbFunctions = require('./createData.js');
const def_ops = require('./default_ops.js');
const createAuthor = dbFunctions.createAuthor;
const createBook = dbFunctions.createBook;
const createReader = dbFunctions.createReader;
const getEntitiesId = dbFunctions.getEntitiesId;
const ins = def_ops.ins;
const select = def_ops.select;
async function opInsert(entity, client) {
    switch (entity) {
        case 'authors':
            const auth = createAuthor();
            await ins('authors', ["surname", "age", "email"], auth, client);
            let aid; 
            await getEntitiesId('authors', client).then(data=>{
                aid = data[data.length-1];
            });
            console.log(`You have to add an ${auth[0]}s book:
            Choose operation:
            1 -> select an existing book 
            2 -> add new book and select it`);
            const op1 = readlineSync.question('Enter your command: ');
            switch(parseInt(op1)){
                case 1:
                    let ids = [];
                    await select('books', client);
                    await getEntitiesId('books', client).then(data=>{
                        ids = data;
                    });
                    const bid = readlineSync.question('Choose an id: ');
                    if(!ids.includes(parseInt(bid))){
                        throw new Error("Invalid id");
                    }
                    await ins('authors_books', ["author_id", "book_id"], [aid, bid], client);
                    break;
                case 2:
                    const books = createBook();
                    await ins('books', ["name", "genre", "number_of_pages"], books, client);
                    let bid2;
                    await getEntitiesId('books', client).then(data=>{
                        bid2 = data[data.length-1];
                    });
                    await ins('authors_books', ["author_id", "book_id"], [aid, bid2], client);
                    break;
                default:
                    throw new Error('Invalid command');
                    break;
            }
            break;
        case 'books':
            const books = createBook();
            await ins('books', ["name", "genre", "number_of_pages"], books, client);
            let bid3;
            await getEntitiesId('books', client).then(data=>{
                bid3 = data[data.length-1];
            });
            console.log(`You have to add an author of the ${books[0]}:
            Choose operation:
            1 -> select an existing author 
            2 -> add new author and select him`);
            const op2 = readlineSync.question('Enter your command: ');
            switch(parseInt(op2)){
                case 1:
                    let aids = [];
                    await select('authors', client);
                    await getEntitiesId('authors', client).then(data=>{
                        aids = data;
                    });
                    const aid2 = readlineSync.question('Choose an id: ');
                    if(!aids.includes(parseInt(aid2))){
                        throw new Error("Invalid id");
                    }
                    await ins('authors_books', ["author_id", "book_id"], [aid2, bid3], client);
                    break;
                case 2:
                    const arrauth = createAuthor();
                    await ins('authors', ["surname", "age", "email"], arrauth, client);
                    let aid3;
                    await getEntitiesId('authors', client).then(data=>{
                        aid3 = data[data.length-1];
                    });
                    await ins('authors_books', ["author_id", "book_id"], [aid3, bid3], client);
                    break;
                default:
                    throw new Error('Invalid command');
                    break;
            }
            console.log(`You have to add an reader of the ${books[0]}:
            Choose operation:
            1 -> select an existing reader 
            2 -> add new author and select him`);
            const op3 = readlineSync.question('Enter your command: ');
            switch(parseInt(op3)){
                case 1:
                    let rids = [];
                    await select('readers', client);
                    await getEntitiesId('readers', client).then(data=>{
                        rids = data;
                    });
                    const rid = readlineSync.question('Choose an id: ');
                    if(!rids.includes(parseInt(rid))){
                        throw new Error("Invalid id");
                    }
                    await ins('books_readers', ["book_id", "reader_id"], [bid3, rid], client);
                    break;
                case 2:
                    const arrread = createReader();
                    await ins('readers', ["surname", "age", "city", "email", "expiration_date"], arrread, client);
                    let rid2;
                    await getEntitiesId('readers', client).then(data=>{
                        rid2 = data[data.length-1];
                    });
                    await ins('books_readers', ["book_id", "reader_id"], [bid3,rid2], client);
                    break;
                default:
                    throw new Error('Invalid command');
                    break;
            }
            break;
        case 'subscriptions':
        case 'readers':
            const readers = createReader();
            await ins('readers', ["surname", "age", "city", "email", "expiration_date"], readers, client);
            break;
        default:
            break;
    }
}
module.exports = opInsert;