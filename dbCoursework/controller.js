const view = require('./view');
const model = require('./model');
const moment = require('moment');
const parse = require('./parser');
const _insert = model.insert;
const _update = model.update;
const _delete = model.delete;
const _select = model.select;


start();

async function start() {
    const entity_number = view.choose_model();
    const operation_number = view.choose_operation();
    await makeOperationByNumber(operation_number, getModelByNmber(entity_number)).finally(() => {
        start();
    });
}

async function makeOperationByNumber(operation, entity) {
    switch (operation) {
        case 1:
            let fields = model.getFields(entity);
            fields.shift();
            let data = view.createData(entity, fields);
            const rel_arr = model.getRelations(entity);
            for (let i = 0; i < rel_arr.length; i++) {
                const tableData = await _select(rel_arr[i]);
                if (tableData.length === 0) {
                    const extra_id = await makeOperationByNumber(1, rel_arr[i])
                    data[rel_arr[i] + 'Id'] = extra_id;
                } else {
                    const id = view.choose_id(tableData);
                    data[rel_arr[i] + 'Id'] = id;
                }
            }
            const _id = await _insert(entity, data);
            return _id;
            break;
        case 2:
            const table = await _select(entity);
            view.outputTable(table);
            let fields1 = model.getFields(entity);
            fields1.shift()
            const condition = view.choose_field_as_a_condition(model.getFields(entity));
            const upd_data = view.createData(entity, fields1);
            await _update(entity, upd_data, condition);
        case 3:
            const table1 = await _select(entity);
            view.outputTable(table1);
            const condition1 = view.choose_field_as_a_condition(model.getFields(entity));
            const id = await model.select_with_condition(entity, condition1);
            await deleteRelations(entity, id[0].id)
        case 4:
            const table2 = await _select(entity);
            view.outputTable(table2);
        case 5:
            const count = view.generate_rnd_data();
            await make_data(entity, count);
        default:
            break;
    }
}

function getModelByNmber(number) {
    switch (number) {
        case 1:
            return 'class';
        case 2:
            return 'pupil';
        case 3:
            return 'mark';
        case 4:
            return 'subject';
        case 5:
            return 'topic';
        default:
            break;
    }
}

async function deleteRelations(entity, _id) {
    let all_tables = ['class', 'pupil', 'mark', 'subject', 'topic']
    for (let i = 0; i < all_tables.length; i++) {
        if (all_tables[i] !== entity && model.getRelations(all_tables[i]).includes(entity)) {
            let def = entity + 'Id';
            let condition = {};
            condition[def] = _id;
            const ids = await model.select_with_condition(all_tables[i], condition);
            for (let j = 0; j < ids.length; j++) {
                await deleteRelations(all_tables[i], ids[j].id)
            }
        }
    }
    await _delete(entity, { id: _id });
}

async function make_data(entity, count) {
    switch (entity) {
        case 'class':
            let n = await model.get_last_id('class', 'grade') + 1;
            const query = `insert into class ("grade", "letters") (with symbols(characters) as (VALUES ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'))
            (select trunc(1+random()*11)::int, string_agg(substr(characters, (random() * length(characters) + 1) :: INTEGER, 1), '')
            from symbols
            join generate_series(1,16) as word(chr_idx) on 1 = 1
            join generate_series(${n+1},${n+count}) as words(idx) on 1 = 1 -- # of words
            group by idx))`
            await model.makeQuery(query);
            break;
        case 'pupil':
            let arr = [];
            for (let i = 0; i < Math.max(1, Math.ceil(count / 100)); i++) {
                await parse().then((data) => {
                    console.log(data);
                    arr = arr.concat(data);
                });
            }
            //arr.splice(count, arr.length - count);
            let date_arr = generateDates(count);
            console.log(arr.length);
            console.log(date_arr.length);
            //console.log(`insert into pupil ("name", "surname", "patronymic", "birth_date", "classId") values(${arr[0].name}, ${arr[0].surname}, ${arr[0].patronymic}, '2020-11-11', 5)`)
            break;
        case 'mark':
            break;
        case 'subject':
            break;
        case 'topic':
            break;
        default:
            break;
    }
}

function generateDates(count) {
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(moment(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)))
            .format('YYYY-MM-DD'))
    }
    return arr;
}