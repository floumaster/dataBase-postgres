const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
    'School',
    'postgres',
    '66lularo', {
        dialect: 'postgres',
        timestamps: false,
    },

)

class Class extends Sequelize.Model {};
class Pupil extends Sequelize.Model {};
class Mark extends Sequelize.Model {};
class Subject extends Sequelize.Model {};
class Topic extends Sequelize.Model {};

Class.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        comment: "id of the class",
    },
    grade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "grade of the class",
    },
    letters: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "letters of the class",
    },
}, { sequelize, modelName: 'class', tableName: 'class', timestamps: false })

Pupil.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        comment: "Pupil's id, int",
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Pupil's name, string",
    },
    surname: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Pupil's surname, string",
    },
    patronymic: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Pupil's patronymic, string",
    },
    birth_date: {
        type: Sequelize.DATE,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "Pupil's bitrh date, date iso 8601",
    },
}, { sequelize, modelName: 'pupil', tableName: 'pupil', timestamps: false })

Mark.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        comment: "id of the mark",
    },
    score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "score of the mark",
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "date of the mark",
    },
}, { sequelize, modelName: 'mark', tableName: 'mark', timestamps: false })

Subject.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        comment: "Id of the subject, int",
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "name of the subject, string",
    },
    direction: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "direction of the subject, string",
    }
}, { sequelize, modelName: 'subject', tableName: 'subject', timestamps: false })

Topic.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        comment: "Id of the topic, int",
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: false,
        comment: "name of the topic, string",
    }
}, { sequelize, modelName: 'topic', tableName: 'topic', timestamps: false })

Pupil.hasMany(Mark);
Class.hasMany(Pupil);
Subject.hasMany(Topic);
Subject.hasMany(Mark);
Topic.hasMany(Mark);

const operations = {
    async insert(model, data) {
        await models[model].create(data).catch(err => console.log(err));
        const id = await sequelize.query(`SELECT MAX(id) FROM ${model}`, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => { throw new Error(err); })
        return id[0].max;
    },
    async update(model, data, condition) {
        await models[model].update(data, { where: condition }).catch(err => { throw new Error(err) });
    },
    async delete(model, condition) {
        await models[model].destroy({ where: condition }).catch(err => { throw new Error(err) });
    },
    async select(model) {
        let data;
        await models[model].findAll({ raw: true }).then(entities => {
            data = entities
        }).catch(err => { throw new Error(err) });
        return data;
    },
    async select_with_condition(model, condition) {
        let data;
        await models[model].findAll({ where: condition, raw: true }).then(entities => {
            data = entities
        }).catch(err => { throw new Error(err) });
        return data;
    },
    async get_last_id(model, field) {
        const id = await sequelize.query(`select ${field} from ${model} where id = (select max(id) from ${model}) `, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => { throw new Error(err); })
        return id[0][field];
    },
    getRelations(model) {
        let relations_arr = [];
        for (let key in models[model].rawAttributes) {
            if (key.includes('Id')) {
                relations_arr.push(key.substring(0, key.indexOf('Id')));
            }
        }
        return relations_arr;
    },
    getFields(model) {
        let fields_arr = [];
        for (let key in models[model].rawAttributes) {
            if (!key.includes('Id')) {
                fields_arr.push([key, models[model].rawAttributes[key].type.key.toLowerCase()])
            }
        }
        return fields_arr;
    },
    async makeQuery(query) {
        await sequelize.query(query, { raw: true, type: Sequelize.QueryTypes.SELECT, }).catch(err => {
            throw new Error(err);
        })
    }
}


const models = {
    'class': Class,
    'pupil': Pupil,
    'mark': Mark,
    'subject': Subject,
    'topic': Topic
}

module.exports = operations;