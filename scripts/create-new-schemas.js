const mysql = require('mysql2/promise');
const fs = require('fs');

// Read env file manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

async function createNewSchemas() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: envVars.DB_HOST || 'localhost',
            user: envVars.DB_USER || 'root',
            password: envVars.DB_PASSWORD || '',
            database: envVars.DB_NAME || 'gkjtangerang_2024'
        });

        console.log(`Connected to database: ${envVars.DB_NAME}`);

        const schemas = `
      -- 1. new_users
      CREATE TABLE IF NOT EXISTS new_users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          nama_lengkap VARCHAR(100) NOT NULL,
          email VARCHAR(100) NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'user') DEFAULT 'admin',
          status TINYINT DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

      -- 2. new_kategori
      CREATE TABLE IF NOT EXISTS new_kategori (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nama VARCHAR(100) NOT NULL,
          slug VARCHAR(150) NOT NULL UNIQUE,
          status TINYINT DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

      -- 3. new_artikel (Single Table Inheritance for Sejarah, Visi Misi, Berita, Renungan, dll)
      CREATE TABLE IF NOT EXISTS new_artikel (
          id INT AUTO_INCREMENT PRIMARY KEY,
          judul VARCHAR(200) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          isi LONGTEXT NULL,
          tipe_konten ENUM('sejarah', 'visi_misi', 'struktur', 'berita', 'renungan', 'halaman_statis') NOT NULL,
          id_kategori INT NULL,
          id_penulis INT NULL,
          gambar VARCHAR(255) NULL,
          views INT DEFAULT 0,
          status TINYINT DEFAULT 1, -- 1: published, 0: draft
          published_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (id_kategori) REFERENCES new_kategori(id) ON DELETE SET NULL,
          FOREIGN KEY (id_penulis) REFERENCES new_users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

      -- 4. new_menu
      CREATE TABLE IF NOT EXISTS new_menu (
          id INT AUTO_INCREMENT PRIMARY KEY,
          parent_id INT NULL,
          nama VARCHAR(100) NOT NULL,
          url VARCHAR(255) NOT NULL,
          icon VARCHAR(100) NULL,
          urutan INT DEFAULT 0,
          role ENUM('public', 'admin') DEFAULT 'public',
          status TINYINT DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (parent_id) REFERENCES new_menu(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `;

        // Execute multi statements if supported or split them
        // For simplicity, let's split by delimiter
        const statements = schemas.split(';').map(s => s.trim()).filter(s => s.length > 0);

        for (const stmt of statements) {
            console.log(`Executing: ${stmt.substring(0, 50)}...`);
            await connection.query(stmt);
        }

        console.log('Successfully created new_ schemas.');
        await connection.end();
    } catch (e) {
        console.error('Error:', e);
        if (connection) await connection.end();
    }
}

createNewSchemas();
