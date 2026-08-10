import mysql from "mysql2/promise";

declare global {
  var _epsilonDbPool: mysql.Pool | undefined;
}

export function getDb(): mysql.Pool {
  if (!global._epsilonDbPool) {
    global._epsilonDbPool = mysql.createPool({
      host: process.env.DB_HOST ?? "127.0.0.1",
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER ?? "root",
      password: process.env.DB_PASSWORD ?? "",
      database: process.env.DB_NAME ?? "epsilon",
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return global._epsilonDbPool;
}
