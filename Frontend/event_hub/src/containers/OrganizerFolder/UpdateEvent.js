import React from 'react';
import axios from 'axios';
import {
    Form,
    Input,
    Icon,
    Cascader,
    DatePicker,
    Button,
    Spin
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
class UpdateEvent extends React.Component{
  state = {
    event : {},
    images2:[],
    comments:[],
    replies:[],
    loading:true
}
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(new Date(new Date(new Date(this.state.event.event_date).getTime()- (7*24*60*60*1000)))<new Date()){
          console.log("You can not update event");
        }
        else{
          const title=values.title!==undefined?values.title:this.state.event.title;
          const event_date=values.event_date!==undefined?values.event_date:this.state.event.event_date;
          const venue=values.venue!==undefined?values.venue:this.state.event.venue;
          const category=values.category!==undefined?values.category:[this.state.event.category];
          const description=values.description!==undefined?values.description:this.state.event.description;
          axios.post('http://127.0.0.1:8000/event/api/Events/update_event/',{
            title :title,
            event_date : event_date,
            venue :venue,
            total_tickets :this.state.event.total_tickets,
            price_ticket :this.state.event.price_ticket,
            category : category,
            limit_for_tickets :this.state.event.limit_for_tickets,
            sold_tickets :this.state.event.sold_tickets,
            description :description,
            event:this.props.match.params.eventID,
            user : localStorage.getItem("user")  
          })
          .then(res =>{
            window.location.reload(false);
          })
          .catch();
        }
      }
    });
  }
  handleDelete = e => {
    e.preventDefault();
    if(new Date(new Date(new Date(this.state.event.event_date).getTime()- (7*24*60*60*1000)))<new Date()){
      console.log("You can not delete event");
    }
    else{
      axios.post('http://127.0.0.1:8000/event/api/Events/delete_event/',{
        event:this.props.match.params.eventID,
        user : localStorage.getItem("user")  
      })
      .then(res =>{
          window.location.reload(false);
      })
      .catch();
    }
  } 
  componentDidMount(){
    const eventID = this.props.match.params.eventID;
      axios.post('http://127.0.0.1:8000/user/api/Users/get_user_event/',{
        event: eventID,
        user:parseInt(localStorage.getItem('user'))
      })
      .then(res =>{
        this.setState({
          event: res.data.event,
          images2:res.data.images,
          loading:false
        });
        if(res.data.event.user!==parseInt(localStorage.getItem('user'))){
          window.location.href= `/events/${this.props.match.params.eventID}`
        }
        axios.post(`http://127.0.0.1:8000/comment/api/Comments/get_comments/`,{
          event: eventID,
        })
        .then(res=>{
          this.setState({
            comments:res.data.comments,
            replies:res.data.replies});
        })
        .catch();
      })
    .catch();
  }
  render (){
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
      rules: [{ type: 'object', required: false, message: 'Please select time!' }],
    };
    return (
      <div>
        { this.state.loading? 
        <Spin size='large'/>
        :
      <div style={{ background: '#fff', padding: 24 }}>
        {
          new Date(new Date(new Date(this.state.event.event_date).getTime()- (7*24*60*60*1000)))<new Date() ?
          <div>
            <h1>Cannot be updated</h1>
          </div>
          :
          <div>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item label="Title">
              {getFieldDecorator('title', { initialValue: this.state.event.title,
                  rules: [{ required: false, message: 'Please input title!' }],
              })(
                  <Input
                  prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Title"
                  />,
              )}
              </Form.Item>
              <Form.Item label="Venue">
              {getFieldDecorator('venue', { initialValue: this.state.event.venue,
                  rules: [{ required: false, message: 'Please input venue!' }],
              })(
                  <Input
                  prefix={<Icon type="bank" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Venue"
                  />,
              )}
              </Form.Item>
              <Form.Item label="Description">
              {getFieldDecorator('description', { initialValue: this.state.event.description,
                  rules: [{ required: false, message: 'Please input description!' }],
              })(
                  <Input
                  prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Description"
                  />,
              )}
              </Form.Item>
              <Form.Item label="Category">
                {getFieldDecorator('category', {
                  rules: [
                    { type: 'array', required: false, message: 'Please select category!' },
                  ],
                })(<Cascader options={residences} />)}
              </Form.Item>
              <Form.Item label="Event Date">
              {getFieldDecorator('event_date', config)(<DatePicker format="YYYY-MM-DD"/>)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Form>
            <Button type="danger" htmlType="submit" onClick = {this.handleDelete}>
              Delete
            </Button>
          </div>}        
      </div>}</div>
    );
  }
}
const WrappedRegistrationForm = Form.create()(UpdateEvent);
export default WrappedRegistrationForm;
