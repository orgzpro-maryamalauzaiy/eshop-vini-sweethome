const midtransClient = require('midtrans-client');
// const dotenv = require('dotenv')
// dotenv.config()

const SERVER_KEY = process.env.SERVER_MODE=='development'?process.env.PG_SANDBOX_SERVER_KEY : process.env.PG_PROD_SERVER_KEY
// Create Snap API instance
export const snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction : false,
        serverKey : SERVER_KEY
    });