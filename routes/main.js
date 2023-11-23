module.exports = function(app, shopData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });

    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });

    app.get('/addbook', function (req,res) {
        res.render('addbook.ejs', shopData);                                                                     
    });       

    app.post('/bookadded', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO books (name, price, description, author) VALUES (?,?,?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.price, req.body.description, req.body.author];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            // sends book details
            res.send(' This book is added to database, Name: ' + req.body.name + ', Author: ' + req.body.author + ', Price: £'+ req.body.price);
          }
        });
  });    
                                                                                  
    app.post('/registered', function (req,res) {
        // saving data in database
        res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);                                                                              
    }); 
    app.get('/list', function (req, res) {
        // gets all books from table
        let sqlquery = "SELECT * FROM books";

        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            // updates shopData to now have books from database
            let newData = Object.assign({}, shopData, {availableBooks: result});
            res.render("list.ejs", newData);
        })
    })
    // route for bargain books
    app.get('/bargainbooks', function (req, res) {
        // filters the database for records where price is less than £20
        let sqlquery = "SELECT * FROM books WHERE price < 20";

        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            // updates shopData to have books from the db which are less than £20
            let newData = Object.assign({}, shopData, {availableBooks: result});
            console.log(newData);
            res.render("bargainbooks.ejs", newData);
        })
    })

    // route after a search
    app.get('/search-result', function (req, res) {
        // returns records which are like the keyword inputted by user, advanced
        let sqlquery = "SELECT * FROM books WHERE name LIKE " + '"%' +req.query.keyword +'%"';
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            // updates shopData with all the books which have the characters from req.query.keyword
            let newData = Object.assign({}, shopData, {availableBooks: result});
            res.render("search-result.ejs", newData);
        })
    });
}
