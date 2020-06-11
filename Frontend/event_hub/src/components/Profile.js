import React from 'react';
import axios from 'axios';
import {
    Button,Spin
  } from 'antd';
export default class Profile extends React.Component{
    state= {
        user:{},
        organizer:{},
        loading : true
    }
    componentDidMount(){
      axios.post('http://127.0.0.1:8000/user/api/Users/get_user/',{
          user:parseInt(localStorage.getItem('user'))
      })
      .then(res=>{
          this.setState({
            user:res.data.user,
            organizer:res.data.organizer,
            loading : false
          })
      })
  }
  render (){
    if(!localStorage.getItem("token")){
      window.location.href="/login/";
    }
    return (
      <div>
        { this.state.loading? 
        <Spin size='large'/>
        :
        <div>
            <h3><b>Name :  </b>{this.state.user.username}</h3><br/>
            <b>Email :  </b>{this.state.user.email}<br/><br/>
            <b>Is Organizer :  </b>{this.state.user.is_organizer===true?
                <i>YES</i>:<i>NO</i>
                }<br/><br/>
            <b>Is Admin :  </b>{this.state.user.is_admin===true?
                <i>YES</i>:<i>NO</i>
                }<br/><br/>
            {
                localStorage.getItem('is_organizer')==="true" ?
                <div>
                <b>Address :  </b>{this.state.organizer.address}<br/><br/>
                <b>Phone Number :  </b>{this.state.organizer.phone_number}<br/><br/>
                <b>CNIC :  </b>{this.state.organizer.cnic}<br/><br/>
                </div>
                :
                <div><Button><a href='/profile/organizerForm/'>Update To Organizer</a></Button></div>
            }
        </div>
  }</div>
    );
  }
}
