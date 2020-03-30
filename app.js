const cors = require('cors');
const fetch = require('node-fetch');
const history = require('connect-history-api-fallback');
const podcastRSSUrl = `http://feeds.soundcloud.com/users/soundcloud:users:${scUser}/sounds.rss`;
const express = require('express');
const app = express();
const port = process.env.PORT || 9000;
const soundcloud_oauth = process.env.soundcloud_oauth;
const soundcloud_userid = process.env.soundcloud_userid;
const soundcloud_clientid = process.env.soundcloud_clientid;

app.use(cors());

app.get('/p/rss', (req, res) => {
  res.type('application/xml');

  fetch(podcastRSSUrl)
    .then(response => response.text())
    .then(body => res.send(body));
});

app.get('/p/json', async (req, res) => {
  res.type('application/json');

  const response = await fetch(`https://api-v2.soundcloud.com/users/${soundcloud_userid}/tracks?representation=&client_id=${soundcloud_clientid}&limit=20&offset=0&linked_partitioning=1&app_version=1563180860&app_locale=en`, {
    'credentials': 'include',
    'headers': {
      'accept': 'application/json, text/javascript, */*; q=0.01',
      'authorization': soundcloud_oauth,
      'sec-ch-ua': 'Google Chrome 80',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site'
    },
    'referrer': 'https://soundcloud.com/',
    'referrerPolicy': 'origin',
    'body': null,
    'method': 'GET',
    'mode': 'cors'
  });

  console.log(response);

  const body = await response.text();

  console.log(body);

  res.send(body);
});

app.use(history());
app.listen(port, () => console.log(`Listening on port ${port}!`));
