import {storiesOf} from 'part:@sanity/storybook'
import {withKnobs} from 'part:@sanity/storybook/addons/knobs'
import {DefaultStory} from './stories/default'
import {ConnectorsStory} from './stories/connectors'

storiesOf('@sanity/components/overlay', module)
  .addDecorator(withKnobs)
  .add('Default', DefaultStory)
  .add('Connectors', ConnectorsStory)
