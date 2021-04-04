const fetch = require('node-fetch');
const moment = require('moment');
var DomParser = require('dom-parser');
const fs = require("fs");
var parser = new DomParser();

async function sendRecuest(url) {
    return fetch(url).then(data => data.text())
}


async function parse() {
    const requestUrl = 'https://randomus.ru/name?type=0&sex=10&count=100';
    let _data;
    await sendRecuest(requestUrl).then(data => {
        const names = data.substring(data.indexOf('data-numbers') + 14, data.indexOf('>', data.indexOf('<textarea id="result_textarea"')) - 1);
        const arr = names.split(',');
        let data_arr = [];
        for (let i = 0; i < arr.length; i++) {
            let obj = {};
            obj['name'] = arr[i].split(' ')[1];
            obj['surname'] = arr[i].split(' ')[0];
            obj['patronymic'] = arr[i].split(' ')[2];
            data_arr.push(obj);
        }
        _data = data_arr;
    });
    return _data;
}

module.exports = parse;