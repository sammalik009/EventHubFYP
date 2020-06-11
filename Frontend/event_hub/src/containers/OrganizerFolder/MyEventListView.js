import React from 'react';
import Events from '../components/Event';
import axios from 'axios';
import { Select, Spin } from 'antd';


class MyEventList extends React.Component{
    state = {
        events : [],
        images: [],
        loading:true
    }
    componentDidMount(){
        axios.post('http://127.0.0.1:8000/user/api/Users/get_user_events/',{
            user : parseInt(localStorage.getItem('user'))
        })
        .then(res =>{
            this.setState({
                events: res.data.events,
                images: res.data.images,
                type:"All",
                loading: false
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
                axios.post('http://127.0.0.1:8000/user/api/Users/get_user_events/',{
                    user : parseInt(localStorage.getItem('user'))
                })
                .then(res =>{
                    this.setState({
                        events: res.data.events,
                        images: res.data.images,
                     });
                })
                .catch();
                break;
            default:
                url='http://127.0.0.1:8000/user/api/Users/get_user_events_category/';
                axios.post(url,{
                    category:value,
                    user:parseInt(localStorage.getItem('user'))
                })
                .then(res =>{
                    this.setState({
                        events: res.data.events,
                        images: res.data.images,
                    });
                })
                .catch();
        }
      }
      /*componentDidMount(){
        axios.post('http://127.0.0.1:8000/event/api/Registrations/get_registered_events/',{
          user : 2
      })
      .then(res =>{
          this.setState({
              events: res.data
          });
      })
      .catch();
      }*/

    render (){
        if(localStorage.getItem("token")){
            if(localStorage.getItem("is_organizer")==="false"){
              window.location.href="/organizerForm/";
            }
        }
        else{
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
                <Events data={this.state.events} images={this.state.images}/>
            </div>
    }</div>
        );
    }
}

export default MyEventList;