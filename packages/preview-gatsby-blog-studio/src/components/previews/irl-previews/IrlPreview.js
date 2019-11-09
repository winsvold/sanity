import React from 'react'
import PropTypes from 'prop-types'
import Moveable from 'react-moveable'
import RadioButtons from 'part:@sanity/components/selects/radio'
import styles from './IrlPreview.css'

const EDIT_MODES = [
  {title: 'Resize', name: 'resizable'},
  {title: 'Scale', name: 'scalable'},
  {title: 'Warp', name: 'warpable'}
]

const IMG_FILTERS = [
  {title: 'Hudson', name: 'hudson'},
  {title: 'Brooklyn', name: 'brooklyn'},
  {title: 'Amaro', name: 'amaro'},
  {title: 'Gingham', name: 'gingham'}
]

class IrlPreview extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      bannerTarget: null,
      editMode: EDIT_MODES[0],
      imgFilter: IMG_FILTERS[0],
      isEditMode: false
    }
    this.previewBanner = React.createRef()
    this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    this.scale = [1, 1]
  }

  static propTypes = {
    position: PropTypes.string,
    previewImage: PropTypes.string.isRequired,
    document: PropTypes.object,
    children: PropTypes.node
  }

  static defaultProps = {
    document: null,
    position: ''
  }

  handleEditModeChange = item => {
    this.setState({
      editMode: item
    })
  }

  handleImgFilterChange = item => {
    this.setState({
      imgFilter: item
    })
  }

  handleShowEditMode = () => {
    this.setState({
      isEditMode: true
    })
  }

  handleHideEditMode = () => {
    this.setState({
      isEditMode: false
    })
  }

  componentDidMount() {
    this.setState({
      bannerTarget: this.previewBanner.current
    })
    this.previewBanner.current.setAttribute('style', this.props.position)
  }

  render() {
    const {document, previewImage, children} = this.props
    const {bannerTarget, editMode, isEditMode, imgFilter} = this.state
    return (
      <div className={styles.componentWrapper}>
        <div className={styles.radioWrapper}>
          <label>Filter</label>
          <RadioButtons
            value={imgFilter}
            items={IMG_FILTERS}
            onChange={this.handleImgFilterChange}
          />
        </div>
        <div className={styles.radioWrapper}>
          <label>Edit mode</label>
          <RadioButtons value={editMode} items={EDIT_MODES} onChange={this.handleEditModeChange} />
        </div>
        <div
          className={`${styles.previewWrapper} ${styles.filter} ${styles[imgFilter.name]}`}
          onMouseEnter={this.handleShowEditMode}
          onMouseLeave={this.handleHideEditMode}
        >
          <img className={styles.backgroundImage} src={previewImage} />
          {bannerTarget && isEditMode && (
            <Moveable
              target={bannerTarget}
              draggable
              resizable={editMode.name === 'resizable'}
              warpable={editMode.name === 'warpable'}
              scalable={editMode.name === 'scalable'}
              keepRatio
              onWarp={({target, multiply, delta}) => {
                this.matrix = multiply(this.matrix, delta)
                target.style.transform = `scale(${this.scale[0]},${
                  this.scale[1]
                }) matrix3d(${this.matrix.join(',')})`
              }}
              onDrag={({target, left, top, beforeDelta}) => {
                target.style.left = `${left}px`
                target.style.top = `${top}px`
              }}
              onResize={({target, width, height, dist}) => {
                target.style.width = `${width}px`
                target.style.height = `${height}px`
              }}
              onScale={({target, delta}) => {
                const scale = this.scale
                scale[0] *= delta[0]
                scale[1] *= delta[1]
                target.style.transform = `scale(${scale[0]}, ${
                  scale[1]
                }) matrix3d(${this.matrix.join(',')})`
              }}
            />
          )}
          <div ref={this.previewBanner} className={styles.banner}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}

export default IrlPreview
