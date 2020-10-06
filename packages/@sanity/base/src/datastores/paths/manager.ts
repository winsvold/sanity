import {Path} from '@sanity/types'
import * as PathUtils from '@sanity/util/paths'
import {BehaviorSubject, combineLatest, Observable} from 'rxjs'
import {map, distinctUntilChanged} from 'rxjs/operators'
import {PathStatus, PathsManager} from './types'

const defaultFilter: ListenOptions['filter'] = ['isFocused', 'isHovered', 'isDangerous']

export const EMPTY_PATH = []

export interface ListenOptions {
  includeChildren?: boolean
  filter?: ('isFocused' | 'isHovered' | 'isDangerous')[]
}

interface Paths {
  hoverPath: Path
  focusPath: Path
  dangerPath: Path
}

export function getPathsManager(initial: Paths): PathsManager {
  const focus = new BehaviorSubject(initial.focusPath || EMPTY_PATH)
  const hover = new BehaviorSubject(initial.hoverPath || EMPTY_PATH)
  const danger = new BehaviorSubject(initial.dangerPath || EMPTY_PATH)

  const combined: Observable<[Path, Path, Path]> = combineLatest([focus, hover, danger])
  const paths: Observable<Paths> = combined.pipe(
    map(([focusPath, hoverPath, dangerPath]) => ({focusPath, hoverPath, dangerPath}))
  )

  function listen(path: Path, options: ListenOptions): Observable<PathStatus> {
    const {includeChildren, filter = defaultFilter} = options
    return paths.pipe(
      getPathMatcher(path, includeChildren),
      distinctUntilChanged(getComparator(filter))
    )
  }

  function report(type: 'hover' | 'focus' | 'danger', path: Path): void {
    if (type === 'focus') {
      focus.next(path)
    } else if (type === 'hover') {
      hover.next(path)
    } else if (type === 'danger') {
      danger.next(path)
    }
  }

  return {listen, report}
}

function getPathMatcher(path: Path, includeChildren: boolean) {
  return map(function matchPaths(paths: Paths): PathStatus {
    const isDangerous = PathUtils.isEqual(paths.dangerPath, path)

    if (includeChildren) {
      const isHovered = PathUtils.startsWith(paths.hoverPath, path)
      const isFocused = PathUtils.hasFocus(paths.focusPath, path)
      return {isHovered, isFocused, isDangerous}
    }

    const isHovered = PathUtils.isEqual(paths.hoverPath, path)
    const isFocused = PathUtils.hasFocus(paths.focusPath, path)
    return {isHovered, isFocused, isDangerous}
  })
}

function getComparator(filter: ListenOptions['filter']) {
  return function statusesAreEqual(statusA: PathStatus, statusB: PathStatus): boolean {
    return filter.every(key => statusA[key] === statusB[key])
  }
}
