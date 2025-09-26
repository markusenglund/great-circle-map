## About

Great Circle Map is a tool for visualizing flight routes and calculating the distance
between airports. A great circle path (also known as a geodesic path) is the shortest
possible route between two points on the surface of earth or any other sphere. The map
uses the Mercator projection by default. On this type of map, great circle paths tend to
look curved even though they are in fact straight. As an alternative, the website also features a 3D
globe view which doesn’t have that problem.

Projecting a 3-dimensional sphere onto a 2-dimensional screen always creates
distortions. Most world maps use the Mercator projection or something similar. These
projections tend to have large distortions around the polar regions. Distances look
bigger than they really are near the poles, and relatively smaller around the equator.
People tend to be particularly confused by how the shortest route between two cities
like Dubai and Los Angeles goes via the north pole, despite the fact that both of these
cities are situated pretty far south. It makes a lot more sense when you look at an
orthographic projection.

<img src="https://www.greatcirclemap.com/lax-dxb.jpg" />

The distances calculated are the shortest possible distances. However, airlines often don’t follow the shortest route exactly
for a variety of reasons. Airspace reserved for military purposes and areas of
conflict for example. The earth is not a perfect sphere, which is taken into account in
the distance calculations. It is best approximated by an ellipsoid which is widest
around the equator.

If you found a bug or have a suggestion, please contact me at markus.s.englund@gmail.com
or file an issue on Github.

## Setup instructions

- Install Node.js 20 (newer versions might not work)
- Run `npm run build` in the project directory
- Run `node server`
- Open the browser at 127.0.0.1:3000

If you plan to host this on your own domain you have to set up your own Google Maps API key (read more [here](https://developers.google.com/maps/documentation/javascript/overview))

## Airport data

Airport data comes from the [openflights.org](https://openflights.org/data.html#airport) airport database.
