import { geoBounds } from "d3-geo"

export default function calculateGlobePosition(sectors) {
  console.log("CALCULATE LAMBDA PHI IS CALLED")
  let lambda = 0
  let phi = 0
  if (sectors.length) {
    const lineStringCoords = sectors.map((sector) => {
      return [[sector[0].lng, sector[0].lat], [sector[1].lng, sector[1].lat]]
    })
    const multiLineString = { type: "MultiLineString", coordinates: lineStringCoords }
    const boundingBox = geoBounds(multiLineString)

    if (boundingBox[0][0] <= boundingBox[1][0]) {
      lambda = -(boundingBox[0][0] + boundingBox[1][0]) / 2
    } else {
      lambda = (-(boundingBox[0][0] + boundingBox[1][0] + 360) / 2)
    }

    if (phi < -65) {
      phi = -65
    } else if (phi > 65) {
      phi = 65
    } else {
      phi = -(boundingBox[0][1] + boundingBox[1][1]) / 2
    }
  }
  return { lambda, phi }
}
