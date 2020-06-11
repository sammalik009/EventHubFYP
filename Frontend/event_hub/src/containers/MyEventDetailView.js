import React from 'react';
import axios from 'axios';
import Carousel1 from '../elements/carousel';
import Comments from '../components/Comments';
import {
    Form,
    Input,
    Icon,
    Cascader,
    DatePicker,
    Button,
    Col,
    Table,
  } from 'antd';
import Images from '../components/Images';
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
class MyEventDetail extends React.Component{
  state = {
    event : {},
    attendees :[],
    registrations :[],
    sold:null,
    payment:null,
    images:null,
    images2:[],
    images3:null,
    btnText:"See Photos",
    btnText2:"Add New Photos",
    type:"default",
    payments:[],
    comments:[],
    replies:[]
}
 handleOnClick = e => {
  if(this.state.btnText==="See Photos"){
    this.setState({
      btnText:"Hide Photos",
      images3: this.state.images2,
    });
  }
  else{
    this.setState({
      btnText:"See Photos",
      images3: null,
      images:null,
      btnText2:"Add New Photos",
      link:null,
      type:"default"
    });
  }
}
columns_registration = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Voucher',
    dataIndex: 'voucher_code',
    key: 'voucher_code',
  },
  {
    title: 'Event',
    dataIndex: 'event_title',
    key: 'event_title',
  },
  {
    title: 'Tickets',
    dataIndex: 'number_of_tickets',
    key: 'number_of_tickets',
  },
  {
    title: 'Total',
    dataIndex: 'total_price',
    key: 'total_price',
  },
  {
    title: 'Attended',
    dataIndex: 'has_attended',
    key: 'has_attended',
    render:attended =>(
      <div>
      { attended===true ?
        <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>
        :
        <Icon type="close-circle" theme="twoTone" twoToneColor="#f50"/>
      }
      </div>
    )
  },
]
columns_payment = [
  {
    title: 'Event Id',
    dataIndex: 'event',
    key: 'event'
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: 'Total Payment',
    dataIndex: 'total_amount',
    key: 'total_amount',
  },
]
handleImageChange = (e) => {
  let list=[];
  for(let i=0;i<e.target.files.length;i++){
    if(e.target.files[i].size / 1024 / 1024 < 2){
      list.push(e.target.files[i]);
    }
  }
  if(list.length===0){
    this.setState({
      images: null,
      btnText2: "Add New Photos",
      link:null,
      type:"default"
    });
  }
  else{
    this.setState({
      images: e.target.files,
      btnText2: "Save",
      link:this.addPhotos,
      type:"primary"
    });
  }
};
  addPhotos = () => {
    for(let i=0;i<this.state.images.length;i++){
      let formData = new FormData();
      formData.append('image',this.state.images[i],this.state.images[i].name);
      formData.append('event',this.state.event.id);
      axios.post('http://127.0.0.1:8000/event/api/Images/add_images/', formData,{
        headers:{
          'content-type':'multipart/form-data'
        }
      }).then(res=>{
          window.location.reload(false);
      })
    }
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
          images2:res.data.images
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
    if(this.state.event.status === 'HAPPENED'){
      axios.post('http://127.0.0.1:8000/event/api/Events/get_event_attendees/',{
        event:eventID
      })
      .then(res =>{
        this.setState({
            attendees: res.data
        });
      })
      .catch();
    }
    axios.post('http://127.0.0.1:8000/event/api/Events/get_event_registrations/',{
      event:this.props.match.params.eventID,
    })
    .then(res =>{
      this.setState({
          registrations: res.data.data,
          sold:res.data.sold_tickets,
          payment: res.data.payments,
      });
    })
    .catch();
    axios.post('http://127.0.0.1:8000/event/api/Events/get_event_payments/',{
      event:this.props.match.params.eventID,
    })
    .then(res =>{
      this.setState({
          payments: res.data,
      });
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
      <div style={{ background: '#fff', padding: 24 }}>
        <Col xs={24}>
        <Carousel1 images={this.state.images2}/>
        </Col>
        <h1>Registrations : {this.state.registrations.length}</h1>
        <h1>Sold Tickets : {this.state.sold}</h1>
        <h1>Total Payment : {this.state.payment}$</h1>
        {
          new Date()>new Date(new Date(this.state.event.event_date)) ?
          <h1>Attendees : {this.state.attendees.length}</h1>
          :
          <h1>No Attendees Yet</h1>
        }
        {
          this.state.images3===null?
          <span/>
          :
          <div>
          <Images data={this.state.images3} user={this.state.event.user}/>
          <Button type={this.state.type} onClick={this.state.link}>{this.state.btnText2}</Button>
          <input type="file"
                   id="image"
                   accept="image/png, image/jpeg"
                   multiple={true}  onChange={this.handleImageChange} placeholder="Upload Images"/>
          </div>
        }
        <Button type="primary" onClick={this.handleOnClick}>{this.state.btnText}</Button>
        {
          new Date(new Date(new Date(this.state.event.event_date).getTime()- (7*24*60*60*1000)))<new Date() ?
          <div>
            <h1>{/*Cannot be updated*/}</h1>
            {
              this.state.event.status==="HAPPENED" ?
              <Comments comments={this.state.comments} replies={this.state.replies} event={this.props.match.params.eventID}/>
              :
              <span/>
            }
          </div>
          :
          <div>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item label="Title">
              {getFieldDecorator('title', {
                  rules: [{ required: false, message: 'Please input title!' }],
              })(
                  <Input
                  prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Title"
                  />,
              )}
              </Form.Item>
              <Form.Item label="Venue">
              {getFieldDecorator('venue', {
                  rules: [{ required: false, message: 'Please input venue!' }],
              })(
                  <Input
                  prefix={<Icon type="bank" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Venue"
                  />,
              )}
              </Form.Item>
              <Form.Item label="Description">
              {getFieldDecorator('description', {
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
                  { this.state.registrations.length>0?
        <div>
          <h3>Registrations</h3>
        <Table columns={this.columns_registration} dataSource={this.state.registrations} rowKey="id"/>
          </div>
          :
          <span/>
      }
      
      { this.state.payments.length>0?
        <div>
          <h3>Payments</h3>
          <Table columns={this.columns_payment} dataSource={this.state.payments} rowKey="id"/>
          </div>
          :
          <span/>
      }
        
      </div>
    );
  }
}
const WrappedRegistrationForm = Form.create()(MyEventDetail);
export default WrappedRegistrationForm;
