import find from 'lodash/array/find'
import {createSelector} from 'reselect'

const combineds = new WeakMap()

matchExtras(a, b) {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  return aKeys.every(key => {
    const aValue = a[key]
    const bValue = b[key]

    if (isArray(aValue)) {
      return aValue.every((aValueChild, index) => aValueChild === bValue[child])
    }
    else {
      return aValue === bValue
    }
  })
}

combine(item, nextExtra) {
  if (!combineds.has(item)) {
    combineds.set(item, item)
  }
  let match
  const memorized = combineds.get(item)

  if (memorized(nextExtra, memorized)) {
    return memorized
  }
  else {
    return {...item, ...nextExtra}
  }
}

const mapEase = (items, itemId) => findItemById(items, itemId)

const mapKey = (items, itemId) => {
  const key = findItemById(items, itemId)
  return combine(key, {
    ease: mapEase(items, key.ease)
  })
}

const mapParam = (items, itemId) => {
  let param = findItemById(items, itemId)
  return combine(param, {
    params: param.params.map(paramId => mapParam(items, itemId))
    keys: param.keys.map(keyId => mapKey(items, itemId))
  })
}

const mapTrack = (items, itemId) => {
  const track = findItemById(items, itemId)
  return combine(track, {
    params: track.params.map(paramId => mapParam(items, itemId))
  })
}

const itemsSelector = state => state.items
const currentProjectSelector = state =>
  findItemById(items, state.currentProjectId)
const currentTimelineSelector = createSelector(
  [itemsSelector, currentProjectSelector],
  (items, currentProject) =>
    findItemById(items, currentProject.currentTimelineId)
)
const currentTimelineSelector = createSelector(
  [itemsSelector, currentTimelineSelector],
  (items, currentTimeline) => {
    return {
      ...currentTimeline,
      tracks: currentTimeline.tracks.map(trackId => mapTrack(items, itemId))
    }
  }
)
const mapTimelineData (items, project) => {
  const currentTimeline = findItemById(items, project.currentTimelineId)
  return {
    ...currentTimeline,
    tracks: currentTimeline.tracks.map(trackId => mapTrack(items, itemId))
  }
}

export default createSelector(
  [itemsSelector, currentTimelineSelector],
  mapTimelineData
)
