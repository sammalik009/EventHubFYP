import React from 'react';
import Requests from '../components/Request';
import OrganizerRequests from '../components/OrganizerRequest';
import axios from 'axios';
import { Select, Menu, Spin } from 'antd';

class RequestList extends React.Component{

    state = {
        requests : [],
        type: 'EVENT',
        loading:true
    }
    componentDidMount(){
        let url;
        url='http://127.0.0.1:8000/user/api/Requests/get_requests/';
        axios.post(url,{
            user : parseInt(localStorage.getItem('user'))
        })
        .then(res =>{
            this.setState({
                requests: res.data,
                loading:false
            });
        })
        .catch();
    }
    handleChange2(value){
        this.setState({
            type:value
        });
        let url;
        switch(value){
            case "EVENT":
                url='http://127.0.0.1:8000/user/api/Requests/get_requests/';
                axios.post(url,{
                    user : parseInt(localStorage.getItem('user'))
                })
                .then(res =>{
                    this.setState({
                        requests: res.data
                    });
                })
                .catch();
                break;
            case "ORGANIZER":
                url='http://127.0.0.1:8000/user/api/OrganizerRequests/get_requests/';
                axios.get(url,)
                .then(res =>{
                    this.setState({
                        requests: res.data,
                    });
                })
                .catch();
                break;
            default:
                url='http://127.0.0.1:8000/user/api/Requests/get_requests/';
                axios.post(url,{
                    user : parseInt(localStorage.getItem('user'))
                })
                .then(res =>{
                    this.setState({
                        requests: res.data
                    });
                })
                .catch();
        }
    }
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
    }
    handleChange(value) {
        let url;
        switch(value){
            case "ALL":
                url='http://127.0.0.1:8000/user/api/Requests/get_requests/';
                axios.post(url,{
                    user : parseInt(localStorage.getItem('user'))
                })
                .then(res =>{
                    this.setState({
                        requests: res.data
                    });
                })
                .catch();
                break;
            default:
                url='http://127.0.0.1:8000/user/api/Requests/get_requests_type/';
                axios.post(url,{
                    type:value,
                    user : parseInt(localStorage.getItem('user'))
                })
                .then(res =>{
                    this.setState({
                        requests: res.data
                    });
                })
                .catch();
               }
    }
    handleChange3(value) {
        let url;
        switch(value){
            case "ALL":
                url='http://127.0.0.1:8000/user/api/OrganizerRequests/get_requests/';
                axios.post(url,{
                    user : parseInt(localStorage.getItem('user'))
                })
                .then(res =>{
                    this.setState({
                        requests: res.data
                    });
                })
                .catch();
                break;
            default:
                url='http://127.0.0.1:8000/user/api/OrganizerRequests/get_requests_type/';
                axios.post(url,{
                    type:value,
                    user : parseInt(localStorage.getItem('user'))
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
        <div style={{ background: '#fff', padding: 24 }}>
            <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{ lineHeight: '64px'}}
                    >
                    <Menu.Item key="1" onClick={()=>this.handleChange2("EVENT")}>Event Requests</Menu.Item>
                    <Menu.Item key="2" onClick={()=>this.handleChange2("ORGANIZER")}>Organizer Requests</Menu.Item>
                    </Menu>
            {
                this.state.type === "EVENT" ?
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
                :
                <div>
                <div>
                    <Select defaultValue="All" style={{ width: 120 }} onChange={this.handleChange3}>
                    <Option value="ALL">ALL</Option>
                    <Option value="PENDING">PENDING</Option>
                    <Option value="APPROVED">APPROVED</Option>
                    <Option value="DISAPPROVED">DISAPPROVED</Option>
                    </Select>
                </div>
                <OrganizerRequests data={this.state.requests}/>
            </div>
            }
        </div>}</div>);
    }
}

export default RequestList;