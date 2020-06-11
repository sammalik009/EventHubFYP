import React from 'react';
import axios from 'axios';
import {
    Table,
    Spin
  } from 'antd';
class AdminUsers extends React.Component{
  state = {
    users :[],
    registered : [],
    attended : [],
    ratio : [],
    data:[],
    loading : true
}
columns_users = [
  {
    title: 'User ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Registered Events',
    dataIndex: 'registered_events',
    key: 'registered_events',
  },
  {
    title: 'Attended Events',
    dataIndex: 'attended_events',
    key: 'attended_events',
  },
  {
    title: 'Ratio',
    dataIndex: 'ratio',
    key: 'ratio',
  },
]
  componentDidMount(){
    axios.get('http://127.0.0.1:8000/user/api/Users/get_admin_users/')
    .then(res =>{
      this.setState({
        users :res.data.users,
        registered : res.data.registered,
        attended : res.data.attended,
        ratio : res.data.ratios
      });
      let data = []
      for(let i=0;i<res.data.users.length;i++){
        data.push({
            key : i,
            id : res.data.users[i].id,
            name : res.data.users[i].username,
            email : res.data.users[i].email,
            registered_events : res.data.registered[i],
            attended_events : res.data.attended[i],
            ratio : res.data.ratios[i]
        });
      }
      this.setState({
          data:data,
          loading : false
      });
    })
    .catch();
  }
  render (){
    return (
      
      <div>
      { this.state.loading? 
      <Spin size='large'/>
      :
      <div style={{ background: '#fff', padding: 24 }}>
                  { this.state.users.length>0?
        <div>
          <h3>Users</h3>
        <Table columns={this.columns_users} dataSource={this.state.data} rowKey="id" onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  if(parseInt(localStorage.getItem('user')) === this.state.users[rowIndex].id){
                    window.location.href = `/profile/`;
                  }
                  else{
                    window.location.href = `/user_profile/${this.state.users[rowIndex].id}/`;  
                  }
                },
              };
            }}/>
          </div>
          :
          <h1>No Users Yet</h1>
      }
        
      </div>
  }</div>
    );
  }
}
export default AdminUsers;
