import React from 'react'
import {Jumbotron,Modal} from 'react-bootstrap'
import { Row, Col,InputNumber, Form, Cascader, Rate, Spin } from 'antd';
import 'antd/dist/antd.css';
import background from './back.jpg'
import styled from "styled-components";
import './cardsDetail.css';
import axios from 'axios';
import Carousel1 from '../elements/carousel';
import Images from '../components/Images';
import Comments from '../components/Comments';

const methods = [
  /*{
    value: 'JazzCash',
    label: 'JazzCash',
  },
  {
    value: 'CreditCard',
    label: 'Credit Card',
  },*/
  {
    value: 'CashOnSpot',
    label: 'Cash On Spot',
  },
];

const Button2 = styled.button`
  background: green;
  border-radius: 18px;
  font-size: 25px;
  color: white;
  padding: 10px 10px;
`;
const Button3=styled.button`
background-color: white; 
color: black; 
border: 2px solid #4CAF50;` ;
const FormFoot= styled.div`
textAlign: left;
font-size: 25px;
margin-right: 50px
`;

const Button1 = styled.button`
background-color: white; 
color: black; 
border: 2px solid #4CAF50;
`;

const Button = styled.button`
  background: green;
  border-radius: 18px;
  font-size: 30px;
  color: white;
  padding: 10px 10px;
`;
const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];
function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Registration
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Choose no of tickets</h4>
          <InputNumber min={1} max={10} defaultValue={3} />
          <FormFoot> Total: </FormFoot>
        </Modal.Body>
        <Modal.Footer>
          <Button2 onClick={props.onHide}>Close</Button2>
          <Button2 onClick={props.onHide}>Checkout</Button2>
        </Modal.Footer>
      </Modal>
    );
  }
  

