const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
    'Library',
    'postgres',
    '66lularo', {
        dialect: 'postgres',
        timestamps: false,
    },

)

class Authors extends Sequelize.Model {};
class Books extends Sequelize.Model {};
class Readers extends Sequelize.Model {};
class Authors_Books extends Sequelize.Model {};
class Books_Readers extends Sequelize.Model {};
class Subscription extends Sequelize.Model {};

Authors.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        comment: "Author's id, int",
    },
    surname: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Author's surname, string",
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Author's age, int",
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Author's email, string",
    },
}, { sequelize, modelName: 'authors', tableName: 'authors', timestamps: false })

Books.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        comment: "Author's id, int",
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Author's id, int",
    },
    genre: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Author's id, int",
    },
    number_of_pages: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Author's id, int",
    },
}, { sequelize, modelName: 'books', tableName: 'books', timestamps: false })

Readers.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        comment: "Reader's id, int",
    },
    surname: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Reader's surname, string",
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Reader's age, int",
    },
    city: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Reader's city, string",
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Reader's email, string",
    }
}, { sequelize, modelName: 'readers', tableName: 'readers', timestamps: false })

Subscription.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        comment: "Id of the subscription, int",
    },
    expiration_date: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Expiration date of the subscription, int",
    },
}, { sequelize, modelName: 'subscription', tableName: 'subscription', timestamps: false })


Authors_Books.init({}, { sequelize, modelName: 'authors_books', tableName: 'authors_books', timestamps: false, unique: false, })
Books_Readers.init({}, { sequelize, modelName: 'books_readers', tableName: 'books_readers', timestamps: false, unique: false, })

Authors.belongsToMany(Books, {
    through: Authors_Books,
    foreignKey: 'author_id'
});
Books.belongsToMany(Authors, {
    through: Authors_Books,
    foreignKey: 'book_id'
});
Books.belongsToMany(Readers, {
    through: Books_Readers,
    foreignKey: 'book_id'
});
Readers.belongsToMany(Books, {
    through: Books_Readers,
    foreignKey: 'reader_id'
});
Readers.hasOne(Subscription);

const methods = {
    async kek() {
        await sequelize.sync().then(result => {
            console.log(result);
        })
    },
    async update(entity, values, idnt) {
        await entity.update(values, {
            where: {
                id: idnt
            }
        }).catch(err => { throw new Error(err) });
    },
    async del(entity, condition) {
        await entity.destroy({
            where: condition
        }).catch(err => { throw new Error(err) });
    },
    async ins(entity, values) {
        let data;
        await entity.create(values).then(res => { data = res }).catch(err => console.log(err));
        return data;
    },
    async select(entity) {
        let data;
        await entity.findAll({ raw: true }).then(entities => {
            data = entities
        }).catch(err => { throw new Error(err) });
        return data;
    },
    async selectWithConditon(entity, condition) {
        let data;
        await entity.findAll({ where: condition, raw: true }).then(entities => {
            data = entities
        }).catch(err => { throw new Error(err) });
        return data;
    },
    async checkField(entity, condition) {
        let boolean = true;
        await entity.findAll({ where: condition, raw: true }).then(entities => {
            if (entities.length === 0) {
                boolean = false;
            }
        }).catch(err => console.log(err));
        return boolean;

    },
    async getEntitiesId(entity) {
        let ids = [];
        await entity.findAll({ raw: true }).then(authors => {
            authors.forEach(element => {
                ids.push(element.id);
            })
        }).catch(err => console.log(err));
        return ids;
    },
    async makeQuery(query) {
        let data;
        await sequelize.query(query, { raw: true, type: Sequelize.QueryTypes.SELECT, }).then(res => { data = res }).catch(err => {
            throw new Error(err);
        })
        return data;
    },
    async insertRndData(entity, count) {
        let query;
        switch (entity) {
            case 'authors':
                let curr_id;
                await getLastId(Authors).then(data => { curr_id = data });
                query = `insert into authors ("surname", "age", "email", "rating_in_charts") 
                SELECT chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) 
                || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int), 
                trunc(random()*100)::int, chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) 
                || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) 
                || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int),
                array[
                        (random() * 100)::integer,
                        (random() * 100)::integer,
                        (random() * 100)::integer,
                        (random() * 100)::integer
                    ]
                FROM generate_series(${curr_id + 1},${count}+${curr_id})`;
                await sequelize.query(query, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => {
                    throw new Error(err);
                })
                break;
            case 'books':
                let curr_id1;
                await getLastId(Books).then(data => { curr_id1 = data });
                query = `insert into books ("name", "genre", "number_of_pages") 
                SELECT chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int), chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int), trunc(random()*1000)::int
                FROM generate_series(${curr_id1 + 1},${count}+${curr_id1})`;
                await sequelize.query(query, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => {
                    throw new Error(err);
                })
                break;
            case 'subscriptions':
                let curr_id3;
                await getLastId(Readers).then(data => { curr_id3 = data });
                let curr_id4;
                await getLastId(Subscription).then(data => { curr_id4 = data });
                query = `insert into subscription ("expiration_date", "readerId") 
                SELECT timestamp '2020-01-10 20:00:00' + random() * (timestamp '2030-01-20 20:00:00' - timestamp '2020-01-10 10:00:00'), *
                FROM generate_series(${curr_id4+1},${count}+${curr_id4})`;
                await sequelize.query(query, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => {
                    throw new Error(err);
                })
                break;
            case 'readers':
                let curr_id2;
                await getLastId(Readers).then(data => { curr_id2 = data });
                query = `insert into readers ("surname", "age", "city", "email") 
                SELECT trunc(65+random()*25)::int || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int), trunc(random()*100)::int, chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int),chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int ) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int) || chr(trunc(65+random()*25)::int)
                FROM generate_series(${curr_id2 + 1},${count}+${curr_id2})`;
                await sequelize.query(query, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => {
                    throw new Error(err);
                })
                break;
            default:
                break;
        }
    },
    async fullfill() {
        let query = `insert into authors_books ("author_id", "book_id") 
                SELECT *,trunc(1+random()*99999)
                FROM generate_series(1,100000)`;
        await sequelize.query(query, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => {
            throw new Error(err);
        })
        query = `insert into books_readers ("book_id", "reader_id") 
        SELECT *,trunc(1+random()*99999)
        FROM generate_series(1,100000)`;
        await sequelize.query(query, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => {
            throw new Error(err);
        })
    },
    entities: {
        'authors': Authors,
        'authors_books': Authors_Books,
        'books': Books,
        'books_readers': Books_Readers,
        'readers': Readers,
        'subscriptions': Subscription
    }
}
async function getLastId(entity) {
    let id;
    await entity.findAll({ raw: true }).then(data => {
        id = data[data.length - 1].id;
    }).catch(err => console.log(err));
    return id;
}

module.exports = methods;