export interface Image {
  asset?: Asset
  hotspot: Hotspot
  crop: Crop
}

type Asset = {
  _ref: string
}

type Hotspot = {
  height: number
  width: number
  x: number
  y: number
}

type Crop = {
  bottom: number
  left: number
  right: number
  top: number
}

export interface ImagePreviewProps {
  asset: Asset | undefined
  color?: any
  action: 'changed' | 'added' | 'removed'
  hotspot?: Hotspot
  crop?: Crop
}
