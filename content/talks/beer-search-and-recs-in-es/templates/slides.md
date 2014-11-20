!slide

# Beer Search & Recommendations
## Using ElasticSearch (Kind Of...)

Josh Finnie

Software Maven @ [TrackMaven](http://trackmaven.com)

!slide

# Data Collection

Let's steal [BreweryDB's](http://www.brewerydb.com/) database (using python)...

```python
#!/usr/local/bin/python
import json
import os

import requests

URL = "http://api.brewerydb.com/v2/beers/?withBreweries=Y&key={}&p={}"

for i in range(0, 683):
    r = requests.get(URL.format(os.environ['BREWERYDB_API_KEY'], i+1))
    file_name = "beer_dump/{}_beer_dump.json".format(i+1)
    data = r.json()
    if data['status'] == u'success':
        with open(file_name, 'w') as outfile:
            json.dump(data, outfile)
            print "Page {}".format(i+1)
    else:
        print "{} page failed.".format(i+1)
```

!slide

# Data Collection (Con't)

Yep, that worked...

![Beer Dumps](/assets/imgs/beer-dumps.png)

!slide

# Importing to ES

Adding `json` to ES (using cofffeescript)...

```coffeescript
fs = require "fs"
ElasticSearch = require "elasticsearch"

client = new ElasticSearch.Client(
  host: "localdocker:9200"
  log: "trace"
)

esIndex = 0
directory = __dirname + "/beer_dump"

fs.readdir directory, (err, files) ->
  throw err  if err
  files.forEach (file) ->
    fs.readFile directory + "/" + file, "utf-8", (err, beers) ->
      throw err  if err
      beers = JSON.parse(beers)
      data = beers["data"]
      data.forEach (elem, index, array) ->
        output = {}
        output["brewery"] = elem["breweries"][0]["name"] if elem["breweries"]
        output["beer"] = elem["name"]
        output["glassware"] = elem["glass"]["name"] if elem["glass"]
        output["category"] = elem["style"]["category"]["name"] if elem["style"]
        output["glasswareId"] = elem["glasswareId"] if elem["glasswareId"]
        output["styleId"] = elem["styleId"] if elem["styleId"]
        if output["glasswareId"] and output["styleId"] and output["brewery"]
          esIndex++
          client.create
            index: "beers_test"
            type: "beer_test"
            id: esIndex
            body: output
          , (err, res) ->
            if err
              console.log err
            else
              console.log res
```

!slide

# Building the Website API

* Node.js application
* [HAPI](http://hapijs.com/) framework
* Search Endpoint
* Recommendation Endpoint

!slide

# Search Endpoint

```coffeescript
server.route
  method: "GET"
  path: "/search"
  handler: (req, res) ->
    client.search(
      index: 'beers_test'
      type: 'beer_test'
      body:
        query:
          match:
            beer: req.query.beer
    ).then ((resp) ->
        results = []
        hits = resp.hits.hits
        for hit in hits
            results.push(hit['_source'])
        res results
    ), (err) ->
        console.trace err.message
```

!slide

# Recommendation Endpoint

```coffeescript
server.route
  method: "GET"
  path: "/recommend"
  handler: (req, res) ->
    client.search(
      index: 'beers_test'
      type: 'beer_test'
      body:
        query:
          match:
            beer: req.query.beer
    ).then ((resp) ->
        hit = resp.hits.hits[0]
        glasswareId = hit['_source']['glasswareId']
        styleId = hit['_source']['styleId']
        client.search(
          index: 'beers_test'
          type: 'beer_test'
          body:
            query:
              bool:
                must: [
                  term:
                    'glasswareId': glasswareId
                  term:
                    'styleId': styleId
                ]
        ).then ((resp) ->
            results = []
            hits = resp.hits.hits
            for hit in hits
                results.push(hit['_source'])
            res results
        ), (err) ->
            console.trace err.message
    ), (err) ->
        console.trace err.message
```

!slide

# Future

* Would love to make Recommendations more robust
    * Currently just matching style and glassware type...
* Would love to create some speedups in search
* Not sure the benefits over Postgres text search
    * This is what I have implemented now and it's `good enough`...

!slide

# Thanks

* I am [Josh Finnie](http://www.joshfinnie.com)
* Find me @joshfinnie on [Twitter](http://twitter.com/joshfinnie) & [Github](http://github.com/joshfinnie)
* Find the slides [here](http://www.joshfinnie.com/talks/)
* [Come work for TrackMaven](http://trackmaven.theresumator.com/apply/EzkTn4/Software-Maven.html)
