export function getErrorWithStack(err: {message: string; stack: string}): string {
  const stack = err.stack.toString()
  const message = err.message

  return stack.indexOf(message) === -1 ? `${message}\n\n${stack}` : stack
}

export function limitStackLength(stack: string): string {
  return stack
    .split('\n')
    .slice(0, 15)
    .join('\n')
}

export function formatStack(stack: string): string {
  return (
    stack
      // Prettify builder functions
      .replace(/\(\.\.\.\)\./g, '(...)\n  .')
      // Remove webpack cruft from function names
      .replace(/__WEBPACK_IMPORTED_MODULE_\d+_+/g, '')
      // Remove default export postfix from function names
      .replace(/___default\./g, '.')
      // Replace full host path, leave only path to JS-file
      .replace(new RegExp(` \\(https?:\\/\\/${window.location.host}`, 'g'), ' (')
  )
}
