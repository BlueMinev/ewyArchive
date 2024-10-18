const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); // body parser enables us to read data from a request body 
const db = require('./db'); // exposes the SQLLite db so we can run queries against it

// tells express to use the body parser
app.use(bodyParser.urlencoded({extended:false}));

//handle GET requests
app.get('/ewyArchiveAPI', async (req, res) => {
    const {status, data} = await getEvents(req);
    res.status(status);
    if(data) res.json(data);
    else res.end();
    });

//handle POST requests 
app.post('/ewyArchiveAPI', async (req, res) => {
    const {status, data} = await postComments(req);
    res.status(status);
    if(data) res.json(data);
    else res.end();
    });

//handle PUT and DELETE requests by returning  405 
app.put('/ewyArchiveAPI', async (req, res) => {
    res.status(405);
    res.end();
    })
    app.delete('/ewyArchiveAPI', async (req, res) => {
    res.status(405);
    res.end();
    });

app.listen(port, () => {
console.log(`Running at http://localhost:${port}`);
})




        async function getEvents(req) {
            let status = 500, data = null;
            try {
            const title = req.query.title;
            if(title!=null){
            // wrap in promise to allow for sequential code flow
            titleSearch='%'+title+'%';
            await new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ewyArchive WHERE title LIKE ?';
            db.all(sql,[titleSearch],(err, rows) => {
            if(!err) {
            if(rows.length > 0) {
            status = 200;
            data = {
            'title searched': title,
            'events':rows
            };
            } else {
            status = 204;
            }
            }
            resolve();
            });
            });
            } else {
            status = 400;
            }
            } catch(e) {
            console.error(e);
            }
            return {status, data};
            }



async function getComments(req) {
    let status = 500, data = null;
    try {
    const oid = req.query.oid;
    if(oid
    && oid.length > 0 && oid.length <= 32
    && oid.match(/^[a-z0-9]+$/i)){
    // wrap in promise to allow for sequential code flow
    await new Promise((resolve, reject) => {
    const sql = 'SELECT name, comment FROM comments WHERE oid=?';
    db.all(sql, [oid], (err, rows) => {
    if(!err) {
    if(rows.length > 0) {
    status = 200;
    data = {
    'oid': oid,
    'comments': rows
    };
    } else {
    status = 204;
    }
    }
    resolve();
    });
    });
    } else {
    status = 400;
    }
    } catch(e) {
    console.error(e);
    }
    return {status, data};
    }
    
    async function postComments(req) {
        let status = 500, data = null;
        try {
        const oid = req.body.oid;
        const name = req.body.name;
        const comment = req.body.comment;
        if(oid && name && comment
            && oid.length > 0 && oid.length <= 32
            && oid.match(/^[a-z0-9]+$/i)
            && name.length > 0 && name.length <= 64
            && comment.length > 0 ){
            // wrap in promise to allow for sequential code flow
            await new Promise((resolve, reject) => {
            const sql = 'INSERT INTO comments (oid, name, comment)VALUES (?, ?, ?)';
            // use old style function syntax to access lastID,
            // see https://github.com/TryGhost/node-sqlite3/wiki/API
            db.run(sql, [oid, name, comment], function (err, result) {
            if(!err) {
            status = 201;
            data = {'id': this.lastID };
            }
            resolve();
            });
            });
            } else {
            status = 400;
            }
            } catch(e) {
            console.error(e);
            }
            return {status, data};
            }