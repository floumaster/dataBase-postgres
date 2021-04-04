const def_ops = require('./default_ops.js');
const getLastId = def_ops.getLastId;

async function insertRndData(entity, count, client) {
    switch (entity) {
        case 'authors':
            let curr_id;
            await getLastId('authors', client).then(data => { curr_id = data });
            await client.query(`insert into authors ("surname", "age", "email") 
            SELECT chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int), trunc(random()*1000)::int, chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int)
            FROM generate_series(${curr_id + 1},$1+${curr_id})`, [count]).catch(err => {
                throw new Error(err);
            })
            break;
        case 'books':
            let curr_id1;
            await getLastId('books', client).then(data => { curr_id1 = data });
            await client.query(`insert into books ("name", "genre", "number_of_pages") 
            SELECT chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int), chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int), trunc(random()*1000)::int
            FROM generate_series(${curr_id1 + 1},$1+${curr_id1})`, [count]).catch(err => {
                throw new Error(err);
            })
            break;
        case 'subscriptions':
        case 'readers':
            let curr_id2;
            await getLastId('readers', client).then(data => { curr_id2 = data });
            await client.query(`insert into readers ("surname", "age", "city", "email", "expiration_date") 
            SELECT chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int), trunc(random()*1000)::int, chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int),chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int),timestamp '2014-01-10 20:00:00' +
            random() * (timestamp '2014-01-20 20:00:00' -
                        timestamp '2014-01-10 10:00:00')
            FROM generate_series(${curr_id2 + 1},$1+${curr_id2})`, [count]).catch(err => {
                throw new Error(err);
            })
            break;
        default:
            break;
    }
}

module.exports = insertRndData;