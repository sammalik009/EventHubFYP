import React from 'react';
import Notifications from '../components/Notifications';
import axios from 'axios';
import {Spin} from 'antd';
class NotificationList extends React.Component{
    state = {
        notifications : [],
        unread: null,
        loading:true
    }
    componentDidMount(){
        axios.post('http://127.0.0.1:8000/notification/api/Notifications/get_notifications/',{
            user:parseInt(localStorage.getItem("user"))
        })
        .then(res =>{
            this.setState({
                notifications: res.data.notifications,
                unread: res.data.unread,
                loading:false
            });
        })
        .catch();
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
            <div style={{ background: '#fff', padding: 24 }}>
                <Notifications data={this.state.notifications}/>
            </div>}</div>
        );
    }
}

export default NotificationList;