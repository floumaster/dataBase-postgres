const def_ops = {
    async update(entity, fields, values, field, value, client) {
        values.forEach((element, id, values) => {
            if (typeof (element) === "string") {
                values[id] = `'${element}'`;
            }
        });
        if (typeof (value) === "string") {
            value = `'${value}'`;
        }
        else {
            value = parseInt(value);
        }
        const query = `UPDATE ${entity} SET (${fields}) = (${values}) WHERE ${field} = ${value};`;
        await client.query(query).catch(err => { throw new Error(err) });
    },
    async del(entity, field, value, client) {
        if (typeof (value) === "string") {
            value = `'${value}'`;
        }
        const query = `DELETE FROM ${entity} WHERE ${field} = ${value}`;
        await client.query(query).catch(err => { throw new Error(err) });
    },
    async ins(entity, fields, values, client) {
        values.forEach((element, id, values) => {
            if (typeof (element) === "string") {
                values[id] = `'${element}'`;
            }
        });
        const query = `INSERT INTO ${entity} (${fields}) VALUES(${values})`;
        await client.query(query).catch(err => { throw new Error(err) });
    },
    async getLastId(entity, client){
        let id;
        await client.query(`SELECT "id" FROM ${entity}`).then(data=>{
            id = data.rows[data.rows.length-1].id;
        })
        return id;
    },
    async select(entity, client) {
        if(entity === 'subscriptions')
            entity = 'readers';
        await client.query(`SELECT * from ${entity}`).then(data=>{
            console.table(data.rows)
        });
    }
}

module.exports = def_ops;