import axios from 'axios';
import { i18n } from '@/plugins/i18n';

// 'en' is the base path
const fundsTranslations = {
  'f4': [],
  'f5': ['it'],
  'f6': [],
}

const getLocalizedPath = (fund) => {
  let localizedFund = fund
  if (fundsTranslations[fund].includes(i18n.locale)) {
    localizedFund = `${fund}/${i18n.locale}`
  }
  return localizedFund
}

export default {
  challenges(fund){
    const localizedPath = getLocalizedPath(fund)
    return axios.get(`data/${localizedPath}/challenges.json`, { responseType: 'json' })
  },
  proposals(fund, challenge){
    const localizedPath = getLocalizedPath(fund)
    return axios.get(`data/${localizedPath}/${challenge}/proposals.json`)
  },
  proposal(fund, challenge, id){
    const localizedPath = getLocalizedPath(fund)
    return axios.get(`data/${localizedPath}/${challenge}/proposals/${id}.json`)
  }
}
