import {Path} from '@sanity/types'
import {Observable} from 'rxjs'
import {ListenOptions} from './manager'

export interface PathStatus {
  isHovered: boolean
  isFocused: boolean
  isDangerous: boolean
}

export interface PathsManager {
  report: (type: 'hover' | 'focus' | 'danger', path: Path) => void
  listen: (path: Path, options?: ListenOptions) => Observable<PathStatus>
}
