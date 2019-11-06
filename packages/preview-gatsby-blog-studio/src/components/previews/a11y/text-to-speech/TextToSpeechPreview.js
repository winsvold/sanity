import React from 'react'
import PropTypes from 'prop-types'
import DefaultSelect from 'part:@sanity/components/selects/default'
import DefaultButton from 'part:@sanity/components/buttons/default'
import {blocksToText} from '../../../../utils'
import styles from './TextToSpeechPreview.css'

let speechSynth = null

if ('speechSynthesis' in window) {
  speechSynth = window.speechSynthesis
}

const getFieldItems = fields => {
  return fields.map(field => ({title: field}))
}

// eslint-disable-next-line react/require-optimization
class TextToSpeechPreview extends React.Component {
  static propTypes = {
    document: PropTypes.object,
    options: PropTypes.shape({
      fields: PropTypes.array.isRequired,
      rate: PropTypes.number,
      pitch: PropTypes.number,
      lang: PropTypes.string
    })
  }

  static defaultProps = {
    document: {},
    options: {
      lang: 'en-US',
      rate: 1,
      pitch: 1
    }
  }

  fieldItems = getFieldItems(this.props.options.fields)

  state = {
    activeField: this.fieldItems[0]
  }

  textToSpeak() {
    const {activeField} = this.state
    const {document} = this.props
    return typeof document[activeField.title] === 'string'
      ? document[activeField.title]
      : blocksToText(document[activeField.title])
  }

  handleFieldChange = field => {
    speechSynth.cancel()
    this.setState({activeField: field})
  }

  handleStartSpeaking = () => {
    const {options} = this.props
    const utterance = new SpeechSynthesisUtterance(this.textToSpeak())
    utterance.pitch = options.pitch
    utterance.rate = options.rate
    utterance.lang = options.lang
    speechSynth.speak(utterance)
  }

  handleStopSpeaking = () => {
    speechSynth.cancel()
  }

  componentDidUpdate() {
    if (speechSynth.speaking) {
      this.handleStopSpeaking()
      this.handleStartSpeaking()
    }
  }

  componentWillUnmount() {
    this.handleStopSpeaking()
  }

  render() {
    const {activeField} = this.state
    const {options} = this.props

    if (!speechSynth) {
      return (
        <div className={styles.wrapper}>
          Unfortunately your browser does not support the Web Speech API.
        </div>
      )
    }

    if (options.fields) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.selectionWrapper}>
            <DefaultSelect
              items={this.fieldItems}
              value={activeField}
              onChange={this.handleFieldChange}
            />
            <DefaultButton color="primary" onClick={() => this.handleStartSpeaking()}>
              Play
            </DefaultButton>
            <DefaultButton color="danger" onClick={() => this.handleStopSpeaking()}>
              Stop
            </DefaultButton>
          </div>
          <h3 className={styles.transcriptHeading}>Transcript</h3>
          <p className={styles.transcriptBody}>{this.textToSpeak()}</p>
        </div>
      )
    }
    return (
      <div className={styles.wrapper}>
        No fields found. Please specify which document fields in the <code>options</code> prop you
        want to preview with Text-to-Speech.
      </div>
    )
  }
}

export default TextToSpeechPreview
