const readlineSync = require('readline-sync');
async function filter(client) {
    const cmd = parseInt(readlineSync.question(`Выберите 
    1 - Фильтрация таблиц авторы и книги по полям фамилия автора, возраст автора и количество страниц книги
    2 - Фильтрация таблиц авторы, книги и читатели по полям айди автора, город читателя, название книги, возраст читателя
    3 - Фильтрация таблиц авторы, книги, читатели и абонименты по фамилии автора, возрасту автора, имени книги и срока годности абонемента
    : `));
    const time = new Date().getTime();
    const query1 = `Select * 
    from authors, books 
    where (authors.id between 10 and 20) and (authors.surname like 'L%') and (authors.age between 30 and 90) and (books.number_of_pages between 200 and 500)`;
    const query2 = `Select authors.id, authors.surname, authors.email, 
    books.name, books.genre, books.number_of_pages, 
    readers.id, readers.age, readers.city 
    from authors, books, readers where (authors.id between 10 and 50) and (readers.city like '%PV') and (books.name like 'AU%')  and (readers.age between 500 and 700)`;
    const query3 = `Select authors.id, authors.surname, authors.age, authors.email, 
    books.name, books.genre, books.number_of_pages, 
    readers.city,
    readers.subscription_id, readers.expiration_date 
    from authors, books, readers
    where (authors.surname like 'SH%') and (authors.age between 48 and 50) and (books.name like 'AUE%')  and (readers.expiration_date between '2013-11-11' and '2014-01-11')`;
    let query;
    switch(cmd){
        case 1:
            query = query1;
            break;
        case 2:
            query = query2;
            break;
        case 3:
            query = query3;
            break;
        default:
            throw new Error("Ivalid command");
            break;
    }
    await makeQuery(query, client);
    const time2 = new Date().getTime() - time;
    console.log(`Query has been completed in ${time2} ms.`)
}

async function makeQuery(query, client){
    await client.query(query).catch(err=>{throw new Error(err)}).then(data=>{console.table(data.rows)});
}

module.exports = filter;