const readlineSync = require('readline-sync');
const moment = require('moment');
const dbFunctions = {
    createAuthor(){
        const surname = readlineSync.question('Enter authors surname: ');
        const age = readlineSync.question('Enter authors age: ');
        if (isNaN(age)) {
            throw new Error(`wrong type of age`);
        }
        const email = readlineSync.question('Enter authors email: ');
        return [surname, parseInt(age), email];
    },
    createBook(){
        const name = readlineSync.question('Enter book name: ');
        const genre = readlineSync.question('Enter book genre: ');
        const number = readlineSync.question('Enter number of pages: ');
        if (isNaN(number)) {
            throw new Error(`wrong type of number of pages}`);
        }
        return [name, genre, number];
    },
    createReader(){
        const surname = readlineSync.question('Enter readers surname: ');
        const age = readlineSync.question('Enter readers age: ');
        if (isNaN(age)) {
            throw new Error(`wrong type of age`);
        }
        const city = readlineSync.question('Enter readers city: ');
        const email = readlineSync.question('Enter readers email: ');
        const date = readlineSync.question('Enter expiration date: ');
        if (!moment(date, moment.ISO_8601).isValid()) {
            throw new Error(`wrong type of date}`);
        }
        return [surname, age, city, email, date];
    },
    async getEntitiesId(entity, client){
    let ids = [];
    if(entity === 'subscriptions')
        entity = 'readers';
    await client.query(`SELECT * from ${entity}`).then(data=>{
        data.rows.forEach(element => {
            ids.push(element.id);
        });
    })
    return ids;
    }
}

module.exports = dbFunctions;