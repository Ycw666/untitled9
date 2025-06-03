const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./db/sqlite.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      camera_name TEXT,
      date TEXT,
      price INTEGER
    );
  `);

  // API：查詢歷史價格
  app.get('/api/price', (req, res) => {
      const date = req.query.date;

      if (!date) {
          return res.status(400).json({ error: '請提供日期參數 ?date=YYYY-MM-DD' });
      }

      db.all(
          `SELECT camera_name, price FROM prices WHERE date LIKE ?`,
          [`%${date}%`],
          (err, rows) => {
              if (err) {
                  console.error('SQL 查詢錯誤:', err.message);
                  return res.status(500).json({ error: err.message });
              }
              res.json(rows);
          }
      );
  });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
