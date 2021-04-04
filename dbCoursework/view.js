const readlineSync = require('readline-sync');
const moment = require('moment');
const userInterface = {
    choose_model() {
        const answer = parseInt(readlineSync.question(`Выберите данные, с которыми Вы хотите работать:
Данные про классы   - 1
Данные про учеников - 2
Данные про оценки   - 3
Данные про предметы - 4
Данные про темы     - 5
Введите номер: `));
        return answer;
    },
    choose_operation() {
        const answer = parseInt(readlineSync.question(`Выберите операцию, которую Вы хотите совершить:
Вставка                     - 1
Обновление                  - 2
Удаление                    - 3
Вывод                       - 4
Генерация случайных данных  - 5
Введите номер: `));
        return answer;
    },
    createData(model, fields) {
        let data = {};
        fields.forEach(element => {
            let asn = readlineSync.question(`Введите ${model} ${element[0]} с типом данных ${element[1]}: `);
            asn = validate(asn, element[1]);
            data[element[0]] = asn;
        });
        return data;
    },
    choose_id(data) {
        console.table(data);
        const id = parseInt(readlineSync.question('Выберите id: '));
        if (isNaN(id)) {
            throw new Error('Invalid data type');
        }
        let available_ids = [];
        data.forEach(el => {
            available_ids.push(el['id']);
        })
        if (!available_ids.includes(id)) {
            throw new Error('This id does not exist');
        }
        return id;
    },
    choose_field_as_a_condition(fields) {
        let data_arr = [];
        fields.forEach(el => {
            data_arr.push(el[0]);
        })
        const data = readlineSync.question(`Выберите атрибут, по которому будет происходить поиск записи ${data_arr.join(', ')}: `);
        if (!data_arr.includes(data)) {
            throw new Error('Неверно введен атрибут');
        }
        let condition = {};
        fields.forEach(el => {
            if (el[0] === data) {
                let value = readlineSync.question(`Введите значение ${el[0]} типа ${el[1]}: `);
                value = validate(value, el[1]);
                condition[el[0]] = value;
                console.log(condition);
            }
        })
        return condition;
    },
    generate_rnd_data() {
        const count = readlineSync.question(`Введите количество записей, которые нужно сгенерировать: `);
        if (isNaN(count)) {
            throw new Error('Invalid data type');
        }
        return parseInt(count);
    },
    outputTable(data) {
        console.table(data);
    }
}

function validate(data, type) {
    switch (type) {
        case 'integer':
            if (isNaN(data)) {
                throw new Error('Invalid data type');
            }
            data = parseInt(data);
            break;
        case 'date':
            if (!moment(data, moment.ISO_8601).isValid()) {
                throw new Error('Invalid data type');
            }
            break;
        default:
            break;
    }
    return data;
}

module.exports = userInterface;