{
  /*
   * mediaQuery.js
   *
   * Reusable media query viewport
   *
   * Author: Dominic Domingo
   * Created: 12/12/2019
   *
   */
}

import { useMediaQuery } from 'react-responsive'

export const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 1200 })
  return isDesktop ? children : null
}
export const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 600, maxWidth: 1199 })
  return isTablet ? children : null
}
export const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 599 })
  return isMobile ? children : null
}
export const Portrait = ({ children }) => {
  const isPortrait = useMediaQuery({ orientation: 'portrait' })
  return isPortrait ? children : null
}
export const Landscape = ({ children }) => {
  const isLandscape = useMediaQuery({ orientation: 'landscape' })
  return isLandscape ? children : null
}
