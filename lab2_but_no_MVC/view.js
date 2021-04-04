const view={
    outputData(data) {
        console.table(data.rows);
    },
    outputError(err){
        console.error(err)
    },
    outputTime(time){
        console.log(`Query has been completed in ${time} ms.`)
    }
}

module.exports = view;