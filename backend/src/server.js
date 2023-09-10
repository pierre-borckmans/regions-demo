const express = require("express");
const cors = require('cors')
const ping = require("ping");
const axios = require('axios');
const https = require("https")

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

const port = process.env.PORT || 4444;
const app = express();
app.use(cors())

const europe = process.env.EUROPE_HOST || 'reg-europe';
const asia = process.env.ASIA_HOST || 'reg-asia';
const usWest = process.env.USWEST_HOST || 'reg-us-west';
const usEast = process.env.USEAST_HOST || 'reg-us-east';

let regions = {
    'europe-west4': {
        private: `http://${europe}.railway.internal:3000`,
        public:
            `https://${europe}-production.up.railway.app`
    },
    'asia-southeast1': {
        private: `http://${asia}.railway.internal:3000`,
        public:
            `https://${asia}-production.up.railway.app`
    },
    'us-west1': {
        private: `http://${usWest}.railway.internal:3000`,
        public:
            `https://${usWest}-production.up.railway.app`
    }
    ,
    'us-east4': {
        private: `http://${usEast}.railway.internal:3000`,
        public:
            `https://${usEast}-production.up.railway.app`
    },
}

let data = Object.fromEntries(Object.keys(regions).map(region => {
    return [region, {
        public: [],
        private: [],
    }]
}));


app.get("/pingAll", async (req, res) => {
    let pings = await Promise.all(Object.entries(regions).map(async ([region, host]) => {
            // const pub = await ping.promise.probe(host.public);
            // const priv = await ping.promise.probe(host.private);

            let start = Date.now();
            await axios.get(`${host.public}/ping`, {httpsAgent})
            const pub = Date.now() - start;

            data[region].public.push(pub);

            start = Date.now();
            await axios.get(`${host.private}/ping`, {httpsAgent})
            const priv = Date.now() - start;
            data[region].private.push(priv);

            return [region, {
                public: pub,
                private: priv,
            }]

        }
    ));
    const results = Object.fromEntries(pings);
    res.send(
        results
    );
});

app.get("/ping", async (req, res) => {
    res.send("PONG")
});


const average = (values) => {
    if (values.length === 0) return undefined;
    return values.reduce((a, b) => (a + b)) / values.length;
}

const min = (values) => {
    return Math.min(...values)
}

const max = (values) => {
    return Math.max(...values)
}

app.get("/stats", async (req, res) => {
    const stats = Object.fromEntries(Object.keys(regions).map(region => {
        return [region, {
            public: {
                avg: average(data[region].public),
                min: min(data[region].public),
                max: max(data[region].public),
            },
            private: {
                avg: average(data[region].private),
                min: min(data[region].private),
                max: max(data[region].private),
            },
        }]
    }));
    res.send(stats)
})


app.listen(port, () => {
    console.log(`Region Ping app listening at http://localhost:${port}`);
});