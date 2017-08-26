import { geoBounds } from "d3-geo"

export default function calculateGlobePosition(sectors) {
  let centerLng = 0
  let centerLat = 0
  if (sectors.length) {
    const lineStringCoords = sectors.map((sector) => {
      return [[sector[0].lng, sector[0].lat], [sector[1].lng, sector[1].lat]]
    })
    const multiLineString = { type: "MultiLineString", coordinates: lineStringCoords }
    const boundingBox = geoBounds(multiLineString)
    console.log(boundingBox)
    if (boundingBox[0][0] <= boundingBox[1][0]) {
      centerLng = (boundingBox[0][0] + boundingBox[1][0]) / 2
    } else {
      centerLng = (boundingBox[0][0] + (boundingBox[1][0] + 360)) / 2
    }

    if (centerLat < -65) {
      centerLat = -65
    } else if (centerLat > 65) {
      centerLat = 65
    } else {
      centerLat = (boundingBox[0][1] + boundingBox[1][1]) / 2
    }
  }
  console.log(centerLng, centerLat)
  return { centerLng, centerLat }
}
