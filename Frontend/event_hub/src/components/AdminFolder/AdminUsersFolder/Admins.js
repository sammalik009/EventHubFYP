import React from 'react';
import axios from 'axios';
import {
    Table,
    Spin
  } from 'antd';
class Admins extends React.Component{
    state = {
        users :[],
        registered : [],
        attended : [],
        ratio : [],
        data:[],
        organized : [],
        sold : [],
        rating : [],
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
        title: 'Registered',
        dataIndex: 'registered',
        key: 'registered',
      },
      {
        title: 'Attended',
        dataIndex: 'attended',
        key: 'attended',
      },
      {
        title: 'Ratio',
        dataIndex: 'ratio',
        key: 'ratio',
      },
      {
        title: 'Organized',
        dataIndex: 'organized',
        key: 'organized',
      },
      {
        title: 'Sold %',
        dataIndex: 'sold',
        key: 'sold',
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating',
      },
    ]
      componentDidMount(){
        axios.get('http://127.0.0.1:8000/user/api/Users/get_admins/')
        .then(res =>{
          this.setState({
            users :res.data.users,
            registered : res.data.registered,
            attended : res.data.attended,
            ratio : res.data.ratios,
            organized : res.data.organized,
            sold : res.data.sold,
            rating : res.data.rating
          });
          console.log(res.data);
          let data = []
          for(let i=0;i<res.data.users.length;i++){
            data.push({
                key : i,
                id : res.data.users[i].id,
                name : res.data.users[i].username,
                email : res.data.users[i].email,
                registered : res.data.registered[i],
                attended : res.data.attended[i],
                ratio : res.data.ratios[i],
                organized : res.data.organized[i],
                sold : res.data.sold[i],
                rating : res.data.rating[i]
            });
          }
          this.setState({
              data:data,
              loading: false
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
              <h3>Admins</h3>
            <Table columns={this.columns_users} dataSource={this.state.data} rowKey="id" onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  if(parseInt(localStorage.getItem('user')) === this.state.users[rowIndex].id){
                    window.location.href = `/profile/${this.state.users[rowIndex].id}/`;
                  }
                  else{
                    window.location.href = `/user_profile/${this.state.users[rowIndex].id}/`;  
                  }
                },
              };
            }}/>
              </div>
              :
              <h1>No Admins Yet</h1>
          }
            
          </div>
      }</div>
        );
      }
    }
export default Admins;
