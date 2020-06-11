import React from 'react';
import Requests from '../components/Request';
import axios from 'axios';
import { Select, Spin } from 'antd';

class UserRequests extends React.Component{

    state = {
        events : [],
        loading: true
    }
    componentDidMount(){
        axios.post('http://127.0.0.1:8000/user/api/Requests/get_user_requests/',{
            user:parseInt(localStorage.getItem('user'))
        })
        .then(res =>{
            this.setState({
                requests: res.data,
                loading : false
            });
        })
        .catch();
    }
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(value) {
        let url;
        switch(value){
            case "ALL":
                url='http://127.0.0.1:8000/user/api/Requests/get_user_requests/';
                axios.post(url,{
                    user:parseInt(localStorage.getItem('user'))
                })
                .then(res =>{
                    this.setState({
                        requests: res.data
                    });
                })
                .catch();
                break;
            default:
                url='http://127.0.0.1:8000/user/api/Requests/get_user_requests_type/';
                axios.post(url,{
                    user:parseInt(localStorage.getItem('user')),
                    type:value
                })
                .then(res =>{
                    this.setState({
                        requests: res.data
                    });
                })
                .catch();
               }
    }
    render (){
        if(!localStorage.getItem("token")){
            window.location.href="/login/";
        }
        const { Option } = Select;
        return (
        <div>
            { this.state.loading? 
            <Spin size='large'/>
            :    
        <div>
            <div>
                <Select defaultValue="All" style={{ width: 120 }} onChange={this.handleChange}>
                <Option value="ALL">ALL</Option>
                <Option value="PENDING">PENDING</Option>
                <Option value="APPROVED">APPROVED</Option>
                <Option value="DISAPPROVED">DISAPPROVED</Option>
                </Select>
            </div>
            <Requests data={this.state.requests}/>
        </div>
    }</div>);
    }
}

export default UserRequests;