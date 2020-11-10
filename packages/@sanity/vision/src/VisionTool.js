import {EyeOpenIcon} from '@sanity/icons'
import {route} from 'part:@sanity/base/router'
import SanityVision from './SanityVision'

export default {
  router: route('/*'),
  name: 'vision',
  title: 'Vision',
  icon: EyeOpenIcon,
  component: SanityVision,
}
