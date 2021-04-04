const model = require('./model.js');
const view = require('./view.js');
const readlineSync = require('readline-sync');
const moment = require('moment');
const { Client } = require('pg');
const select = model.select;
const ins = model.ins;
const upd = model.update;
const del = model.del;
const getEntitiesId = model.getEntitiesId;
const makeQuery = model.makeQuery;
const checkField = model.checkField;
const outputData = view.outputData;
const outputError = view.outputError;
const outputTime = view.outputTime;
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    database: 'Library',
    password: '66lularo',
})
client.connect();


simpleOp();

function simpleOp() {
    console.log(`Choose:
    1 -> Authors
    2 -> Books
    3 -> Readers
    4 -> Subscription
    5 -> Just go to filter section
    6 -> Close the program`);
    const table = readlineSync.question('Enter your command: ');
    switch (parseInt(table)) {
        case 1:
            console.log('You chose authors');
            ChooseOp('authors').then(() => {
                simpleOp();
            }).catch(err => {
                outputError(err);
                simpleOp();
            });
            break;
        case 2:
            console.log('You chose books');
            ChooseOp('books').then(() => {
                simpleOp();
            }).catch(err => {
                outputError(err);
                simpleOp();
            });
            break;
        case 3:
            console.log('You chose readers');
            ChooseOp('readers').then(() => {
                simpleOp();
            }).catch(err => {
                outputError(err);
                simpleOp();
            });
            break;
        case 4:
            console.log('You chose subscriptions');
            ChooseOp('subscriptions').then(() => {
                simpleOp();
            }).catch(err => {
                outputError(err);
                simpleOp();
            });
            break;
        case 5:
            console.log('You chose just going to filter section');
            filter(client).then(() => {
                simpleOp();
            }).catch(err => {
                outputError(err);
                simpleOp();
            });
            break;
        case 6:
            console.log('Goodbye');
            process.exit();
            break;
        default:
            console.log('Wrong command');
            simpleOp();
            break;
    }
}

async function ChooseOp(entity) {
    console.log(`Choose operation:
    1 -> insert
    2 -> update
    3 -> delete
    4 -> viev table
    5 -> fill with random data`);
    const op = readlineSync.question('Enter your command: ');
    switch (parseInt(op)) {
        case 1:
            console.log('You chose insert');
            await insert(entity, client);
            break;
        case 2:
            console.log('You chose update');
            await update(entity, client);
            break;
        case 3:
            console.log('You chose delete');
            await ondelete(entity, client);
            break;
        case 4:
            console.log('You chose viev table');
            await select(entity, client).then(res => { outputData(res); });
            break;
        case 5:
            console.log('You chose fill with random data');
            const count = readlineSync.question('Input number of random data: ');
            await insertRndData(entity, parseInt(count), client);
            break;
        default:
            console.log('Wrong command');
            await ChooseOp(entity);
            break;
    }
}