class EventDetailView extends React.Component {
  state = {
    event : {},
    history : [],
    images: [],
    images2: [],
    images3:null,
    btnText:"See Photos",
    comments:[],
    replies:[],
    user:null,
    value:0,
    status:undefined,
    feedback : 0.0,
    loading : true
  }
  handleSubmit = e => {
    e.preventDefault();
    if(!localStorage.getItem('token')){window.location.href='/login/';}
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(values.number_of_tickets>0){
          axios.post('http://127.0.0.1:8000/event/api/Registrations/add_registration/',{
              price :this.state.event.price_ticket,
              total_amount : this.state.event.price_ticket * values.number_of_tickets,
              event: this.props.match.params.eventID,
              number_of_tickets :values.number_of_tickets,
              method:['CashOnSpot'],
              user : parseInt(localStorage.getItem("user"))
          })
          .then(res =>{
              this.setState({
                  events: res.data
              });
              window.location.reload(false);
          })
          .catch();
          //method:values.method,
        }
      }
    });
  }
  componentDidMount(){
    axios.post('http://127.0.0.1:8000/event/api/Events/get_event/',{
      event:this.props.match.params.eventID
    })
    .then(res=>{
      this.setState({
        event:res.data.event,
        images:res.data.images,
        user:res.data.event.user_name.toUpperCase(),
        feedback : res.data.feedback,
        loading : false
      });
      if(res.data.event.user===parseInt(localStorage.getItem('user'))){
        window.location.href= `/myEvents/${this.props.match.params.eventID}`
      }
      if(this.state.event.status==="HAPPENED"){
        axios.post(`http://127.0.0.1:8000/comment/api/Comments/get_comments/`,{
            event: this.props.match.params.eventID
        })
        .then(res =>{
          this.setState({
              comments: res.data.comments,
              replies:res.data.replies
          });
        });
        if(localStorage.getItem('token')){
          axios.post(`http://127.0.0.1:8000/attendee/api/Attendees/check_feedback/`,{
            event: this.props.match.params.eventID,
            user: parseInt(localStorage.getItem('user'))
        })
        .then(res =>{
          this.setState({
              status: res.data.status
          });
        });
        }           
      }
    })
  }
  handleChange = value => {
    this.setState({ value });
  };
  handleOnClick = e => {
    if(this.state.btnText==="See Photos"){
      this.setState({
        btnText:"Hide Photos",
        images3: this.state.images
      });
    }
    else{
      this.setState({
        btnText:"See Photos",
        images3: null
      });
    }
  }
  saveFeedback = () => {
    if(this.state.value>0){
      axios.post(`http://127.0.0.1:8000/attendee/api/Attendees/save_feedback/`,{
        event: this.props.match.params.eventID,
        user: parseInt(localStorage.getItem('user')),
        feedback:this.state.value
    })
    .then(res =>{
      this.setState({
          status: res.data.status
      });
      window.location.reload();
    });
    }
  }
  render(){
    const { value } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        { this.state.loading? 
        <Spin size='large'/>
        :
        <div className="App" style={{backgroundImage: `url(${background})`,  background: '#fff', padding: 24, minHeight: 280 }}>
        <Jumbotron  style={{background: '#fff'}}>
            <Row>
                <Col span={1}></Col>
                <Col span={16}>
                <Carousel1 images={this.state.images} status="YES"/>
                    </Col>
                <Col span={7}><h1> {this.state.event.title} </h1>
                    <h2> by: <a href={`/user_profile/${this.state.event.user}/`}>{this.state.user}</a></h2>
                    {
                        this.state.event.status==="APPROVED" && this.state.event.remaining_tickets>0 ?
                            <Form onSubmit={this.handleSubmit}>
                            {
                                this.state.event.limit_for_tickets!==null && this.state.event.limit_for_tickets < this.state.event.remaining_tickets ?
                                <Form.Item label="Select Tickets">
                                    {getFieldDecorator('number_of_tickets', { initialValue: 1,
                                    rules: [{ required: true, message: 'Please Select Number of Tickets!' }],
                                    })(<InputNumber min={1} max={this.state.event.limit_for_tickets} />)}
                                </Form.Item>
                                :
                                <Form.Item label="Select Tickets">
                                    {getFieldDecorator('number_of_tickets', { initialValue: 1,
                                    rules: [{ required: true, message: 'Please Select Number of Tickets!' }],
                                    })(<InputNumber min={1} max={this.state.event.remaining_tickets} />)}
                                </Form.Item>
                            }
                            {
                              !this.state.event.price_ticket ?
                                <Form.Item label="Method">
                                    {getFieldDecorator('method', {
                                    rules: [{ type: 'array', required: true, message: 'Please select payment method!' }],
                                    })(<Cascader options={methods} />)}
                                </Form.Item>
                                :
                                <span><b>Note : </b>payment will be received on spot</span>
                            }
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Register
                                    </Button>
                                </Form.Item>
                            </Form>
                            :
                            <div>
                              {
                                this.state.event.status==="HAPPENED"?
                                <div>
                                  <p><b>Rating : </b>{this.state.feedback}</p>
                                <Comments comments={this.state.comments} replies={this.state.replies} event={this.props.match.params.eventID}/>
                                {
                                  localStorage.getItem('token') && this.state.status==='NO'?
                                  <div>
                                    <br/>
                                      <h5>How was your experience? </h5>
                                      <Rate tooltips={desc} onChange={this.handleChange} value={value} />
                                      <Button3 type="primary" htmlType="button" onClick={this.saveFeedback}>
                                        Save
                                    </Button3>
                                  </div>
                                  :
                                  <span/>
                                  }
                                </div>
                                :
                                <span/>
                              }
                            </div>
                        }
                        <MyVerticallyCenteredModal
                        />
                    </Col>
                </Row>
                <Row>
                <Col span={2}></Col>
                <Col span={10}> <h1> Description</h1>
                <p>{this.state.event.description} </p></Col><br/><br/><br/><br/><br/>
                {
                      this.state.images3===null?
                        <span/>
                        :
                        <Images data={this.state.images3} user={this.state.event.user}/>
                    }
                    <Button type="primary" onClick={this.handleOnClick}>{this.state.btnText}</Button>
                    <br/>
                <Col span={8}>
                    <br></br>
                    <h4> Share With Friends</h4>
                    <br></br>
                    <i className="fab fa-facebook-f fa-5x"></i>
                    <i style ={{marginLeft: "30px"}} className="fab fa-twitter fa-5x"></i>
                    <i style ={{marginLeft: "30px"}} className="fab fa-google fa-5x"></i>
                    <i style ={{marginLeft: "30px"}}  className="fab fa-linkedin-in fa-5x"></i>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Button1>Follow</Button1>
                
                </Col>
                </Row>
            </Jumbotron>
        </div>
  }</div>
    );
};
}

//export default EventDetailView;

