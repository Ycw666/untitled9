var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 確保 db 目錄存在
const fs = require('fs');
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

// 直接在 app.js 中使用 sqlite3 開啟資料庫
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'db', 'sqlite.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('無法開啟資料庫:', err.message);
    } else {
        console.log('app.js 成功連接到資料庫');
    }
});

// 查詢相機價格資料 API
app.get('/api/quotes', (req, res) => {
    db.all('SELECT * FROM prices', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 查詢指定日期的相機價格資料 API
app.get('/api/price', (req, res) => {
    const date = req.query.date;
    if (!date) {
        return res.status(400).json({ error: '缺少 date 參數' });
    }
    // 先模糊查詢
    db.all('SELECT * FROM prices WHERE date LIKE ? ORDER BY date ASC', [`%${date}%`], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (rows.length > 0) {
            return res.json(rows);
        }
        // 若無模糊符合，查詢比輸入日期大的最近一筆
        db.all('SELECT * FROM prices WHERE date > ? ORDER BY date ASC LIMIT 1', [date], (err2, nextRows) => {
            if (err2) {
                return res.status(500).json({ error: err2.message });
            }
            if (nextRows.length > 0) {
                return res.json(nextRows);
            }
            // 若往後也找不到，再往前找最近一筆
            db.all('SELECT * FROM prices WHERE date < ? ORDER BY date DESC LIMIT 1', [date], (err3, prevRows) => {
                if (err3) {
                    return res.status(500).json({ error: err3.message });
                }
                res.json(prevRows);
            });
        });
    });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
