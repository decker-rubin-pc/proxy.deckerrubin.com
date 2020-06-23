const _ = require('lodash');
const cors = require('cors');
const fetch = require('node-fetch');
const history = require('connect-history-api-fallback');
const express = require('express');
const app = express();
const port = process.env.PORT || 9000;
const soundcloud_userid = process.env.soundcloud_userid || '564051336';
const podcastRSSUrl = `http://feeds.soundcloud.com/users/soundcloud:users:${soundcloud_userid}/sounds.rss`;
const { parseString } = require('xml2js');

app.use(cors());

app.get('/p/json', async (req, res) => {
    res.type('application/json');

    try {
        const response = await fetch(podcastRSSUrl);
        const body = await response.text();

        parseString(body, (err, result) => {
            const collection = {
                collection: _
                    .chain(result)
                    .get('rss.channel[0].item')
                    .map(x => ({
                        id: _.last(_.first(x.link).split('/')),
                        description: _.first(x.description),
                        title: _.first(x.title),
                        created_at: new Date(_.first(x.pubDate)),
                        public: true,
                        link: _.first(x.link)
                    }))
                    .value()
            };

            res.send(collection);
        });
    } catch (err) {
        console.error(err);
        res.send(err);
    }
});

app.use(history());
app.listen(port, () => console.log(`Listening on port ${port}!`));
