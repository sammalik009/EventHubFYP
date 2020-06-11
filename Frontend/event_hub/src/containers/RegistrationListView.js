import React from 'react';
import Registrations from '../components/Registration';
import axios from 'axios';
import { Select, Spin } from 'antd';

class RegistrationList extends React.Component{

    state = {
        registrations : [],
        loading:true
    }
    
    componentDidMount(){
        axios.post('http://127.0.0.1:8000/event/api/Registrations/get_registrations/',{
            user:localStorage.getItem('user')
        })
        .then(res =>{
            this.setState({
                registrations: res.data,
                loading:false                
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
            case "All":
                url='http://127.0.0.1:8000/event/api/Registrations/get_registrations/';
                axios.post(url,{
                    user:localStorage.getItem('user')
                })
                .then(res =>{
                    this.setState({
                        registrations: res.data
                    });
                })
                .catch();
                        break;
            default:
                url='http://127.0.0.1:8000/event/api/Registrations/get_registrations_category/';
                axios.post(url,{
                    category:value,
                    user:localStorage.getItem('user')
                })
                .then(res =>{
                    this.setState({
                        registrations: res.data
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
                    <Option value="All">All</Option>
                    <Option value="Educational">Educational</Option>
                    <Option value="Entertainment">Entertainment</Option>
                    <Option value="Gaming">Gaming</Option>
                    <Option value="Programming">Programming</Option>
                    <Option value="Cultural">Cultural</Option>
                    </Select>
                </div>
                <Registrations data={this.state.registrations}/>
            </div>
    }</div>
        )
    }
}

export default RegistrationList;