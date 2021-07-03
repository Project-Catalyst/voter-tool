export default function getBrowserCountry(options = {}) {
  const defaultOptions = { countryCodeOnly: true }

  const opt = { ...defaultOptions, ...options }

  const navigatorLocale =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language

  if (!navigatorLocale) {
    return undefined
  }

  const trimmedLocale = opt.countryCodeOnly
    ? navigatorLocale.trim().split(/-|_/)[1]
    : navigatorLocale.trim()

  return trimmedLocale
}
