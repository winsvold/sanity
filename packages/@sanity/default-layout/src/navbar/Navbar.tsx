import {Box, Button, CardProvider, ElementQuery, Text, Tooltip} from '@sanity/ui'
import config from 'config:sanity'
import {useRouterState} from 'part:@sanity/base/router'
import * as sidecar from 'part:@sanity/default-layout/sidecar?'
import React, {createElement, useCallback, useState} from 'react'
import {StateButton} from '../components'
import {DatasetSelect} from '../datasetSelect'
import {Tool} from '../types'
import {HAS_SPACES} from '../util/spaces'
import {Branding} from './branding'
import {LoginStatus} from './loginStatus'
import {PresenceMenu} from './presenceMenu'
import {DocumentSearch} from './search'
import {SanityStatus, useLatestVersions} from './studioStatus'
import {
  Root,
  HamburgerContainer,
  BrandingContainer,
  DatasetSelectContainer,
  NarrowCreateButtonContainer,
  WideCreateButtonContainer,
  SearchContainer,
  PackageStatusContainer,
  HelpButtonContainer,
  SearchButtonContainer,
  ToolMenuContainer,
  LoginStatusBox
} from './styles'
import {ToolMenu} from './toolMenu'

interface Props {
  createMenuIsOpen: boolean
  onCreateButtonClick: () => void
  onSearchClose: () => void
  onSearchOpen: () => void
  onSwitchTool: () => void
  onToggleMenu: () => void
  onUserLogout: () => void
  searchIsOpen: boolean
  tools: Tool[]
}

const TOUCH_DEVICE = 'ontouchstart' in document.documentElement

export function Navbar(props: Props) {
  const {
    createMenuIsOpen,
    onCreateButtonClick,
    onToggleMenu,
    onSwitchTool,
    onUserLogout,
    onSearchOpen,
    tools,
    searchIsOpen
  } = props
  const routerState = useRouterState()
  const latestVersions = useLatestVersions()
  const rootState = HAS_SPACES && routerState.space ? {space: routerState.space} : {}
  const [toolMenuVisible, setToolMenuVisible] = useState(true)
  const handleToolMenuHide = useCallback(() => setToolMenuVisible(false), [])
  const handleToolMenuShow = useCallback(() => setToolMenuVisible(true), [])

  return (
    <CardProvider scheme="dark">
      <ElementQuery>
        <Root data-ui="Navbar" data-search-open={searchIsOpen} padding={1}>
          {!toolMenuVisible && (
            <HamburgerContainer showToolMenu={toolMenuVisible}>
              <Box padding={1}>
                <Button
                  aria-label="Open menu"
                  icon="menu"
                  mode="bleed"
                  onClick={onToggleMenu}
                  padding={3}
                  title="Open menu"
                />
              </Box>
            </HamburgerContainer>
          )}

          <NarrowCreateButtonContainer>
            <Box padding={1}>
              <Tooltip
                disabled={TOUCH_DEVICE}
                content={
                  <Box padding={2}>
                    <Text size={1}>Create new document</Text>
                  </Box>
                }
                placement="bottom"
              >
                <Button
                  aria-label="Create"
                  icon="compose"
                  mode="bleed"
                  onClick={onCreateButtonClick}
                  padding={3}
                  selected={createMenuIsOpen}
                />
              </Tooltip>
            </Box>
          </NarrowCreateButtonContainer>

          <BrandingContainer>
            <Box padding={1}>
              <StateButton
                mode="bleed"
                padding={3}
                state={rootState}
                text={<Branding projectName={config && config.project.name} />}
              />
            </Box>
          </BrandingContainer>

          {HAS_SPACES && (
            <DatasetSelectContainer showToolMenu={toolMenuVisible}>
              <Box padding={1}>
                <DatasetSelect />
              </Box>
            </DatasetSelectContainer>
          )}

          <WideCreateButtonContainer>
            <Box padding={1}>
              <Tooltip
                disabled={TOUCH_DEVICE}
                content={
                  <Box padding={2}>
                    <Text size={1}>Create new document</Text>
                  </Box>
                }
                placement="bottom"
              >
                <Button
                  aria-label="Create"
                  icon="compose"
                  mode="bleed"
                  onClick={onCreateButtonClick}
                  padding={3}
                  selected={createMenuIsOpen}
                />
              </Tooltip>
            </Box>
          </WideCreateButtonContainer>

          <CardProvider scheme="light">
            <SearchContainer data-ui="SearchContainer" open={searchIsOpen}>
              <Box padding={1}>
                <DocumentSearch
                // shouldBeFocused={searchIsOpen}
                // onOpen={onSearchOpen}
                // onClose={onSearchClose}
                />
              </Box>
            </SearchContainer>
          </CardProvider>

          <ToolMenuContainer data-ui="ToolMenuContainer" flex={1} padding={1}>
            {tools.length > 1 && (
              <ToolMenu
                activeToolName={routerState.tool}
                onHide={handleToolMenuHide}
                onShow={handleToolMenuShow}
                onSwitchTool={onSwitchTool}
                tools={tools}
              />
            )}
          </ToolMenuContainer>

          {latestVersions.isLoaded && latestVersions.data && !latestVersions.data.isUpToDate && (
            <PackageStatusContainer>
              <Box padding={1}>
                <SanityStatus latestVersions={latestVersions} />
              </Box>
            </PackageStatusContainer>
          )}

          {sidecar && sidecar.isSidecarEnabled && sidecar.isSidecarEnabled() && (
            <HelpButtonContainer>
              <Box padding={1}>{sidecar && createElement(sidecar.SidecarToggleButton)}</Box>
            </HelpButtonContainer>
          )}

          <Box padding={1}>
            <PresenceMenu />
          </Box>

          <LoginStatusBox padding={1}>
            <LoginStatus onLogout={onUserLogout} />
          </LoginStatusBox>

          <SearchButtonContainer open={searchIsOpen}>
            <Box padding={1}>
              <Button icon="search" mode="bleed" onClick={onSearchOpen} padding={3} />
            </Box>
          </SearchButtonContainer>
        </Root>
      </ElementQuery>
    </CardProvider>
  )
}
