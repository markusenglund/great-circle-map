import { geoDistance } from 'd3-geo';

export default function getPixelPositions(airports, projection, centerLng, centerLat) {
  return airports.map(curAirport => {
    const curPosition = projection([curAirport.lng, curAirport.lat]);

    const vectorProjections = airports
      .filter(airport => airport.id !== curAirport.id)
      .filter(
        airport => geoDistance([airport.lng, airport.lat], [centerLng, centerLat]) < Math.PI / 2
      )
      .map(airport => {
        const otherPosition = projection([airport.lng, airport.lat]);

        const dx = curPosition[0] - otherPosition[0];
        const dy = otherPosition[1] - curPosition[1]; // Reverse y to make it like real math

        // times twenty makes it equivalent to kilometers so the math is the same as gmaps-function
        const distance = Math.hypot(dx, dy) * 20;
        const vectorLength = 10000 / (1000 + 4 * distance + distance ** 2.5 / 800);
        const vectorDirection = Math.atan2(dy, dx);

        const northEastProj = vectorLength * Math.cos(vectorDirection - Math.PI / 4) ** 3;
        const northWestProj = vectorLength * Math.cos(vectorDirection - 3 * Math.PI / 4) ** 3;

        return { northEastProj, northWestProj };
      });

    if (vectorProjections.length === 0) {
      return { x: curPosition[0], y: curPosition[1] + 14, textAnchor: 'start' };
    }

    const directionalForces = vectorProjections.reduce(
      (acc, val) => {
        let northEast;
        let southWest;
        let northWest;
        let southEast;
        if (val.northEastProj > 0) {
          northEast = acc.northEast + val.northEastProj;
          southWest = acc.southWest - 6 * val.northEastProj;
        } else {
          northEast = acc.northEast + 6 * val.northEastProj;
          southWest = acc.southWest - val.northEastProj;
        }

        if (val.northWestProj > 0) {
          northWest = acc.northWest + val.northWestProj;
          southEast = acc.southEast - 6 * val.northWestProj;
        } else {
          northWest = acc.northWest + 6 * val.northWestProj;
          southEast = acc.southEast - val.northWestProj;
        }
        return { northEast, southWest, northWest, southEast };
      },
      { northEast: 0, southWest: 0, northWest: 0, southEast: 0 }
    );

    const direction = Object.keys(directionalForces).reduce((a, b) => {
      return directionalForces[a] > directionalForces[b] ? a : b;
    });

    const x = curPosition[0];
    let y = curPosition[1];
    let textAnchor;

    switch (direction) {
      case 'northEast': {
        y -= 8;
        textAnchor = 'start';
        break;
      }
      case 'northWest': {
        y -= 8;
        textAnchor = 'end';
        break;
      }
      case 'southWest': {
        y += 17;
        textAnchor = 'end';
        break;
      }
      default: {
        y += 17;
        textAnchor = 'start';
        break;
      }
    }
    return { x, y, textAnchor };
  });
}
