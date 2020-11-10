import {MasterDetailIcon, PlugIcon} from '@sanity/icons'
import {action} from 'part:@sanity/storybook/addons/actions'
import {CenteredContainer} from 'part:@sanity/storybook/components'
import React from 'react'
import ToolMenu from '../navbar/toolMenu/ToolMenu'

export function ToolMenuStory() {
  return (
    <CenteredContainer defaultTone="navbar">
      <div style={{outline: '1px solid red'}}>
        <ToolMenu
          activeToolName="desk"
          direction="horizontal"
          isVisible
          onSwitchTool={() => action('onSwitchTool')}
          router={{} as any}
          tone="navbar"
          tools={[
            {
              name: 'desk',
              title: 'Desk',
              icon: MasterDetailIcon,
            },
            {
              name: 'plugin1',
              title: 'Plugin 1',
              icon: PlugIcon,
            },
            {
              name: 'plugin2',
              title: 'Plugin 2',
              icon: PlugIcon,
            },
          ]}
        />
      </div>
    </CenteredContainer>
  )
}
