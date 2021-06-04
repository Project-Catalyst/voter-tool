import axios from 'axios';

export default {
  challenges(fund){
    return axios.get(`data/${fund}/challenges.json`, { responseType: 'json' })
  },
  proposals(fund, challenge){
    return axios.get(`data/${fund}/${challenge}/proposals.json`)
  },
  proposal(fund, challenge, id){
    return axios.get(`data/${fund}/${challenge}/proposals/${id}.json`)
  }
}
