import axios from 'axios';

export default {
  share(data){
    return axios.post(
      `api/picklist`,
      data,
      { baseURL: 'https://api.voter-tool.ze.lc/' }
    )
  },
  edit(id){
    return axios.put(`api/picklist/${id}`, { baseURL: 'https://api.voter-tool.ze.lc/' })
  },
  shared(id){
    return axios.get(`api/picklist/${id}`, { baseURL: 'https://api.voter-tool.ze.lc/' })
  }
}
