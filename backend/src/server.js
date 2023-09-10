const express = require("express");
const cors = require('cors')
const ping = require("ping");

const port = process.env.PORT || 4444;
const app = express();
app.use(cors())

const europe = process.env.EUROPE_HOST || 'reg-europe';
const asia = process.env.ASIA_HOST || 'reg-asia';
const usWest = process.env.USWEST_HOST || 'reg-us-west';
const usEast = process.env.USEAST_HOST || 'reg-us-east';

let regions = {
    'europe-west4': {
        private: `${europe}.railway.internal`,
        public:
            `${europe}-production.up.railway.app`
    },
    'asia-southeast1': {
        private: `${asia}.railway.internal`,
        public:
            `${asia}-production.up.railway.app`
    },
    'us-west1': {
        private: `${usWest}.railway.internal`,
        public:
            `${usWest}-production.up.railway.app`
    }
    ,
    'us-east4': {
        private: `${usEast}.railway.internal`,
        public:
            `${usEast}-production.up.railway.app`
    },
}

let data = Object.fromEntries(Object.keys(regions).map(region => {
    return [region, {
        public: [],
        private: [],
    }]
}));


app.get("/ping", async (req, res) => {
    let pings = await Promise.all(Object.entries(regions).map(async ([region, host]) => {
            const pub = await ping.promise.probe(host.public);
            const priv = await ping.promise.probe(host.private);
            data[region].public.push(pub.time);
            data[region].private.push(priv.time);

            return [region, {
                public: Math.round(pub.time),
                private: Math.round(priv.time),
            }]

        }
    ));
    const results = Object.fromEntries(pings);
    console.log(results);
    res.send(
        results
    );
});

const average = (values) => {
    if (values.length === 0) return -1;
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