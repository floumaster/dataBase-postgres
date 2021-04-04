const model = require('./model.js');
const view = require('./view.js');
const moment = require('moment');
const readlineSync = require('readline-sync');
const select = model.select;
const ins = model.ins;
const upd = model.update;
const del = model.del;
const getEntitiesId = model.getEntitiesId;
const makeQuery = model.makeQuery;
const checkField = model.checkField;
const insertRndData = model.insertRndData;
const modelentities = model.entities;
const selectWithConditon = model.selectWithConditon;
const outputData = view.outputData;
const outputError = view.outputError;
const outputTime = view.outputTime;
const simpleOp = view.simpleOp;
const ChooseOp = view.ChooseOp;
const createAuthor = view.createAuthor;
const createBook = view.createBook;
const createSubscription = view.createSubscription;
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
    } else if (response === 'exit') {
        process.exit();
    } else {
        await op(response);
    }
}

async function op(entity) {
    const choose = ChooseOp();
    if (typeof(choose) === 'object') {
        insertRndData(entity, choose[1]).then(() => { start(); }).catch(err => {
            outputError(err);
            start();
        });;
    } else {
        response = handleResponce(response);
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
        case modelentities.authors:
            const auth = createAuthor();
            let aid;
            await ins(modelentities.authors, { surname: auth[0], age: auth[1], email: auth[2] });
            await getEntitiesId(modelentities.authors).then(data => {
                aid = data[data.length - 1];
            });
            const op1 = book_cmd(auth);
            switch (parseInt(op1)) {
                case 1:
                    let ids = [];
                    await select(modelentities.books).then(res => { outputData(res) });
                    await getEntitiesId(modelentities.books).then(data => {
                        ids = data;
                    });
                    const bid = readlineSync.question('Choose an id: ');
                    if (!ids.includes(parseInt(bid))) {
                        throw new Error("Invalid id");
                    }
                    await ins(modelentities.authors_books, { author_id: aid, book_id: parseInt(bid) });
                    break;
                case 2:
                    const books = createBook();
                    await ins(modelentities.books, { name: books[0], genre: books[1], number_of_pages: books[2] });
                    let bid2;
                    await getEntitiesId(modelentities.books).then(data => {
                        bid2 = data[data.length - 1];
                    });
                    await ins(modelentities.authors_books, { author_id: aid, book_id: bid2 });
                    break;
                default:
                    throw new Error('Invalid command');
                    break;
            }
            break;
        case modelentities.books:
            const books = createBook();
            await ins(modelentities.books, { name: books[0], genre: books[1], number_of_pages: books[2] });
            let bid3;
            await getEntitiesId(modelentities.books).then(data => {
                bid3 = data[data.length - 1];
            });
            const op2 = author_cmd(books);
            switch (parseInt(op2)) {
                case 1:
                    let aids = [];
                    await select(modelentities.authors).then(res => { outputData(res) });
                    await getEntitiesId(modelentities.authors).then(data => {
                        aids = data;
                    });
                    const aid2 = readlineSync.question('Choose an id: ');
                    if (!aids.includes(parseInt(aid2))) {
                        throw new Error("Invalid id");
                    }
                    await ins(modelentities.authors_books, { author_id: parseInt(aid2), book_id: bid3 });
                    break;
                case 2:
                    const arrauth = createAuthor();
                    await ins(modelentities.authors, { surname: arrauth[0], age: arrauth[1], arrauth: auth[2] });
                    let aid3;
                    await getEntitiesId(modelentities.authors).then(data => {
                        aid3 = data[data.length - 1];
                    });
                    await ins(modelentities.authors_books, { author_id: aid3, book_id: bid3 });
                    break;
                default:
                    throw new Error('Invalid command');
                    break;
            }
            const op3 = reader_cmd(books);
            switch (parseInt(op3)) {
                case 1:
                    let rids = [];
                    await select(modelentities.readers).then(res => { outputData(res) });
                    await getEntitiesId(modelentities.readers).then(data => {
                        rids = data;
                    });
                    const rid = readlineSync.question('Choose an id: ');
                    if (!rids.includes(parseInt(rid))) {
                        throw new Error("Invalid id");
                    }
                    await ins(modelentities.books_readers, { book_id: bid3, reader_id: parseInt(rid) });
                    break;
                case 2:
                    const arrread = createReader();
                    await ins(modelentities.readers, { surname: arrread[0], age: arrread[1], city: arrread[2], email: arrread[3] });
                    let rid2;
                    await getEntitiesId(modelentities.readers).then(data => {
                        rid2 = data[data.length - 1];
                    });
                    await ins(modelentities.books_readers, { book_id: bid3, reader_id: rid2 });
                    const date = createSubscription();
                    await ins(modelentities.subscriptions, { expiration_date: date, readerId: rid2 });
                    break;
                default:
                    throw new Error('Invalid command');
                    break;
            }
            break;
        case modelentities.subscriptions:
        case modelentities.readers:
            const readers = createReader();
            await ins(modelentities.readers, { surname: readers[0], age: readers[1], city: readers[2], email: readers[3] });
            let rid3;
            await getEntitiesId(modelentities.readers).then(data => {
                rid3 = data[data.length - 1];
            });
            const date = createSubscription();
            await ins(modelentities.subscriptions, { expiration_date: date, readerId: rid3 });
            break;
        default:
            break;
    }
}

