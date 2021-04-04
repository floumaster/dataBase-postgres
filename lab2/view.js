const readlineSync = require('readline-sync');
const moment = require('moment');
const view = {
    simpleOp() {
        console.log(`Choose:
    1 -> Authors
    2 -> Books
    3 -> Readers
    4 -> Subscription
    5 -> Just go to filter section
    6 -> Close the program`);
        const table = readlineSync.question('Enter your command: ');
        switch (parseInt(table)) {
            case 1:
                console.log('You chose authors');
                return 'authors';
                break;
            case 2:
                console.log('You chose books');
                return 'books';
                break;
            case 3:
                console.log('You chose readers');
                return 'readers';
                break;
            case 4:
                console.log('You chose subscriptions');
                return 'subscriptions';
                break;
            case 5:
                console.log('You chose just going to filter section');
                return 'filter';
                break;
            case 6:
                console.log('Goodbye');
                return 'exit';
                break;
            default:
                console.log('Wrong command');
                simpleOp();
                break;
        }
    },
    ChooseOp() {
        console.log(`Choose operation:
        1 -> insert
        2 -> update
        3 -> delete
        4 -> viev table
        5 -> fill with random data`);
        const op = readlineSync.question('Enter your command: ');
        switch (parseInt(op)) {
            case 1:
                console.log('You chose insert');
                return 'insert';
                break;
            case 2:
                console.log('You chose update');
                return 'update';
                break;
            case 3:
                console.log('You chose delete');
                return 'delete';
                break;
            case 4:
                console.log('You chose viev table');
                return 'select';
                break;
            case 5:
                console.log('You chose fill with random data');
                const count = readlineSync.question('Input number of random data: ');
                if (isNaN(count))
                    throw new Error('Invalid type of count');
                return ['filter', parseInt(count)];
                break;
            default:
                console.log('Wrong command');
                ChooseOp();
                break;
        }
    },
    book_cmd() {
        console.log(`You have to add an ${auth[0]}s book:
    Choose operation:
    1 -> select an existing book 
    2 -> add new book and select it`);
        const op1 = readlineSync.question('Enter your command: ');
        return op1;
    },
    author_cmd() {
        console.log(`You have to add an author of the ${books[0]}:
    Choose operation:
    1 -> select an existing author 
    2 -> add new author and select him`);
        const op2 = readlineSync.question('Enter your command: ');
        return op2;
    },
    reader_cmd() {
        console.log(`You have to add an reader of the ${books[0]}:
    Choose operation:
    1 -> select an existing reader 
    2 -> add new author and select him`);
        const op3 = readlineSync.question('Enter your command: ');
        return op3;
    },
    getFilterQuery() {
        const cmd = parseInt(readlineSync.question(`Выберите 
    1 - Фильтрация таблиц авторы и книги по полям фамилия автора, возраст автора и количество страниц книги
    2 - Фильтрация таблиц авторы, книги и читатели по полям айди автора, город читателя, название книги, возраст читателя
    3 - Фильтрация таблиц авторы, книги, читатели и абонименты по фамилии автора, возрасту автора, имени книги и срока годности абонемента
    : `));
        let query;
        switch (cmd) {
            case 1:
                let auid_left = readlineSync.question('Input lower limit of author`s id: ');
                if (isNaN(auid_left)) {
                    throw new Error('Invalid type of id');
                }
                auid_left = parseInt(auid_left);
                let auid_right = readlineSync.question('Input upper limit of author`s id: ');
                if (isNaN(auid_right)) {
                    throw new Error('Invalid type of id');
                }
                auid_right = parseInt(auid_right);
                let sur_start = readlineSync.question('Input start of the author`s surname: ');
                let auage_left = readlineSync.question('Input lower limit of author`s age: ');
                if (isNaN(auage_left)) {
                    throw new Error('Invalid type of age');
                }
                auage_left = parseInt(auage_left);
                let auage_right = readlineSync.question('Input upper limit of author`s age: ');
                if (isNaN(auage_right)) {
                    throw new Error('Invalid type of age');
                }
                auage_right = parseInt(auage_right);
                let booknum_left = readlineSync.question('Input lower limit of the number of pages of the book: ');
                if (isNaN(booknum_left)) {
                    throw new Error('Invalid type of number of the book');
                }
                booknum_left = parseInt(booknum_left);
                let booknum_right = readlineSync.question('Input upper limit of the number of pages of the book: ');
                if (isNaN(booknum_right)) {
                    throw new Error('Invalid type of number of the book');
                }
                booknum_right = parseInt(booknum_right);
                query = `Select authors.id, authors.surname, authors.age, books.name, books.number_of_pages 
    from authors, books, authors_books
    where (authors.id between ${auid_left} and ${auid_right}) 
    and (authors.surname like '${sur_start}%') 
    and (authors.age between ${auage_left} and ${auage_right}) 
    and (books.number_of_pages between ${booknum_left} and ${booknum_right})
    and authors.id = authors_books.author_id
	and books.id = authors_books.book_id`;
                break;
            case 2:
                let auid_left1 = readlineSync.question('Input lower limit of author`s id: ');
                if (isNaN(auid_left1)) {
                    throw new Error('Invalid type of id');
                }
                auid_left1 = parseInt(auid_left1);
                let auid_right1 = readlineSync.question('Input upper limit of author`s id: ');
                if (isNaN(auid_right1)) {
                    throw new Error('Invalid type of id');
                }
                auid_right1 = parseInt(auid_right1);
                let city_end = readlineSync.question('Input end of the reader`s city: ');
                let name_start = readlineSync.question('Input start of the name of the book: ');
                let reage_left = readlineSync.question('Input lower limit of reader`s age: ');
                if (isNaN(reage_left)) {
                    throw new Error('Invalid type of age');
                }
                reage_left = parseInt(reage_left);
                let reage_right = readlineSync.question('Input upper limit of reader`s age: ');
                if (isNaN(reage_right)) {
                    throw new Error('Invalid type of age');
                }
                reage_right = parseInt(reage_right);
                query = `Select authors.id, books.name, readers.age, readers.city 
                from authors, books, readers, authors_books, books_readers  
    where (authors.id between ${auid_left1} and ${auid_right1}) 
    and (readers.city like '%${city_end}') 
    and (books.name like '${name_start}%')  
    and (readers.age between ${reage_left} and ${reage_right})
    and (authors.id = authors_books.author_id)
    and (books.id = authors_books.book_id)
    and (books.id = books_readers.book_id)
    and (readers.id = books_readers.reader_id)`;
                break;
            case 3:
                let sur_start1 = readlineSync.question('Input start of the author`s surname: ');
                let auage_left1 = readlineSync.question('Input lower limit of author`s age: ');
                if (isNaN(auage_left1)) {
                    throw new Error('Invalid type of age');
                }
                auage_left1 = parseInt(auage_left1);
                let auage_right1 = readlineSync.question('Input upper limit of author`s age: ');
                if (isNaN(auage_right1)) {
                    throw new Error('Invalid type of age');
                }
                auage_right1 = parseInt(auage_right1);
                let name_start1 = readlineSync.question('Input start of the name of the book: ');
                let exp_date_left = readlineSync.question('Input lower limit of the expiration date of the subscription: ');
                if (!moment(exp_date_left, moment.ISO_8601).isValid()) {
                    throw new Error(`wrong type of date`);
                }
                let exp_date_right = readlineSync.question('Input upper limit of the expiration date of the subscription: ');
                if (!moment(exp_date_right, moment.ISO_8601).isValid()) {
                    throw new Error(`wrong type of date`);
                }
                query = `Select authors.id, authors.surname, authors.age, authors.email, 
    books.name, books.genre, books.number_of_pages, readers.city, readers.subscription_id, readers.expiration_date 
    from authors, books, readers, authors_books, books_readers
    where (authors.surname like '${sur_start1}%') 
    and (authors.age between ${auage_left1} and ${auage_right1}) 
    and (books.name like '${name_start1}%')  
    and (readers.expiration_date between '${exp_date_left}' and '${exp_date_right}')
    and (authors.id = authors_books.author_id)
    and (books.id = authors_books.book_id)
    and (books.id = books_readers.book_id)
    and (readers.id = books_readers.reader_id) `;
                break;
            default:
                throw new Error("Ivalid command");
                break;
        }
        return query;
    },
    createAuthor() {
        const surname = readlineSync.question('Enter authors surname: ');
        const age = readlineSync.question('Enter authors age: ');
        if (isNaN(age)) {
            throw new Error(`wrong type of age`);
        }
        const email = readlineSync.question('Enter authors email: ');
        return [surname, parseInt(age), email];
    },
    createBook() {
        const name = readlineSync.question('Enter book name: ');
        const genre = readlineSync.question('Enter book genre: ');
        const number = readlineSync.question('Enter number of pages: ');
        if (isNaN(number)) {
            throw new Error(`wrong type of number of pages}`);
        }
        return [name, genre, number];
    },
    createReader() {
        const surname = readlineSync.question('Enter readers surname: ');
        const age = readlineSync.question('Enter readers age: ');
        if (isNaN(age)) {
            throw new Error(`wrong type of age`);
        }
        const city = readlineSync.question('Enter readers city: ');
        const email = readlineSync.question('Enter readers email: ');
        const date = readlineSync.question('Enter expiration date: ');
        if (!moment(date, moment.ISO_8601).isValid()) {
            throw new Error(`wrong type of date`);
        }
        return [surname, age, city, email, date];
    },
    outputData(data) {
        console.table(data.rows);
    },
    outputError(err) {
        console.error(err)
    },
    outputTime(time) {
        console.log(`Query has been completed in ${time} ms.`)
    },
    getInput(question) {
        const answer = readlineSync.question(question);
        return answer;
    }
}

module.exports = view;