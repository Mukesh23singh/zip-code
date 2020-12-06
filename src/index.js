// lambda-like handler function
const data = require('./data.json');
const jsonQuery = require('json-query');

module.exports.handler = async (event, context, callback) => {
  let query = event.queryStringParameters;
  let queries = [];
  let results = [];

  function closestLocation(targetLocation, locationData) {
    function vectorDistance(dx, dy) {
      return Math.sqrt(dx * dx + dy * dy);
    }

    function locationDistance(location1, location2) {
      let dx = location1.latitude - location2.latitude,
        dy = location1.longitude - location2.longitude;

      return vectorDistance(dx, dy);
    }

    return locationData.reduce(function(prev, curr) {
      let prevDistance = locationDistance(targetLocation, prev),
        currDistance = locationDistance(targetLocation, curr);
      return prevDistance < currDistance ? prev : curr;
    });
  }

  if (query.latitude && query.longitude) {
    let targetLocation = {
      latitude: query.latitude,
      longitude: query.longitude,
    };
    let closest = closestLocation(targetLocation, data);
    results.push(closest);
  }

  if (query.zip) {
    queries.push(`[*zip~/^${zip}/i]`);
  }

  if (query.primary_city) {
    queries.push(`[*zip~/^${primary_city}/i]`);
  }

  if (query.acceptable_cities) {
    queries.push(`[*zip~/^${acceptable_city}/i]`);
  }

  if (query.unacceptable_cities) {
    queries.push(`[*zip~/^${unacceptable_city}/i]`);
  }

  queries.forEach((query) => {
    value = jsonQuery(query, {
      data: data,
      allowRegexp: true,
    }).value;
    results.push(value);
  });
  return results;
};
