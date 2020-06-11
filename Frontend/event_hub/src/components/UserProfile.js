import React from 'react';
import axios from 'axios';
import {
    Button,Spin
  } from 'antd';
import Events2 from './Events2';
export default class UserProfile extends React.Component{
    state= {
        events : [],
        feedback : [],
        organizer : undefined,
        user : undefined,
        ratio : undefined,
        loading : true,
        request : undefined,
        images : []
    }
    componentDidMount(){
      const uID = this.props.match.params.uID;
      axios.post('http://127.0.0.1:8000/user/api/Users/get_complete_user_data/',{
          user : uID,
          user2 : parseInt(localStorage.getItem('user')),
      })
      .then(res=>{
        console.log(res.data);  
        this.setState({
            loading : false,
            events : res.data.events,
            feedback : res.data.feedback,
            organizer : res.data.organizer,
            user : res.data.user,
            ratio : res.data.ratio,
            request : res.data.request,
            images : res.data.images
          })
      })
  }
  handleApprove = ()=>{
        const uID = this.props.match.params.uID;
        axios.post('http://127.0.0.1:8000/user/api/OrganizerRequests/approve_request/',{
          id : uID
      })
      .then(res =>{})
      .catch();
      window.location.reload(false);
  }    
    handleDisapprove = ()=>{
        const uID = this.props.match.params.uID;
        axios.post('http://127.0.0.1:8000/user/api/OrganizerRequests/disapprove_request/',{
          id : uID
        })
        .then(res =>{})
        .catch();
        window.location.reload(false);
    }
    render (){
    //if(!localStorage.getItem("token")){
    //  window.location.href="/login/";
    //}
    return (
        <div>
        { this.state.loading ===true ?
            <Spin size="large" />
            :
        <div>
            {
                localStorage.getItem("is_admin") === "true" && this.state.request !== undefined ?
                <div>
                    <Button type="primary" htmlType="submit" style={{marginRight: 8,}} onClick={this.handleApprove}>
                        APPROVE
                    </Button>
                    <Button type="danger" htmlType="submit" onClick={this.handleDisapprove}>
                        DISAPPROVE
                    </Button>
                </div>
                :
                <span/>
            }
            <h3><b>Name :  </b>{this.state.user.username}</h3><br/>
            <b>Email :  </b>{this.state.user.email}<br/><br/>
            <b>Position :  </b>{this.state.user.is_admin===true?
            <i>ADMIN</i>:<div>{this.state.user.is_organizer===true?<i>ORGANIZER</i>:<i>USER</i>}</div>}<br/>
            <b>Attending Ratio : </b>{this.state.ratio}%<br/><br/>
            {
                this.state.user.is_organizer===true ?
                <div>
                    <b>Phone Number :  </b>{this.state.organizer.phone_number}<br/><br/>
                    <Events2 data={this.state.events} feedback={this.state.feedback} images={this.state.images}/>
                </div>
                :
                <span/>
            }
            </div>
        }
        </div>
    );
  }
}
