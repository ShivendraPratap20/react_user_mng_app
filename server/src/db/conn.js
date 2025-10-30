const mong = require("mongoose");

(async()=>{
    try {
        const connecting = await mong.connect(process.env.DB_CONN_URI);
        console.log(`Database connection established`);
    } catch (error) {
        console.log(`Error while connecting to database ${error}`);
    }
})();

module.exports = mong;