/*import React from 'react';
import axios from 'axios';
import { Card, Form, Cascader, Button, Icon, InputNumber } from 'antd';
import Carousel1 from '../elements/carousel'
import Event from '../components/Event'
import Images from '../components/Images';
import Comments from '../components/Comments';

const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 4 }} />
      <span style={{ marginRight: 8 }}>{text}</span>

    </span>
);
const methods = [
    {
      value: 'JazzCash',
      label: 'JazzCash',
    },
    {
      value: 'CreditCard',
      label: 'Credit Card',
    },
];
class EventDetail extends React.Component{
    state = {
        event : {},
        history : [],
        images: [],
        images2: [],
        images3:null,
        btnText:"See Photos",
        comments:[],
        replies:[],
    }
    handleOnClick = e => {
        if(this.state.btnText==="See Photos"){
          this.setState({
            btnText:"Hide Photos",
            images3: this.state.images
          });
        }
        else{
          this.setState({
            btnText:"See Photos",
            images3: null
          });
        }
      }      
    componentDidMount(){
        const eventID = this.props.match.params.eventID;
        axios.post(`http://127.0.0.1:8000/event/api/Events/get_event/`,{
            event: eventID
        })
        .then(res =>{
            this.setState({
                event: res.data.event,
                images:res.data.images
            });
            if(this.state.event.status==="HAPPENED"){
                axios.post(`http://127.0.0.1:8000/comment/api/Comments/get_comments/`,{
                    event: eventID
                })
                .then(res =>{
                    this.setState({
                        comments: res.data.comments,
                        replies:res.data.replies
                    });
                })                
            }
        })
        .catch();
        axios.post('http://127.0.0.1:8000/event/api/Events/get_history/',{
            event : eventID
        })
        .then(res =>{
            this.setState({
                history: res.data.events,
                images2: res.data.images
            });
        })
        .catch();
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(!localStorage.getItem('token')){window.location.href='/login/';}
                else{
                    if(values.number_of_tickets>0){
                        axios.post('http://127.0.0.1:8000/event/api/Registrations/add_registration/',{
                            price :this.state.event.price_ticket,
                            total_amount : this.state.event.price_ticket * values.number_of_tickets,
                            event: this.props.match.params.eventID,
                            number_of_tickets :values.number_of_tickets,
                            method:values.method,
                            user : parseInt(localStorage.getItem("user"))
                        })
                        .then(res =>{
                            this.setState({
                                events: res.data
                            });
                            window.location.reload(false);
                        })
                        .catch();
                    }
                }
            }
        });
    }
    render (){
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Card title={this.state.event.title}>
                    <Carousel1 images={this.state.images} status="YES"/>

                    <IconText type="star-o" text={this.state.event.total_tickets} key="list-vertical-star-o" />
                    <IconText type="like-o" text={this.state.event.price_ticket} key="list-vertical-like-o" />
                    <IconText type="message" text={this.state.event.sold_tickets} key="list-vertical-message" />
                    <p>{this.state.event.description}</p>
                    {
                      this.state.images3===null?
                        <span/>
                        :
                        <Images data={this.state.images3} user={this.state.event.user}/>
                    }
                    <Button type="primary" onClick={this.handleOnClick}>{this.state.btnText}</Button>
                    {
                        this.state.event.status==="APPROVED" ?
                            <Form onSubmit={this.handleSubmit}>
                            {
                                this.state.event.limit_for_tickets!==null && this.state.event.limit_for_tickets < this.state.event.remaining_tickets ?
                                <Form.Item label="Select Tickets">
                                    {getFieldDecorator('number_of_tickets', { 
                                    rules: [{ required: true, message: 'Please Select Number of Tickets!' }],
                                    })(<InputNumber min={1} max={this.state.event.limit_for_tickets} />)}
                                </Form.Item>
                                :
                                <Form.Item label="Select Tickets">
                                    {getFieldDecorator('number_of_tickets', {
                                    rules: [{ required: true, message: 'Please Select Number of Tickets!' }],
                                    })(<InputNumber min={1} max={this.state.event.remaining_tickets} />)}
                                </Form.Item>
                            }
                                <Form.Item label="Method">
                                    {getFieldDecorator('method', {
                                    rules: [{ type: 'array', required: true, message: 'Please select category!' }],
                                    })(<Cascader options={methods} />)}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                </Form.Item>
                            </Form>
                            :
                            <div>
                                <Comments comments={this.state.comments} replies={this.state.replies} event={this.props.match.params.eventID}/>
                            </div>
                        }
                </Card>
                <Event data={this.state.history} images={this.state.images2}/>
            </div>
        );
    }
}*/
const WrappedRegistrationForm = Form.create()(EventDetailView);
export default WrappedRegistrationForm;