import classNames from 'classnames'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import AppLoadingScreen from 'part:@sanity/base/app-loading-screen'
import {RouteScope, useRouterState} from 'part:@sanity/base/router'
import absolutes from 'all:part:@sanity/base/absolutes'
import userStore from 'part:@sanity/base/user'
import Sidecar from './addons/Sidecar'
import RenderTool from './main/RenderTool'
import ActionModal from './actionModal/ActionModal'
import SideMenu from './navbar/sideMenu/SideMenu'
import NavbarContainer from './navbar/NavbarContainer'
import {SchemaErrorReporter} from './schemaErrors/SchemaErrorReporter'
import getNewDocumentModalActions from './util/getNewDocumentModalActions'
import {Tool, User} from './types'

import styles from './DefaultLayout.css'

export interface DefaultLayoutProps {
  tools: Tool[]
}

export default function DefaultLayout(props: DefaultLayoutProps) {
  const routerState = useRouterState()
  const {tools} = props
  const loadingScreenRef = useRef<HTMLDivElement | null>(null)
  const [createMenuIsOpen, setCreateMenuIsOpen] = useState(false)
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [searchIsOpen, setSearchIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const isOverlayVisible = menuIsOpen || searchIsOpen
  const activeToolName = routerState.tool

  const handleAnimationEnd = useCallback(() => setShowLoadingScreen(false), [])
  const handleToggleMenu = useCallback(() => setMenuIsOpen(val => !val), [])
  const handleCreateButtonClick = useCallback(() => setCreateMenuIsOpen(val => !val), [])
  const handleActionModalClose = useCallback(() => setCreateMenuIsOpen(false), [])
  const handleSwitchTool = useCallback(() => setMenuIsOpen(false), [])
  const handleSearchOpen = useCallback(() => setSearchIsOpen(true), [])
  const handleSearchClose = useCallback(() => setSearchIsOpen(false), [])
  const handleUserLogout = useCallback(() => userStore.actions.logout(), [])

  const handleClickCapture = useCallback(
    event => {
      // Do not handle click if the event is not within DefaultLayout (portals)
      const rootTarget = event.target.closest(`.${styles.root}`)
      if (!rootTarget) return

      if (menuIsOpen) {
        // Close SideMenu if the user clicks outside
        const menuTarget = event.target.closest(`.${styles.sideMenuContainer}`)
        if (!menuTarget) {
          event.preventDefault()
          event.stopPropagation()
          handleToggleMenu()
        }
      }
    },
    [handleToggleMenu, menuIsOpen]
  )

  useEffect(() => {
    const userSubscription = userStore.currentUser.subscribe(event =>
      setUser(event.type === 'snapshot' ? event.user : null)
    )

    return () => userSubscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!showLoadingScreen) return undefined

    const loadingScreenElement = loadingScreenRef.current

    if (loadingScreenElement) {
      loadingScreenElement.addEventListener('animationend', handleAnimationEnd, false)
    }

    return () => {
      if (loadingScreenElement) {
        loadingScreenElement.removeEventListener('animationend', handleAnimationEnd, false)
      }
    }
  }, [handleAnimationEnd, showLoadingScreen])

  useEffect(() => {
    if (!mounted) setMounted(true)
  }, [mounted])

  return (
    <SchemaErrorReporter>
      {() => (
        <div
          className={classNames(styles.root, isOverlayVisible && styles.isOverlayVisible)}
          onClickCapture={handleClickCapture}
        >
          {showLoadingScreen && (
            <div
              className={
                mounted || document.visibilityState == 'hidden'
                  ? styles.loadingScreenLoaded
                  : styles.loadingScreen
              }
              ref={loadingScreenRef}
            >
              <AppLoadingScreen text="Restoring Sanity" />
            </div>
          )}

          <div className={styles.navBar}>
            <NavbarContainer
              tools={tools}
              createMenuIsOpen={createMenuIsOpen}
              onCreateButtonClick={handleCreateButtonClick}
              onToggleMenu={handleToggleMenu}
              onSwitchTool={handleSwitchTool}
              searchIsOpen={searchIsOpen}
              onUserLogout={handleUserLogout}
              onSearchOpen={handleSearchOpen}
              onSearchClose={handleSearchClose}
            />
          </div>

          <div className={styles.sideMenuContainer}>
            {user && (
              <SideMenu
                activeToolName={activeToolName}
                isOpen={menuIsOpen}
                onClose={handleToggleMenu}
                onSignOut={handleUserLogout}
                onSwitchTool={handleSwitchTool}
                tools={props.tools}
                user={user}
              />
            )}
          </div>

          <div className={styles.mainArea}>
            <div className={styles.toolContainer}>
              <RouteScope scope={activeToolName}>
                <RenderTool tool={activeToolName} />
              </RouteScope>
            </div>

            <div className={styles.sidecarContainer}>
              <Sidecar />
            </div>
          </div>

          {createMenuIsOpen && (
            <ActionModal onClose={handleActionModalClose} actions={getNewDocumentModalActions()} />
          )}

          {absolutes.map((Abs, i) => (
            <Abs key={String(i)} />
          ))}
        </div>
      )}
    </SchemaErrorReporter>
  )
}
