var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var urlEncodedParser = bodyParser.urlencoded({
    extended: true
});
var port = process.env.PORT || 3003;

//connection string to database named "inventory"
//table named "items" wtih columns "object_name", "color", "size"
var connectionString = 'postgres://localhost:5432/inventory';

app.use(express.static('public')); //static folder

// spin up server
app.listen(port, function() {
    console.log('server up on:', port);
}); // end spin up server

// base url
app.get('/', function(req, res) {
    console.log('base url hit');
    res.sendFile(path.resolve('views/index.html'));
}); // end home base

// add new objects to the inventory
app.post('/addItem', urlEncodedParser, function(req, res) {
    console.log('addItem route hit:', req.body);
    // add the item from req.body to the table
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected to database in post');
            client.query('INSERT INTO items (object_name, color, size) values ($1, $2, $3)', [req.body.name, req.body.color, req.body.size]);
            done();
            res.send('go!');
        }
    }); //end connection to db
}); // end addItem route

// get all objects in the inventory
app.get('/getInventory', function(req, res) {
    console.log('getInventory route hit');
    // get all items in the table and return them to client
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected to db in getInventory');
            var query = client.query('SELECT * from items');
            var allItems = [];
            query.on('row', function(row) {
                allItems.push(row);
            });
            query.on('end', function() {
                done();
                console.log(allItems);
                res.send(allItems);
            });
        }
    }); //end pg connect in get
}); //end getInventory route