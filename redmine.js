/**
 * Created by ASC on 25/11/15.
 */

var mysql = require("mysql");

module.exports = function(connection) {
    return {
        connection: mysql.createConnection(connection),
        passwordCorrecto: function (user, passwd, cb) {
            var consulta = "SELECT hashed_password, salt FROM users WHERE login='" + user + "';",
                res = false,
                callback = cb || function () {
                    };

            this.connection.query(consulta, function (err, rows) {
                var salt = rows[0].salt,
                    hash = crypto.createHash('sha1').update(passwd).digest('hex'),
                    checkThisHash = crypto.createHash('sha1').update(salt + hash).digest('hex');
                if (rows[0].hashed_password == checkThisHash) res = true;
                callback(res);
            });
        },
        obtenerRepositoriosDe: function (user, cb) {
            var consulta = 'SELECT id,project_id,url from repositories WHERE project_id IN (SELECT project_id FROM members WHERE user_id=(SELECT id FROM users WHERE login="' + user + '"))',
                callback = cb || function () {
                    },
                res = [];

            this.connection.query(consulta, function (err, rows) {
                for (r in rows) {
                    var url = rows[r]["url"];
                    res.push(url);
                }
                callback(res);
            });

        },
        obtenerUsuarios: function (cb) {
            var consulta = "SELECT login FROM users;",
                callback = cb || function () {
                    };

            this.connection.query(consulta, function (err, rows) {
                var usuarios = [];
                for (r in rows) {
                    if (rows[r].login != "") {
                        usuarios.push(rows[r].login);
                    }
                }
                callback(usuarios);
            });

        },
        obtenerRepositorios: function (cb) {
            var consulta = "SELECT project_id,url,type FROM repositories;",
                callback = cb || function () {
                    };

            this.connection.query(consulta, function (err, rows) {
                var repositorios = {};
                for (r in rows) {
                    var rr = rows[r];
                    if (rr.type = "Repository::Git") {
                        repositorios[rr.url] = rr.project_id;
                    }

                }
                callback(repositorios);
            });
        }
    }
}