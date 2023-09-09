const express = require("express");
const cors = require('cors')
const ping = require("ping");

const port = process.env.PORT || 4444;
const app = express();
app.use(cors())


let regions = {
    'europe-west4': {
        private: 'europe.railway.internal',
        public:
            'europe-production.up.railway.app'
    },
    'asia-southeast1': {
        private: 'asia.railway.internal',
        public:
            'asia-production.up.railway.app'
    },
    'us-west1': {
        private: 'us-west.railway.internal',
        public:
            'us-west-production.up.railway.app'
    }
    ,
    'us-east4': {
        private: 'us-east.railway.internal',
        public:
            'us-east-production.up.railway.app'
    },
}

app.get("/ping", async (req, res) => {
    let pings = await Promise.all(Object.entries(regions).map(async ([region, host]) => {
            const pub = await ping.promise.probe(host.public);
            const priv = await ping.promise.probe(host.private);
            return [region, {
                public: pub.time,
                private: priv.time,
            }]

        }
    ));
    const results = Object.fromEntries(pings);
    console.log(results);
    res.send(
        results
    );
});

app.listen(port, () => {
    console.log(`Region Ping app listening at http://localhost:${port}`);
});