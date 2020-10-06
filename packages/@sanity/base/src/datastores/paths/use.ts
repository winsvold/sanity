import {Path} from '@sanity/types'
import {useEffect, useState, useContext, useCallback} from 'react'
import {EMPTY_PATH, ListenOptions} from './manager'
import {PathsContext} from './context'
import {PathStatus} from './types'

const defaultOptions: ListenOptions = {
  includeChildren: false
}

export function usePathStatus(path: Path, options: ListenOptions = defaultOptions): PathStatus {
  const {pathsManager} = useContext(PathsContext)
  const [pathStatus, setPathStatus] = useState<PathStatus>({
    isFocused: false,
    isHovered: false,
    isDangerous: false
  })

  useEffect(() => {
    const sub = pathsManager.listen(path, options).subscribe(setPathStatus)
    return () => sub.unsubscribe()
  }, [path, options, pathsManager])

  return pathStatus
}

interface HoverReporter {
  onEnter: (event?: unknown) => void
  onLeave: (event?: unknown) => void
  onEnterDanger: (event?: unknown) => void
  onLeaveDanger: (event?: unknown) => void
}

export function useHoverReporter(path: Path): HoverReporter {
  const {pathsManager} = useContext(PathsContext)
  const onEnter = useCallback(() => pathsManager.report('hover', path), [pathsManager, path])
  const onLeave = useCallback(() => pathsManager.report('hover', EMPTY_PATH), [pathsManager])
  const onEnterDanger = useCallback(() => pathsManager.report('danger', path), [pathsManager, path])
  const onLeaveDanger = useCallback(() => pathsManager.report('danger', EMPTY_PATH), [pathsManager])
  return {onEnter, onLeave, onEnterDanger, onLeaveDanger}
}
