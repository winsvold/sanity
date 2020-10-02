import React, {FC, ReactNode} from 'react'
import {useOnWindowResize} from './useOnWindowResize'

const ResizeMonitor: FC<{onResize: () => void; children: ReactNode}> = ({onResize, children}) => {
  useOnWindowResize(onResize)

  return <>{children}</>
}

export {ResizeMonitor}
