interface ThemeFont {
  fontSize: string
  lineHeight: string
  letterSpacing: string
  transform: string
  marginTop: string
}

export interface Theme {
  bg1: string
  heading: ThemeFont[]
  text: ThemeFont[]
}
