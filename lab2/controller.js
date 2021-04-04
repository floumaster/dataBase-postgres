const model = require('./model.js');
const view = require('./view.js');
const moment = require('moment');
const select = model.select;
const ins = model.ins;
const upd = model.update;
const del = model.del;
const getEntitiesId = model.getEntitiesId;
const makeQuery = model.makeQuery;
const checkField = model.checkField;
const insertRndData = model.insertRndData;
const outputData = view.outputData;
const outputError = view.outputError;
const outputTime = view.outputTime;
const simpleOp = view.simpleOp;
const ChooseOp = view.ChooseOp;
const createAuthor = view.createAuthor;
const createBook = view.createBook;
const createReader = view.createReader;
const book_cmd = view.book_cmd;
const author_cmd = view.author_cmd;
const reader_cmd = view.reader_cmd;
const getFilterQuery = view.getFilterQuery;
const getInput = view.getInput;

start();

async function start() {
    let response = simpleOp();
    if (response === 'filter') {
        filter().then(() => {
            start();
        }).catch(err => {
            outputError(err);
            start();
        });
    }
    else if (response === 'exit') {
        process.exit();
    }
    else {
        await op(response);
    }
}

async function op(entity) {
    const choose = ChooseOp();
    if (typeof (choose) === 'object') {
        insertRndData(process, choose[1]);
    }
    else {
        switch (choose) {
            case 'insert':
                await insert(entity).then(() => {
                    start();
                }).catch(err => {
                    outputError(err);
                    start();
                });
                break;
            case 'update':
                await update(entity).then(() => {
                    start();
                }).catch(err => {
                    outputError(err);
                    start();
                });
                break;
            case 'delete':
                await ondelete(entity).then(() => {
                    start();
                }).catch(err => {
                    outputError(err);
                    start();
                });
                break;
            case 'select':
                await select(entity).then((res) => {
                    outputData(res);
                    start();
                }).catch(err => {
                    outputError(err);
                    start();
                });
                break;
            default:
                break;
        }
    }
}

async function insert(entity) {
    switch (entity) {
        case 'authors':
            const auth = createAuthor();
            await ins('authors', ["surname", "age", "email"], auth);
            let aid;
            await getEntitiesId('authors').then(data => {
                aid = data[data.length - 1];
            });
            const op1 = book_cmd();
            switch (parseInt(op1)) {
                case 1:
                    let ids = [];
                    lect
                    await select('books').then(res => { outputData(res) });
                    await getEntitiesId('books').then(data => {
                        ids = data;
                    });
                    const bid = readlineSync.question('Choose an id: ');
                    if (!ids.includes(parseInt(bid))) {
                        throw new Error("Invalid id");
                    }
                    await ins('authors_books', ["author_id", "book_id"], [aid, bid]);
                    break;
                case 2:
                    const books = createBook();
                    await ins('books', ["name", "genre", "number_of_pages"], books);
                    let bid2;
                    await getEntitiesId('books').then(data => {
                        bid2 = data[data.length - 1];
                    });
                    await ins('authors_books', ["author_id", "book_id"], [aid, bid2]);
                    break;
                default:
                    throw new Error('Invalid command');
                    break;
            }
            break;
        case 'books':
            const books = createBook();
            await ins('books', ["name", "genre", "number_of_pages"], books);
            let bid3;
            await getEntitiesId('books').then(data => {
                bid3 = data[data.length - 1];
            });
            const op2 = author_cmd();
            switch (parseInt(op2)) {
                case 1:
                    let aids = [];
                    await select('authors').then(res => { outputData(res) });
                    await getEntitiesId('authors').then(data => {
                        aids = data;
                    });
                    const aid2 = readlineSync.question('Choose an id: ');
                    if (!aids.includes(parseInt(aid2))) {
                        throw new Error("Invalid id");
                    }
                    await ins('authors_books', ["author_id", "book_id"], [aid2, bid3]);
                    break;
                case 2:
                    const arrauth = createAuthor();
                    await ins('authors', ["surname", "age", "email"], arrauth);
                    let aid3;
                    await getEntitiesId('authors').then(data => {
                        aid3 = data[data.length - 1];
                    });
                    await ins('authors_books', ["author_id", "book_id"], [aid3, bid3]);
                    break;
                default:
                    throw new Error('Invalid command');
                    break;
            }
            const op3 = reader_cmd();
            switch (parseInt(op3)) {
                case 1:
                    let rids = [];
                    await select('readers').then(res => { outputData(res) });
                    await getEntitiesId('readers').then(data => {
                        rids = data;
                    });
                    const rid = readlineSync.question('Choose an id: ');
                    if (!rids.includes(parseInt(rid))) {
                        throw new Error("Invalid id");
                    }
                    await ins('books_readers', ["book_id", "reader_id"], [bid3, rid]);
                    break;
                case 2:
                    const arrread = createReader();
                    await ins('readers', ["surname", "age", "city", "email", "expiration_date"], arrread);
                    let rid2;
                    await getEntitiesId('readers').then(data => {
                        rid2 = data[data.length - 1];
                    });
                    await ins('books_readers', ["book_id", "reader_id"], [bid3, rid2]);
                    break;
                default:
                    throw new Error('Invalid command');
                    break;
            }
            break;
        case 'subscriptions':
        case 'readers':
            const readers = createReader();
            await ins('readers', ["surname", "age", "city", "email", "expiration_date"], readers);
            break;
        default:
            break;
    }
}

