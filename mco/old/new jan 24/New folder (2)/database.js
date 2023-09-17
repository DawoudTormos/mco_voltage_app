class Database {
    constructor() {
        this.db = new sqlite3.Database('database.sqlite');
    }

    // create lorem table if not exists
    createTable() {
        this.db.serialize(() => {
            this.db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");
        });
    }

    // insert data into table lorem with info column value Ipsum 0 to Ipsum 9
    insertData() {
        this.db.serialize(() => {
            const stmt = this.db.prepare("INSERT INTO lorem VALUES (?)");
            for (let i = 0; i < 10; i++) {
                stmt.run("Ipsum " + i);
            }
            stmt.finalize();
        });
    }

    // select all data from table lorem and print it to console
    selectData() {
        this.db.serialize(() => {
            this.db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
                console.log(row.id + ": " + row.info);
            });
        });
    }

    // select data from table lorem with info column value Ipsum 2 and print it to console
    selectDataFilter() {
        this.db.serialize(() => {
            this.db.each("SELECT rowid AS id, info FROM lorem WHERE info = ?", "Ipsum 2", (err, row) => {
                console.log(row.id + ": " + row.info);
            });
        });
    }

    // delete all data from table lorem
    deleteData() {
        this.db.serialize(() => {
            this.db.run("DELETE FROM lorem");
        });
    }

    // delete data from table lorem with info column value Ipsum 2
    deleteDataFilter() {
        this.db.serialize(() => {
            this.db.run("DELETE FROM lorem WHERE info = ?", "Ipsum 2");
        });
    }

    // close database connection
    close() {
        this.db.close();
    }
}
