import React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { NotifyOnChangeProps } from '@tanstack/react-query'

export function useFocusNotifyOnChangeProps(
  notifyOnChangeProps?: NotifyOnChangeProps,
) {
  const focusedRef = React.useRef(true)

  useFocusEffect(
    React.useCallback(() => {
      focusedRef.current = true
      console.log('im focused')

      return () => {
        console.log('im not focused')
        focusedRef.current = false
      }
    }, []),
  )


  return () => {
    if (!focusedRef.current) {
      return []
    }

    if (typeof notifyOnChangeProps === 'function') {
      return notifyOnChangeProps()
    }

    return notifyOnChangeProps
  }
}
