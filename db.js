const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'db');
const dbPath = path.join(dbDir, 'sqlite.db');

// 確保 db 目錄存在
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

// 檢查資料庫檔案是否存在
const dbExists = fs.existsSync(dbPath);

// 開啟資料庫
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('無法開啟資料庫:', err.message);
    } else {
        console.log('成功連接到資料庫');
        if (!dbExists) {
            console.log('資料庫不存在，已新建資料庫');
        }
        // 建立 prices 資料表（若不存在）後再批量插入資料
        db.run(`CREATE TABLE IF NOT EXISTS prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            camera_name TEXT NOT NULL,
            date TEXT NOT NULL,
            price INTEGER NOT NULL
        );`, (err) => {
            if (err) {
                console.error('建立 prices 資料表失敗:', err.message);
            } else {
                console.log('已確認 prices 資料表存在');
                const priceData = [
                    { date: '2025/2/17 0:00', price: 28980 },
                    { date: '2025/2/15 4:10', price: 27821 },
                    { date: '2025/2/12 4:12', price: 28980 },
                    { date: '2025/2/11 4:11', price: 27821 },
                    { date: '2025/2/8 4:11', price: 27241 },
                    { date: '2025/1/23 4:08', price: 28980 },
                    { date: '2025/1/19 4:11', price: 27531 },
                    { date: '2025/1/13 4:12', price: 28980 },
                    { date: '2025/1/8 19:10', price: 27821 },
                    { date: '2025/1/1 4:11', price: 28980 },
                    { date: '2024/12/13 4:11', price: 28980 },
                    { date: '2024/12/10 4:10', price: 27821 },
                    { date: '2024/12/1 4:12', price: 28980 },
                    { date: '2024/11/12 4:08', price: 28980 },
                    { date: '2024/11/9 4:08', price: 27241 },
                    { date: '2024/11/1 19:08', price: 28980 },
                    { date: '2024/10/22 19:09', price: 28980 },
                    { date: '2024/10/19 19:09', price: 27821 },
                    { date: '2024/10/11 4:10', price: 28980 },
                    { date: '2024/10/9 4:09', price: 27241 },
                    { date: '2024/10/4 4:10', price: 27821 },
                    { date: '2024/10/1 4:10', price: 28980 },
                    { date: '2024/9/23 4:09', price: 28980 },
                    { date: '2024/9/21 4:09', price: 27821 },
                    { date: '2024/9/10 4:07', price: 28980 },
                    { date: '2024/9/9 4:08', price: 27241 },
                    { date: '2024/9/7 4:08', price: 27821 },
                    { date: '2024/9/1 4:06', price: 28980 },
                    { date: '2024/8/12 4:08', price: 28980 },
                    { date: '2024/8/10 4:08', price: 27821 },
                    { date: '2024/8/9 4:08', price: 27241 },
                    { date: '2024/8/3 4:06', price: 27821 },
                    { date: '2024/7/1 4:07', price: 28980 },
                    { date: '2024/6/24 4:07', price: 28980 },
                    { date: '2024/6/18 4:08', price: 27821 }
                ];
                const cameraName = 'SONY 索尼 ZV-1 II';
                priceData.forEach(item => {
                    db.run(
                        'INSERT INTO prices (camera_name, date, price) VALUES (?, ?, ?)',
                        [cameraName, item.date, item.price],
                        (err) => {
                            if (err) {
                                // 允許重複插入，不顯示錯誤
                            } else {
                                console.log(`已插入: ${cameraName}, ${item.date}, ${item.price}`);
                            }
                        }
                    );
                });
                console.log('批量價格資料已插入完成');
            }
        });
    }
});

module.exports = db;

