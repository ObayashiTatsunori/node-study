var express = require('express');
var router = express.Router();

var knex = require('knex')({
    dialect: 'sqlite3',
    connection: {
        filename: 'board_data.sqlite3'
    },
    useNullAsDefault: true
});

var Bookshelf = require('bookshelf')(knex);

var User = Bookshelf.Model.extend({
    tableName: 'users'
});

router.get('/add', (req, res, next) => {
    var data = {
        title: 'User/Add',
        form: { name: '', password: '', comment: '' },
        content: '※登録する名前・パスワード・コメントを入力ください。'
    }
    res.render('users/add', data);
});
router.post('/add', (req, res, next) => {
    var request = req;
    var response = res;
    req.check('name', 'NAME は必ず入力してください').notEmpty();
    req.check('password', 'PASSWORD は必ず入力してください').notEmpty();
    req.getValidationResult().then((result) => {
        if (!result.isEmpty()) {
            var content = '<ul class="error">';
            var result_arr = result.array();
        }
    })
})

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;