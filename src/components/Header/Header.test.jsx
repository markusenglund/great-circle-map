import React from "react"
import renderer from "react-test-renderer"
import { MemoryRouter } from "react-router-dom"
import Header from "./"

it("renders correctly", () => {
  const tree = renderer
  .create(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )
  .toJSON()
  expect(tree).toMatchSnapshot()
})
