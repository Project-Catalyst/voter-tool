import Vue from 'vue'
import VueI18n from 'vue-i18n'
import getBrowserLocale from '../utils/get-browser-locale'
import supportedLocales from '../locales/locales'

function getStartingLocale() {
  const browserLocale = getBrowserLocale({ countryCodeOnly: true })

  if (Object.keys(supportedLocales).includes(browserLocale)) {
    return browserLocale
  } else {
    return 'en'
  }
}

Vue.use(VueI18n)

import messages from '../locales/messages/index.js'
import numberFormats from '../locales/numbers/index.js'

let startingLocale = getStartingLocale()

export const i18n = new VueI18n({
  locale: startingLocale,
  messages, // set locale messages
  numberFormats
})
