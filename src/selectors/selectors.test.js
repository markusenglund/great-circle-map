const { getBrighterColor } = require("./colorSelector.js")
const { getAirports, getSectors, getGlobePosition } = require("./routeSelectors")

describe("getBrighterColor", () => {
  it("brightens dark color", () => {
    expect(getBrighterColor({ settings: { routeColor: "#000000" } })).toBe("#141414")
  })
  it("turns C0FEFE to d4ffff", () => {
    expect(getBrighterColor({ settings: { routeColor: "#C0FEFE" } })).toBe("#d4ffff")
  })
})

describe("getAirports", () => {
  it("returns all the airports if passed one route", () => {
    expect(getAirports({ routes: [
      [{ id: 1 }, { id: 20 }]
    ] }))
    .toEqual([{ id: 1 }, { id: 20 }])
  })
  it("returns each airport only once if passed many routes with repeat airports", () => {
    expect(getAirports({ routes: [
      [{ id: 1 }, { id: 2 }, { id: 34 }],
      [{ id: 2 }, { id: 3 }]
    ] }))
    .toEqual([{ id: 1 }, { id: 2 }, { id: 34 }, { id: 3 }])
  })
  it("returns empty array if routes is empty array", () => {
    expect(getAirports({ routes: [] })).toEqual([])
  })
})

describe("getSectors", () => {
  it("returns two sectors if passed aroute with three airports ", () => {
    expect(getSectors({ routes: [
      [{ id: 1 }, { id: 20 }, { id: 21 }]
    ] }))
    .toEqual([
      [{ id: 1 }, { id: 20 }],
      [{ id: 20 }, { id: 21 }]
    ])
  })
  it("works with multiple routes", () => {
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
  it("works with empty array", () => {
    expect(getSectors({ routes: [] })).toEqual([])
  })
})