async function update(entity) {
    await select(entity).then(res => { outputData(res) });
    switch (entity) {
        case 'authors':
            const auid = getInput('Enter authors id: ');
            const ids = await getEntitiesId(entity);
            if (!ids.includes(parseInt(auid))) {
                throw new Error('Invalid id');
            }
            const auth = createAuthor();
            await upd("authors", ["surname", "age", "email"], auth, "id", auid);
            break;
        case 'books':
            const booid = getInput('Enter book id: ');
            const ids1 = getEntitiesId(entity);
            if (!((await ids1).includes(parseInt(booid)))) {
                throw new Error('Invalid id');
            }
            const book = createBook();
            await upd("books", ["name", "genre", "number_of_pages"], book, "id", booid);
            break;
        case 'subscriptions':
            const subid = getInput('Enter Subscription id: ');
            const ids2 = getEntitiesId(entity);
            await checkField('readers', "subscription_id", subid).then(data => { if (data === false) { throw new Error(`Invalid id`) } });
            const reader = createReader();
            await upd("readers", ["expiration_date"], reader, "subscription_id", subid);
            break;
        case 'readers':
            const readid = getInput('Enter Reader id: ');
            const ids3 = getEntitiesId(entity);
            if (!((await ids3).includes(parseInt(readid)))) {
                throw new Error('Invalid id');
            }
            const reader1 = createReader();
            reader1.pop();
            await upd("readers", ["surname", "age", "city", "email"], reader1, "id", readid);
            break;
        default:
            break;
    }
}

async function ondelete(entity) {
    await select(entity).then(res => { outputData(res) });
    console.log('Choose field as the condition: ');
    switch (entity) {
        case 'authors':
            const available = ['id', 'surname', 'age', 'email'];
            let acmd = getInput('id, surname, age, email: ');
            if (!available.includes(acmd)) {
                throw new Error('Invalid field');
            }
            let adef = getInput('Input the definition of the field: ');
            if (adef === 'id' || adef === 'age') {
                adef = parseInt(adef);
            }
            await checkField(entity, acmd, adef).then(data => { if (data === false) { throw new Error(`There is no record with this ${acmd}`) } });
            await del("authors_books", "author_id", adef);
            await del("authors", acmd, adef);
            break;
        case 'books':
            let bcmd = getInput('id, name, genre, number_of_pages: ');
            let bdef = getInput('Input the definition of the field: ');
            if (bcmd === 'id' || bcmd === 'number_of_pages') {
                bdef = parseInt(bdef);
            }
            await checkField(entity, bcmd, bdef).then(data => { if (data === false) { throw new Error(`There is no record with this ${bcmd}`) } });
            await del("authors_books", "book_id", bdef);
            await del("books_readers", "book_id", bdef);
            await del("books", bcmd, bdef);
            break;
        case 'subscriptions':
        case 'readers':
            let rcmd = getInput('id, surname, age, city, email, subscription_id, expiration_date: ');
            let rdef = getInput('Input the definition of the field: ');
            if (rcmd === 'id' || rcmd === 'age' || rcmd === 'subscription_id') {
                rdef = parseInt(rdef);
            }
            await checkField("readers", rcmd, rdef).then(data => { if (data === false) { throw new Error(`There is no record with this ${rcmd}`) } });
            await del("books_readers", "reader_id", rdef);
            await del("readers", rcmd, rdef);
            break;
        default:
            break;
    }
}

async function filter() {
    const query = getFilterQuery();
    let time = new Date().getTime();
    await makeQuery(query).then(res => {
        time = new Date().getTime() - time;
        outputData(res);
    });
    outputTime(time);
}