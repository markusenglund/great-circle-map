import "rxjs/add/operator/filter"
import "rxjs/add/operator/mapTo"

export default function dragEpic(action$) {
  return action$
    .filter(action => action.type === "MOUSE_MOVE")
    .mapTo({ type: "DRAG_GLOBE" })
}
