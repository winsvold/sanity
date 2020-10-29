import React, {forwardRef, useState} from 'react'
import {Avatar, AvatarPosition, AvatarSize, AvatarStatus} from '@sanity/ui'
import {User} from '../datastores/user/types'
import {useUser, useUserColor} from '../hooks'

interface BaseProps {
  as?: React.ElementType | keyof JSX.IntrinsicElements
  position?: AvatarPosition
  animateArrowFrom?: AvatarPosition
  size?: AvatarSize
  status?: AvatarStatus
}

export type Props = BaseProps & UserProps

interface LoadedUserProps extends BaseProps {
  user: User
}

interface UnloadedUserProps extends BaseProps {
  userId: string
}

type UserProps = LoadedUserProps | UnloadedUserProps

function nameToInitials(fullName: string) {
  const namesArray = fullName.split(' ')

  if (namesArray.length === 1) {
    return `${namesArray[0].charAt(0)}`
  }

  return `${namesArray[0].charAt(0)}${namesArray[namesArray.length - 1].charAt(0)}`
}

export const UserAvatar = forwardRef((props: Props, ref) => {
  if (isLoaded(props)) {
    return <StaticUserAvatar {...props} ref={ref} />
  }

  return <UserAvatarLoader {...props} ref={ref} />
})
UserAvatar.displayName = 'UserAvatar'

const StaticUserAvatar = forwardRef(
  ({as, user, animateArrowFrom, position, ...restProps}: LoadedUserProps, ref) => {
    const [imageLoadError, setImageLoadError] = useState<null | Error>(null)
    const userColor = useUserColor(user.id)
    const imageUrl = imageLoadError ? undefined : user?.imageUrl

    return (
      <Avatar
        {...restProps}
        as={as as any}
        animateArrowFrom={animateArrowFrom}
        arrowPosition={position}
        color={userColor.name}
        initials={user?.displayName && nameToInitials(user.displayName)}
        onImageLoadError={setImageLoadError}
        ref={ref}
        src={imageUrl}
        title={user?.displayName}
      />
    )
  }
)
StaticUserAvatar.displayName = 'StaticUserAvatar'

const UserAvatarLoader = forwardRef(({userId, ...loadedProps}: UnloadedUserProps, ref) => {
  const {isLoading, error, value} = useUser(userId)

  if (isLoading || error || !value) {
    // @todo How do we handle this?
    return null
  }

  return <UserAvatar {...loadedProps} ref={ref} user={value} />
})
UserAvatarLoader.displayName = 'UserAvatarLoader'

function isLoaded(props: Props): props is LoadedUserProps {
  const loadedProps = props as LoadedUserProps

  return typeof loadedProps.user !== 'undefined' && typeof loadedProps.user.id === 'string'
}
