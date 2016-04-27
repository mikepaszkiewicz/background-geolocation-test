//turf and mapbox look at data differently
//Mapbox wants full geoJSON, but turf just wants array of coords
//this will be grabbed from relevant habitat documents
const turfPolygon = temple.data.geometry.coordinates;
const mapboxPolygon = temple;

render = {};

render.schoolBounds = function(map) {
  //WATCH OUT: addSource string must match addLayer source
  map.addSource('temple', mapboxPolygon);

  map.addLayer({
      'id': 'route',
      'type': 'fill',
      'source': 'temple',
      'layout': {},
      'paint': {
          'fill-color': '#088',
          'fill-opacity': 0.4
      }
  });
};

render.students = function(map){
  polygon = turf.polygon(turfPolygon);

  //make turf.point using raw lngLat array.
  //best practice seems to be that after you declare the point,
  //always get coords via <point_variable>.geometry.coordinates

  pointInside = turf.point(temple.center, {
    "marker-color": "#6BC65F"
  });

  pointOutside = turf.point(temple.outside, {
    "marker-color": "#6BC65F"
  });

  //turf.inside
  //param1: expects the coords to be an turf.point Obj, not a coord array
  //param2: expects an array, of an array, of coordinates.
  //        not the full geoJSON thing. this is how turf defines polygons
  isPointOutside1 = (turf.inside(pointInside, polygon)? 'isInside': 'isOutside');
  isPointOutside2 = (turf.inside(pointOutside, polygon) ? 'isInside': 'isOutside');

  map.addSource("markers", {
    "type": "geojson",
    "data": {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": pointInside.geometry.coordinates

            },
            "properties": {
                "title": isPointOutside1,
                "marker-symbol": "monument"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": pointOutside.geometry.coordinates
            },
            "properties": {
                "title":  isPointOutside2,
                "marker-symbol": "harbor"
            }
        }]
    }
  });

  map.addLayer({
      "id": "markers",
      "type": "symbol",
      "source": "markers",
      "layout": {
          "icon-image": "{marker-symbol}-15",
          "text-field": "{title}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.6],
          "text-anchor": "top"
      }
  });
};

render.runnerLocation = function(map, source){
  map.addSource('drone', source);
  map.addLayer({
     "id": "drone",
     "type": "symbol",
     "source": "drone",
     "layout": {
         "icon-image": "bicycle-15",
     }
  });
};

transformToGJSON = function(coords) {
  return {
    "geometry": {
      "type": "Point",
      "coordinates": [
        coords.lng,
        coords.lat
      ]
    },
    "type": "Feature",
    "properties": {}
  };
};