const insert = require('./insert.js');
const update = require('./update.js');
const ondelete = require('./delete.js');
const filter = require('./superFilter.js');
const def_ops = require('./default_ops.js');
const insertRndData = require('./autoGenerate.js');
const readlineSync = require('readline-sync');
const moment = require('moment');
const select = def_ops.select;
const { Client } = require('pg');
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
            }).catch(err=>{
                console.log(err);
                simpleOp();
            });
            break;
        case 2:
            console.log('You chose books');
            ChooseOp('books').then(() => {
                simpleOp();
            }).catch(err=>{
                console.log(err);
                simpleOp();
            });
            break;
        case 3:
            console.log('You chose readers');
            ChooseOp('readers').then(() => {
                simpleOp();
            }).catch(err=>{
                console.log(err);
                simpleOp();
            });
            break;
        case 4:
            console.log('You chose subscriptions');
            ChooseOp('subscriptions').then(() => {
                simpleOp();
            }).catch(err=>{
                console.log(err);
                simpleOp();
            });
            break;
        case 5:
            console.log('You chose just going to filter section');
            filter(client).then(() => {
                simpleOp();
            }).catch(err=>{
                console.log(err);
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
            await select(entity, client);
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




