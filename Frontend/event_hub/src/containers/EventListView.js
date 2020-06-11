import React from 'react';
import Events from '../components/Event';
import axios from 'axios';
import { Select, Menu, Spin } from 'antd';

class EventList extends React.Component{

    state = {
        events : [],
        images:[],
        type:"ALL",
        category:"ALL",
        loading:true
    }
    componentDidMount(){
        axios.post('http://127.0.0.1:8000/event/api/Events/search/',{
            user:1,
            search:'ahsan'
        })
        .then(res =>{console.log(res.data)});
        axios.get('http://127.0.0.1:8000/event/api/Events/get_events/')
        .then(res =>{
            this.setState({
                events: res.data.events,
                images: res.data.images,
                loading:false
            });
        })
        .catch();
    }
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
    }
    handleChange(value) {
        this.setState({
            category:value
        })
        let url;
        url='http://127.0.0.1:8000/event/api/Events/get_type_events/';
        axios.post(url,{
            type:this.state.type,
            category:value
        })
        .then(res =>{
            this.setState({
                events: res.data.events,
                images: res.data.images,
                });
        })
        .catch();
    }
    handleChange2(value){
        this.setState({
            type:value
        });
        let url;
        url='http://127.0.0.1:8000/event/api/Events/get_type_events/';
        axios.post(url,{
            type:value,
            category:this.state.category
        })
        .then(res =>{
            this.setState({
                events: res.data.events,
                images: res.data.images,
                });
        })
        .catch();
    }
    render (){      
        const { Option } = Select;
        return (
            <div>
              { this.state.loading? 
              <Spin size='large'/>
              :
        <div style={{ background: '#fff'}}>
            <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{ lineHeight: '64px'}}
                    >
                    <Menu.Item key="1" onClick={()=>this.handleChange2("ALL")}>ALL</Menu.Item>
                    <Menu.Item key="2" onClick={()=>this.handleChange2("FREE")}>Free Events</Menu.Item>
                    <Menu.Item key="3" onClick={()=>this.handleChange2("HAPPENING TODAY")}>Happening Today</Menu.Item>
                    <Menu.Item key="4" onClick={()=>this.handleChange2("WEEK")}>This Week</Menu.Item>
                    
                    </Menu>
            <div>
                <Select defaultValue="ALL" style={{ width: 120 }} onChange={this.handleChange}>
                    <Option value="ALL">ALL</Option>
                    <Option value="Educational">Educational</Option>
                    <Option value="Entertainment">Entertainment</Option>
                    <Option value="Gaming">Gaming</Option>
                    <Option value="Programming">Programming</Option>
                    <Option value="Cultural">Cultural</Option>
                </Select>
            </div>
            <Events data={this.state.events} images={this.state.images}/>
        </div>
    }</div>
        );
    }
}

export default EventList;