// default app configuration
const port = process.env.PORT || 4000;
let db = process.env.MONGODB_URI || "mongodb://localhost:27017/nodegoat";

module.exports = {
    port,
    db,
    cookieSecret: process.env.COOKIE_SECRET || "dev-only-insecure-fallback",
    cryptoKey: process.env.CRYPTO_KEY || "dev-only-insecure-fallback",
    cryptoAlgo: "aes256",
    hostName: "localhost",
    environmentalScripts: []
};