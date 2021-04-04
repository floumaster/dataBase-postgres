const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "Library",
    password: "66lularo"
})

client.connect();

const methods = {
    async update(entity, fields, values, field, value) {
        values.forEach((element, id, values) => {
            if (typeof(element) === "string") {
                values[id] = `'${element}'`;
            }
        });
        if (typeof(value) === "string") {
            value = `'${value}'`;
        } else {
            value = parseInt(value);
        }
        const query = `UPDATE ${entity} SET (${fields}) = (${values}) WHERE ${field} = ${value};`;
        await client.query(query).catch(err => { throw new Error(err) });
    },
    async del(entity, field, value) {
        if (typeof(value) === "string") {
            value = `'${value}'`;
        }
        const query = `DELETE FROM ${entity} WHERE ${field} = ${value}`;
        await client.query(query).catch(err => { throw new Error(err) });
    },
    async ins(entity, fields, values) {
        values.forEach((element, id, values) => {
            if (typeof(element) === "string") {
                values[id] = `'${element}'`;
            }
        });
        const query = `INSERT INTO ${entity} (${fields}) VALUES(${values})`;
        await client.query(query).catch(err => { throw new Error(err) });
    },
    async select(entity) {
        let data;
        if (entity === 'subscriptions') {
            await client.query(`SELECT "subscription_id", "expiration_date" from "readers"`).then(res => {
                data = res;
            });
        } else if (entity === 'readers') {
            await client.query(`SELECT "id", "surname", "age", "city", "email" from "readers"`).then(res => {
                data = res;
            });
        } else {
            await client.query(`SELECT * from ${entity}`).then(res => {
                data = res;
            });
        }
        return data;
    },
    async getLastId(entity) {
        let id;
        await client.query(`SELECT "id" FROM ${entity}`).then(data => {
            id = data.rows[data.rows.length - 1].id;
        })
        return id;
    },
    async checkField(entity, field, value) {
        let boolean = true;
        if (typeof(value) === "string") {
            value = `'${value}'`;
        }
        const query = `Select * from ${entity} where ${field} = ${value}`;
        await client.query(query).then(res => {
            if (res.rows.length === 0) {
                boolean = false;
            }
        }).catch(err => { throw new Error(err) })
        return boolean;

    },
    async getEntitiesId(entity) {
        let ids = [];
        if (entity === 'subscriptions')
            entity = 'readers';
        await client.query(`SELECT * from ${entity}`).then(data => {
            data.rows.forEach(element => {
                ids.push(element.id);
            });
        })
        return ids;
    },
    async makeQuery(query) {
        let data;
        await client.query(query).catch(err => { throw new Error(err) }).then(res => { data = res });
        return data;
    },
    async insertRndData(entity, count) {
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
    },
    async fullfill() {
        for (let i = 3; i < 100000; i++) {
            client.query(`insert into books_readers(book_id, reader_id) values(${i}, ${i+1})`);
        }
    }
}

module.exports = methods;



const array = [];

atr = [
    ['name', 'string'],
    ['age', 'int'],
    ['nat', 'string']
]
for (let i = 0; i < atr.length; i++) {
    const require = readline.question(`give me ${atr[i][0]}`);
    if (atr[i][1] === 'string') {
        array.push(require)
    }
}