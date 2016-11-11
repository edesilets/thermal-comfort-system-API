'use strict';

let graphPoints = function (array) {
    let graphData = [];

    array.forEach(function (e) {
      let dateCreated = e.attributes.created_at;
      let temperature = e.attributes.data;

      let dataPoint = {
        x: dateCreated,
        y: temperature
      };

      graphData.push(dataPoint);
    });
    return graphData;
}

module.exports = {
  graphPoints
};
