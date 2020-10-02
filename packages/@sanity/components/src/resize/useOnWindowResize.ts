import {useEffect} from 'react'

import {Subscriber} from 'nano-pubsub'

const useOnWindowResize = (onWindowResize: Subscriber<Event>): void => {
  useEffect(() => {
    window.addEventListener('resize', onWindowResize)

    return () => window.removeEventListener('resize', onWindowResize)
  }, [onWindowResize])
}

export {useOnWindowResize}