async function update(entity) {
    await select(entity).then(res => { outputData(res) });
    switch (entity) {
        case modelentities.authors:
            const auid = getInput('Enter authors id: ');
            const ids = await getEntitiesId(entity);
            if (!ids.includes(parseInt(auid))) {
                throw new Error('Invalid id');
            }
            const auth = createAuthor();
            await upd(modelentities.authors, { surname: auth[0], age: auth[1], email: auth[2] }, parseInt(auid));
            break;
        case modelentities.books:
            const booid = getInput('Enter book id: ');
            const ids1 = getEntitiesId(entity);
            if (!((await ids1).includes(parseInt(booid)))) {
                throw new Error('Invalid id');
            }
            const book = createBook();
            await upd(modelentities.books, { name: book[0], genre: book[1], number_of_pages: book[2] }, parseInt(booid));
            break;
        case modelentities.subscriptions:
            const subid = getInput('Enter Subscription id: ');
            const ids2 = getEntitiesId(entity);
            if (!((await ids2).includes(parseInt(subid)))) {
                throw new Error('Invalid id');
            }
            const date = createSubscription();
            await upd(modelentities.subscriptions, { expiration_date: date }, parseInt(subid));
            break;
        case modelentities.readers:
            const readid = getInput('Enter Reader id: ');
            const ids3 = getEntitiesId(entity);
            if (!((await ids3).includes(parseInt(readid)))) {
                throw new Error('Invalid id');
            }
            const reader1 = createReader();
            await upd(modelentities.readers, { surname: reader1[0], age: reader1[1], city: reader1[2], email: reader1[3] }, parseInt(readid));
            break;
        default:
            break;
    }
}

async function ondelete(entity) {
    await select(entity).then(res => { outputData(res) });
    console.log('Choose field as the condition: ');
    switch (entity) {
        case modelentities.authors:
            let adef = getInput('Input the authors id: ');
            if (isNaN(adef)) {
                throw new Error('Id should be a number');
            }
            adef = parseInt(adef);
            await checkField(entity, { id: adef }).then(data => { if (data === false) { throw new Error(`There is no record with this ${acmd}`) } });
            await del(modelentities.authors_books, { author_id: adef });
            await del(modelentities.authors, { id: adef });
            break;
        case modelentities.books:
            let bdef = getInput('Input the id of the book: ');
            if (isNaN(bdef)) {
                throw new Error('Id should be a number');
            }
            bdef = parseInt(bdef);
            await checkField(entity, { id: bdef }).then(data => { if (data === false) { throw new Error(`There is no record with this ${acmd}`) } });
            await del(modelentities.authors_books, { book_id: bdef });
            await del(modelentities.books_readers, { book_id: bdef });
            await del(modelentities.books, { id: bdef });
            break;
        case modelentities.subscriptions:
            let sdef = getInput('Input the id of the subscription: ');
            if (isNaN(sdef)) {
                throw new Error('Id should be a number');
            }
            sdef = parseInt(sdef);
            await checkField(entity, { id: sdef }).then(data => { if (data === false) { throw new Error(`There is no record with this ${acmd}`) } });
            let readerId;
            await selectWithConditon(entity, { id: sdef }).then(data => { readerId = data });
            await del(modelentities.subscriptions, { id: sdef });
            await del(modelentities.readers, { id: readerId[0].readerId });
            break;
        case modelentities.readers:
            let rdef = getInput('Input the readers id: ');
            if (isNaN(rdef)) {
                throw new Error('Id should be a number');
            }
            rdef = parseInt(rdef);
            await checkField(entity, { id: rdef }).then(data => { if (data === false) { throw new Error(`There is no record with this ${acmd}`) } });
            await del(modelentities.subscriptions, { readerId: rdef });
            await del(modelentities.readers, { id: rdef });
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

function handleResponce(response) {
    switch (response) {
        case 'authors':
            return modelentities.authors;
        case 'books':
            return modelentities.books;
        case 'readers':
            return modelentities.readers;
        case 'subscriptions':
            return modelentities.subscriptions;
        case 'filter':
            return 'filter';
        case 'exit':
            return 'exit';
    }
}