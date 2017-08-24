import { combineEpics } from "redux-observable"
import dragEpic from "./dragEpic"

const rootEpic = combineEpics(
  dragEpic
)

export default rootEpic
