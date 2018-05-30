var express = require('express');
var router = express.Router();

var markdown = require("markdown").markdown;

var knex = require('knex')({
    dialect: 'sqlite3',
    connection: {
        filename: 'mark_data.sqlite3'
    },
    useNullAsDefault: true
});

var Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin('pagination');

var User = Bookshelf.Model.extend({
    tableName: 'user'
});

var Markdata = Bookshelf.Model.extend({
    tableName: 'markdata',
    hasTimestamps: true,
    user: function() {
        return this.belongsTo(User);
    }
});

router.get('/', (req, res, next) => {
    res.redirect('/');
    return;
})

router.get('/:id', (req, res, next) => {
    var request = req;
    var response = res;
    if (req.session.login == null) {
        res.redirect('/login');
        return;
    }
    Markdata.query({ where: { user_id: req.session.login.id }, andwhere: ({ id: req.params.id }) })
        .fetch()
        .then((model) => {
            markpage(request, response, model, true);
        });
});

router.post('/:id', (req, res, next) => {
    var request = req;
    var response = res;
    var obj = new Markdata({ id: req.params.id })
        .save({ content: req.body.source }, { patch: true })
        .then((model) => {
            markpage(request, response, model, false);
        });
});

function markpage(req, res, model, flg) {
    var footer;
    if (flg) {
        var d1 = new Date(model.attributes.created_at);
        var dstr = d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate();
        var d2 = new Date(model.attributes.created_at);
        var dstr2 = d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + h2.getDate();
        footer = '(created_at: ' + dstr1 + ', updated: ' + dstr2 + +')';
    } else {
        footer = '(Updateing date and time information...'
    }
    var data = {
        title: 'Markdown',
        id: req.params.id,
        head: model.attributes.title,
        footer: footer,
        content: markdown.toHTML(model.attributes.content),
        source: model.attributes.content
    }
    res.render('mark', data);
}
module.exports = router;