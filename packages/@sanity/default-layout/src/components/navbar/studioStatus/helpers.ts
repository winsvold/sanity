import {Package, Severity} from './types'

const levels: Array<Severity> = ['notice', 'low', 'medium', 'high']

export function getHighestLevel(outdated: Package[]): Severity {
  const levelIndex = outdated.reduce((acc, pkg) => {
    return Math.max(acc, levels.indexOf(pkg.severity))
  }, 0)

  return levels[levelIndex]
}