async function insert(entity, client) {
    switch (entity) {
        case 'authors':
            const auth = createAuthor();
            await ins('authors', ["surname", "age", "email"], auth, client);
            let aid;
            await getEntitiesId('authors', client).then(data => {
                aid = data[data.length - 1];
            });
            console.log(`You have to add an ${auth[0]}s book:
            Choose operation:
            1 -> select an existing book 
            2 -> add new book and select it`);
            const op1 = readlineSync.question('Enter your command: ');
            switch (parseInt(op1)) {
                case 1:
                    let ids = [];
                    lect
                    await select('books', client).then(res => { outputData(res) });
                    await getEntitiesId('books', client).then(data => {
                        ids = data;
                    });
                    const bid = readlineSync.question('Choose an id: ');
                    if (!ids.includes(parseInt(bid))) {
                        throw new Error("Invalid id");
                    }
                    await ins('authors_books', ["author_id", "book_id"], [aid, bid], client);
                    break;
                case 2:
                    const books = createBook();
                    await ins('books', ["name", "genre", "number_of_pages"], books, client);
                    let bid2;
                    await getEntitiesId('books', client).then(data => {
                        bid2 = data[data.length - 1];
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
            await getEntitiesId('books', client).then(data => {
                bid3 = data[data.length - 1];
            });
            console.log(`You have to add an author of the ${books[0]}:
            Choose operation:
            1 -> select an existing author 
            2 -> add new author and select him`);
            const op2 = readlineSync.question('Enter your command: ');
            switch (parseInt(op2)) {
                case 1:
                    let aids = [];
                    await select('authors', client).then(res => { outputData(res) });
                    await getEntitiesId('authors', client).then(data => {
                        aids = data;
                    });
                    const aid2 = readlineSync.question('Choose an id: ');
                    if (!aids.includes(parseInt(aid2))) {
                        throw new Error("Invalid id");
                    }
                    await ins('authors_books', ["author_id", "book_id"], [aid2, bid3], client);
                    break;
                case 2:
                    const arrauth = createAuthor();
                    await ins('authors', ["surname", "age", "email"], arrauth, client);
                    let aid3;
                    await getEntitiesId('authors', client).then(data => {
                        aid3 = data[data.length - 1];
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
            switch (parseInt(op3)) {
                case 1:
                    let rids = [];
                    await select('readers', client).then(res => { outputData(res) });
                    await getEntitiesId('readers', client).then(data => {
                        rids = data;
                    });
                    const rid = readlineSync.question('Choose an id: ');
                    if (!rids.includes(parseInt(rid))) {
                        throw new Error("Invalid id");
                    }
                    await ins('books_readers', ["book_id", "reader_id"], [bid3, rid], client);
                    break;
                case 2:
                    const arrread = createReader();
                    await ins('readers', ["surname", "age", "city", "email", "expiration_date"], arrread, client);
                    let rid2;
                    await getEntitiesId('readers', client).then(data => {
                        rid2 = data[data.length - 1];
                    });
                    await ins('books_readers', ["book_id", "reader_id"], [bid3, rid2], client);
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

async function update(entity, client) {
    await select(entity, client).then(res => { outputData(res) });
    switch (entity) {
        case 'authors':
            const auid = readlineSync.question('Enter authors id: ');
            const ids = await getEntitiesId(entity, client);
            if (!ids.includes(parseInt(auid))) {
                throw new Error('Invalid id');
            }
            const auth = createAuthor();
            await upd("authors", ["surname", "age", "email"], auth, "id", auid, client);
            break;
        case 'books':
            const booid = readlineSync.question('Enter book id: ');
            const ids1 = getEntitiesId(entity, client);
            if (!((await ids1).includes(parseInt(booid)))) {
                throw new Error('Invalid id');
            }
            const book = createBook();
            await upd("books", ["name", "genre", "number_of_pages"], book, "id", booid, client);
            break;
        case 'subscriptions':
            const subid = readlineSync.question('Enter Subscription id: ');
            const ids2 = getEntitiesId(entity, client);
            await checkField('readers', "subscription_id", subid, client).then(data => { if (data === false) { throw new Error(`Invalid id`) } });
            const reader = createReader();
            await upd("readers", ["expiration_date"], reader, "subscription_id", subid, client);
            break;
        case 'readers':
            const readid = readlineSync.question('Enter Reader id: ');
            const ids3 = getEntitiesId(entity, client);
            if (!((await ids3).includes(parseInt(readid)))) {
                throw new Error('Invalid id');
            }
            const reader1 = createReader();
            reader1.pop();
            await upd("readers", ["surname", "age", "city", "email"], reader1, "id", readid, client);
            break;
        default:
            break;
    }
}

async function ondelete(entity, client) {
    await select(entity, client).then(res => { outputData(res) });
    console.log('Choose field as the condition: ');
    switch (entity) {
        case 'authors':
            const available = ['id', 'surname', 'age', 'email'];
            const acmd = readlineSync.question('id, surname, age, email: ');
            if (!available.includes(acmd)) {
                throw new Error('Invalid field');
            }
            let adef = readlineSync.question('Input the definition of the field: ');
            if (adef === 'id' || adef === 'age') {
                adef = parseInt(adef);
            }
            await checkField(entity, acmd, adef, client).then(data => { if (data === false) { throw new Error(`There is no record with this ${acmd}`) } });
            await del("authors_books", "author_id", adef, client);
            await del("authors", acmd, adef, client);
            break;
        case 'books':
            const bcmd = readlineSync.question('id, name, genre, number_of_pages: ');
            let bdef = readlineSync.question('Input the definition of the field: ');
            if (bcmd === 'id' || bcmd === 'number_of_pages') {
                bdef = parseInt(bdef);
            }
            await checkField(entity, bcmd, bdef, client).then(data => { if (data === false) { throw new Error(`There is no record with this ${bcmd}`) } });
            await del("authors_books", "book_id", bdef, client);
            await del("books_readers", "book_id", bdef, client);
            await del("books", bcmd, bdef, client);
            break;
        case 'subscriptions':
        case 'readers':
            const rcmd = readlineSync.question('id, surname, age, city, email, subscription_id, expiration_date: ');
            let rdef = readlineSync.question('Input the definition of the field: ');
            if (rcmd === 'id' || rcmd === 'age' || rcmd === 'subscription_id') {
                rdef = parseInt(rdef);
            }
            await checkField("readers", rcmd, rdef, client).then(data => { if (data === false) { throw new Error(`There is no record with this ${rcmd}`) } });
            await del("books_readers", "reader_id", rdef, client);
            await del("readers", rcmd, rdef, client);
            break;
        default:
            break;
    }
}

async function filter(client) {
    const cmd = parseInt(readlineSync.question(`Выберите 
    1 - Фильтрация таблиц авторы и книги по полям фамилия автора, возраст автора и количество страниц книги
    2 - Фильтрация таблиц авторы, книги и читатели по полям айди автора, город читателя, название книги, возраст читателя
    3 - Фильтрация таблиц авторы, книги, читатели и абонименты по фамилии автора, возрасту автора, имени книги и срока годности абонемента
    : `));
    let time = new Date().getTime();
    let query;
    switch (cmd) {
        case 1:
            let auid_left = readlineSync.question('Input lower limit of author`s id: ');
            if(isNaN(auid_left)){
                throw new Error('Invalid type of id');
            }
            auid_left = parseInt(auid_left);
            let auid_right = readlineSync.question('Input upper limit of author`s id: ');
            if(isNaN(auid_right)){
                throw new Error('Invalid type of id');
            }
            auid_right = parseInt(auid_right);
            let sur_start = readlineSync.question('Input start of the author`s surname: ');
            let auage_left = readlineSync.question('Input lower limit of author`s age: ');
            if(isNaN(auage_left)){
                throw new Error('Invalid type of age');
            }
            auage_left = parseInt(auage_left);
            let auage_right = readlineSync.question('Input upper limit of author`s age: ');
            if(isNaN(auage_right)){
                throw new Error('Invalid type of age');
            }
            auage_right = parseInt(auage_right);
            let booknum_left = readlineSync.question('Input lower limit of the number of pages of the book: ');
            if(isNaN(booknum_left)){
                throw new Error('Invalid type of number of the book');
            }
            booknum_left = parseInt(booknum_left);
            let booknum_right = readlineSync.question('Input upper limit of the number of pages of the book: ');
            if(isNaN(booknum_right)){
                throw new Error('Invalid type of number of the book');
            }
            booknum_right = parseInt(booknum_right);
            query = `Select * 
    from authors, books 
    where (authors.id between ${auid_left} and ${auid_right}) and (authors.surname like '${sur_start}%') and (authors.age between ${auage_left} and ${auage_right}) and (books.number_of_pages between ${booknum_left} and ${booknum_right})`;
            break;
        case 2:
            let auid_left1 = readlineSync.question('Input lower limit of author`s id: ');
            if(isNaN(auid_left1)){
                throw new Error('Invalid type of id');
            }
            auid_left1 = parseInt(auid_left1);
            let auid_right1 = readlineSync.question('Input upper limit of author`s id: ');
            if(isNaN(auid_right1)){
                throw new Error('Invalid type of id');
            }
            auid_right1 = parseInt(auid_right1);
            let city_end = readlineSync.question('Input end of the reader`s city: ');
            let name_start = readlineSync.question('Input start of the name of the book: ');
            let reage_left = readlineSync.question('Input lower limit of reader`s age: ');
            if(isNaN(reage_left)){
                throw new Error('Invalid type of age');
            }
            reage_left = parseInt(reage_left);
            let reage_right = readlineSync.question('Input upper limit of reader`s age: ');
            if(isNaN(reage_right)){
                throw new Error('Invalid type of age');
            }
            reage_right = parseInt(reage_right);
            query = `Select authors.id, authors.surname, authors.email, 
    books.name, books.genre, books.number_of_pages, 
    readers.id, readers.age, readers.city 
    from authors, books, readers where (authors.id between ${auid_left1} and ${auid_right1}) and (readers.city like '%${city_end}') and (books.name like '${name_start}%')  and (readers.age between ${reage_left} and ${reage_right})`;
            break;
        case 3:
            let sur_start1 = readlineSync.question('Input end of the reader`s city: ');
            let auage_left1 = readlineSync.question('Input lower limit of author`s age: ');
            if(isNaN(auage_left1)){
                throw new Error('Invalid type of age');
            }
            auage_left1 = parseInt(auage_left1);
            let auage_right1 = readlineSync.question('Input upper limit of author`s age: ');
            if(isNaN(auage_right1)){
                throw new Error('Invalid type of age');
            }
            auage_right1 = parseInt(auage_right1);
            let name_start1 = readlineSync.question('Input start of the name of the book: ');
            let exp_date_left = readlineSync.question('Input lower limit of the expiration date of the subscription: ');
            if (!moment(exp_date_left, moment.ISO_8601).isValid()) {
                throw new Error(`wrong type of date`);
            }
            let exp_date_right = readlineSync.question('Input upper limit of the expiration date of the subscription: ');
            if (!moment(exp_date_right, moment.ISO_8601).isValid()) {
                throw new Error(`wrong type of date`);
            }
            query = `Select authors.id, authors.surname, authors.age, authors.email, 
    books.name, books.genre, books.number_of_pages, 
    readers.city,
    readers.subscription_id, readers.expiration_date 
    from authors, books, readers
    where (authors.surname like '${sur_start1}%') and (authors.age between ${auage_left1} and ${auage_right1}) and (books.name like '${name_start1}%')  and (readers.expiration_date between ${exp_date_left} and ${exp_date_right})`;
            break;
        default:
            throw new Error("Ivalid command");
            break;
    }
    await makeQuery(query, client).then(res => {
        time =  new Date().getTime() - time;
        outputData(res);
    });
    outputTime(time);
    
}

function createAuthor() {
    const surname = readlineSync.question('Enter authors surname: ');
    const age = readlineSync.question('Enter authors age: ');
    if (isNaN(age)) {
        throw new Error(`wrong type of age`);
    }
    const email = readlineSync.question('Enter authors email: ');
    return [surname, parseInt(age), email];
}
function createBook() {
    const name = readlineSync.question('Enter book name: ');
    const genre = readlineSync.question('Enter book genre: ');
    const number = readlineSync.question('Enter number of pages: ');
    if (isNaN(number)) {
        throw new Error(`wrong type of number of pages}`);
    }
    return [name, genre, number];
}
function createReader() {
    const surname = readlineSync.question('Enter readers surname: ');
    const age = readlineSync.question('Enter readers age: ');
    if (isNaN(age)) {
        throw new Error(`wrong type of age`);
    }
    const city = readlineSync.question('Enter readers city: ');
    const email = readlineSync.question('Enter readers email: ');
    const date = readlineSync.question('Enter expiration date: ');
    if (!moment(date, moment.ISO_8601).isValid()) {
        throw new Error(`wrong type of date`);
    }
    return [surname, age, city, email, date];
}



