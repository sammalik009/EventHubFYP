import React from 'react';
import axios from 'axios';
import {
    Form,
    Input,
    Icon,
    Cascader,
    InputNumber,
    DatePicker,
    Button,
  } from 'antd';  
const residences = [
  {
    value: 'Entertainment',
    label: 'Entertainment',
  },
  {
    value: 'Educational',
    label: 'Educational',
  },
  {
    value: 'Gaming',
    label: 'Gaming',
  },
  {
    value: 'Programming',
    label: 'Programming',
  },
  {
    value: 'Cultural',
    label: 'Cultural',
  },
];
class EventForm extends React.Component {
  state={
    images: null,
    event:null,
  }
  handleImageChange = (e) => {
    this.setState({
      images: e.target.files
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let list=[];
        for(let i=0;i<this.state.images.length;i++){
          if(this.state.images[i].size / 1024 / 1024 < 2){
            list.push(this.state.images[i]);
          }
        }
        this.setState({
          images:list
        })
        console.log(values);
        let formData = new FormData();
        formData.append('title',values.title);
        formData.append('event_date',values.event_date);
        formData.append('venue',values.venue);
        formData.append('total_tickets',values.total_tickets);
        formData.append('price_ticket',values.price_ticket);
        formData.append('category',values.category);
        formData.append('limit_for_tickets',values.limit_for_tickets);
        formData.append('sold_tickets',values.sold_tickets);
        formData.append('description',values.description);
        formData.append('status',"REQUESTED");
        formData.append('user',parseInt(localStorage.getItem("user")));
        if(values.event_date>new Date()){
          axios.post('http://127.0.0.1:8000/event/api/Events/add_event/',{
            title :values.title,
            event_date : values.event_date,
            venue :values.venue,
            total_tickets :values.total_tickets,
            price_ticket :values.price_ticket,
            category : values.category,
            limit_for_tickets :values.limit_for_tickets,
            sold_tickets :values.sold_tickets,
            description :values.description,
            status:"REQUESTED",
            user : parseInt(localStorage.getItem("user"))
          })
          .then(res =>{
            console.log(res.data);
            if(res.data.status && res.data.status==="Not OK"){
              console.log("Do Nothing");
            }
            else{
              for(let i=0;i<this.state.images.length;i++){
                let formData = new FormData();
                formData.append('image',this.state.images[i],this.state.images[i].name);
                formData.append('event',res.data.event);
                axios.post('http://127.0.0.1:8000/event/api/Images/add_images/', formData,{
                  headers:{
                    'content-type':'multipart/form-data'
                  }
                }).then(res=>{
                    window.location.reload(false);
                })
              }
            }
          })
          .catch();
        }
        else{
          console.log("Please Select valid date");
        }
      }
    });
  };
  render() {
    if(localStorage.getItem("token")){
      if(localStorage.getItem("is_organizer")==="false"){
        window.location.href="/organizerForm/";
      }
    }
    else{
      window.location.href="/login/";
    }
    const { getFieldDecorator } = this.props.form;
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };
    return (
      <Form onSubmit={this.handleSubmit} style={{ background: '#fff', padding: 24 }}>
        <Form.Item label="Title">
          {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input title!' }],
          })(<Input
              prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Title"/>,
          )}
        </Form.Item>
        <Form.Item label="Venue">
          {getFieldDecorator('venue', {
              rules: [{ required: true, message: 'Please input venue!' }],
          })(<Input
              prefix={<Icon type="bank" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Title"/>,
          )}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('description', {
              rules: [{ required: true, message: 'Please input description!' }],
          })(<Input
              prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Description"/>,
          )}
        </Form.Item>
        <Form.Item label="Category">
          {getFieldDecorator('category', {
            rules: [{ type: 'array', required: true, message: 'Please select category!' }],
          })(<Cascader options={residences} />)}
        </Form.Item>
        <Form.Item label="Event Date">
          {getFieldDecorator('event_date', config)(<DatePicker format="YYYY-MM-DD"/>)}
        </Form.Item>
        <Form.Item label="Total Tickets">
          {getFieldDecorator('total_tickets', { initialValue: 1,
            rules: [{ required: true, message: 'Please input Total Tickets!' }],
          })(<InputNumber min={1} max={10000} />)}
        </Form.Item>
        <Form.Item label="Price of Ticket">
          {getFieldDecorator('price_ticket', { initialValue: 0,
            rules: [{ required: true, message: 'Please input price!' }],
          })(<InputNumber min={0} max={1000} />)}
        </Form.Item>
        <Form.Item label="Limit Of Tickets">
          {getFieldDecorator('limit_for_tickets', { 
            rules: [{ required: false }],
          })(<InputNumber min={1} max={10000} />)}
        </Form.Item>
        <Form.Item>
          <input type="file"
            id="image"
            accept="image/png, image/jpeg"
            multiple={true}  onChange={this.handleImageChange} required placeholder="Upload Images"/>
          <b>Note: </b>Images must be of less than 2MB each. Otherwise they will be deleted automatically.
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
  
const WrappedRegistrationForm = Form.create()(EventForm);
export default WrappedRegistrationForm;
