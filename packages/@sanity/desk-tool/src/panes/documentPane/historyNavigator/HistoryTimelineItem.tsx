/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from 'react'
import {from, Subscription} from 'rxjs'
import HistoryListItem from 'part:@sanity/components/history/list-item'
import userStore from 'part:@sanity/base/user'
import {format, isYesterday, isToday} from 'date-fns'
import {PaneRouterContext} from '../../../contexts/PaneRouterContext'
import {HistoryEventType} from './types'

interface Props extends HistoryEventType {
  isCurrentVersion: boolean
  isSelected: boolean
  onClick: () => void
  onSelectNext: () => void
  onSelectPrev: () => void
}

const EMPTY_PARAMS = {}
const dateFormat = 'MMM D, YYYY, hh:mm A'

function getDateString(date) {
  if (isToday(date)) {
    return `Today, ${format(date, 'hh:mm A')}`
  }
  if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'hh:mm A')}`
  }
  return format(date, dateFormat)
}

function getHumanReadableStatus(type) {
  if (type === 'discardDraft') return 'Discarded Edits'
  if (type === 'truncated') return 'Truncated Events'
  if (type === 'unknown') return 'Edited'
  return type
}

export default class HistoryTimelineItem extends React.PureComponent<Props> {
  static contextType = PaneRouterContext

  static defaultProps = {
    isSelected: false,
    userIds: undefined
  }

  usersSubscription: Subscription | null = null

  componentDidMount() {
    const {userIds} = this.props
    if (!userIds) {
      return
    }

    this.usersSubscription = from(userStore.getUsers(userIds)).subscribe(users => {
      this.setState({users})
    })
  }

  componentWillUnmount() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe()
    }
  }

  handleEnterKey = () => {
    this.props.onClick()
  }

  handleArrowDownKey = () => {
    this.props.onSelectNext()
  }

  handleArrowUpKey = () => {
    this.props.onSelectPrev()
  }

  state = {users: []}

  render() {
    const {ParameterizedLink, params} = this.context
    const {type, endTime, isSelected, isCurrentVersion, rev, onClick} = this.props
    const {users} = this.state

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {rev: oldRev, ...linkParams} = params

    return (
      <HistoryListItem
        linkComponent={ParameterizedLink}
        linkParams={Object.keys(linkParams).length === 0 ? EMPTY_PARAMS : linkParams}
        isCurrentVersion={isCurrentVersion}
        status={getHumanReadableStatus(type)}
        type={type}
        title={getDateString(endTime)}
        tooltip={format(endTime, dateFormat)}
        rev={rev}
        users={users}
        onSelect={onClick}
        onEnterKey={this.handleEnterKey}
        onArrowUpKey={this.handleArrowUpKey}
        onArrowDownKey={this.handleArrowDownKey}
        isSelected={isSelected}
      />
    )
  }
}
