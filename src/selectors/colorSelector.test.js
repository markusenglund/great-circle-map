const { getBrighterColor } = require("./colorSelector.js")

test("adds 1 + 2 to equal 3", () => {
  expect(getBrighterColor("#000000")).toBe("#141414")
})
