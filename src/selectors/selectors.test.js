const { getBrighterColor } = require("./colorSelector.js")
const { getAirports, getSectors, getGlobePosition } = require("./routeSelectors")

describe("getBrighterColor", () => {
  test("brighten dark color", () => {
    expect(getBrighterColor({ settings: { routeColor: "#000000" } })).toBe("#141414")
  })
  test("turn C0FEFE to d4ffff", () => {
    expect(getBrighterColor({ settings: { routeColor: "#C0FEFE" } })).toBe("#d4ffff")
  })
})

describe("getAirports", () => {
  test("one route returns all of its airports", () => {
    expect(getAirports({ routes: [
      [{ id: 1 }, { id: 20 }]
    ] }))
    .toEqual([{ id: 1 }, { id: 20 }])
  })
  test("multiple routes with repeating airports", () => {
    expect(getAirports({ routes: [
      [{ id: 1 }, { id: 2 }, { id: 34 }],
      [{ id: 2 }, { id: 3 }]
    ] }))
    .toEqual([{ id: 1 }, { id: 2 }, { id: 34 }, { id: 3 }])
  })
  test("return empty array if routes is empty array", () => {
    expect(getAirports({ routes: [] })).toEqual([])
  })
})

describe("getSectors", () => {
  test("route with three airports returns two sectors", () => {
    expect(getSectors({ routes: [
      [{ id: 1 }, { id: 20 }, { id: 21 }]
    ] }))
    .toEqual([
      [{ id: 1 }, { id: 20 }],
      [{ id: 20 }, { id: 21 }]
    ])
  })
  test("multiple routes", () => {
    expect(getSectors({ routes: [
      [{ id: 1 }, { id: 2 }, { id: 34 }],
      [{ id: 2 }, { id: 3 }]
    ] }))
    .toEqual([
      [{ id: 1 }, { id: 2 }],
      [{ id: 2 }, { id: 34 }],
      [{ id: 2 }, { id: 3 }]
    ])
  })
  test("empty array", () => {
    expect(getSectors({ routes: [] })).toEqual([])
  })
})
