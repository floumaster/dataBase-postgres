const readlineSync = require('readline-sync');
const def_ops = require('./default_ops.js');
const del = def_ops.del;
const select = def_ops.select;
async function ondelete(entity, client) {
    await select(entity, client);
    console.log('Choose field as the condition: ');
    switch (entity) {
        case 'authors':
            const available = ['id', 'surname', 'age', 'email'];
            const acmd = readlineSync.question('id, surname, age, email: ');
            if(!available.includes(acmd)){
                throw new Error('Invalid field');
            }
            let adef = readlineSync.question('Input the definition of the field: ');
            if (adef === 'id' || adef === 'age') {
                adef = parseInt(adef);
            }
            await del("authors_books", "author_id", adef, client);
            await del("authors", acmd, adef, client);
            break;
        case 'books':
            const bcmd = readlineSync.question('id, name, genre, number_of_pages: ');
            let bdef = readlineSync.question('Input the definition of the field: ');
            if (bcmd === 'id' || bcmd === 'number_of_pages') {
                bdef = parseInt(bdef);
            }
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
            await del("books_readers", "reader_id", rdef, client);
            await del("readers", rcmd, rdef, client);
            break;
        default:
            break;
    }
}

module.exports = ondelete;