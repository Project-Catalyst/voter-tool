import axios from 'axios';

export default {
  share(data){
    return axios.post(
      `api/picklist`,
      data,
      { baseURL: 'http://voter-tool-api' }
    )
  },
  edit(id){
    return axios.put(`api/picklist/${id}`, { baseURL: 'http://voter-tool-api' })
  },
  shared(id){
    return axios.get(`api/picklist/${id}`, { baseURL: 'http://voter-tool-api' })
  }
}
