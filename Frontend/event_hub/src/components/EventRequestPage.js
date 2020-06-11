import React from 'react';
import axios from 'axios';
import Carousel1 from '../elements/carousel';
import {
    Button,Row, Col, Spin
  } from 'antd';
export default class EventRequestPage extends React.Component{
    state= {
        event1:{},
        event2:{},
        request:{},
        type:{},
        images:[],
        status:null,
        loading : true
    }
    handleApprove = (id)=>{
        axios.post('http://127.0.0.1:8000/user/api/Requests/approve_request/',{
            id : id
        })
        .then(res =>{})
        .catch();
        window.location.reload(false);
    }    
    handleDisapprove = (id)=>{
        axios.post('http://127.0.0.1:8000/user/api/Requests/disapprove_request/',{
            id : id
        })
        .then(res =>{})
        .catch();
        window.location.reload(false);
    }
    componentDidMount(){
        let rID=this.props.match.params.rID
        axios.post('http://127.0.0.1:8000/event/api/Events/get_request_data/',{
          id:rID
      })
      .then(res=>{
          this.setState({
            event1:res.data.event1,
            event2:res.data.event2,
            request:res.data.request,
            images:res.data.images,
            status:res.data.status,
            loading : false
          })
      })
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
    return (
        <div>
          { this.state.loading? 
          <Spin size='large'/>
          :
        <div>
            {
                this.state.status ?
            <h1>{this.state.status}</h1>
            :
            <div><p><b>Request Type : </b>{this.state.request.type}</p>
            <Row>
            <Col xs={4}></Col><Col xs={16}>
            <Carousel1 images={this.state.images}/>
        </Col>
        {
            this.state.event1!==null && this.state.event2===undefined?
                <Col xs={24}>
                    <b>Event Title : </b>{this.state.event1.title}<br/>
                    <b>Event Venue : </b>{this.state.event1.venue}<br/>
                    <b>Event Category : </b>{this.state.event1.category}<br/>
                    <b>Event Date : </b>{this.state.event1.event_date}<br/>
                    <b>Price Ticket : </b>{this.state.event1.price_ticket}<br/>
                    <b>Total Tickets : </b>{this.state.event1.total_tickets}<br/>
                    <b>Sold Tickets : </b>{this.state.event1.sold_tickets}<br/>
                    <b>Remaining Tickets : </b>{this.state.event1.remaining_tickets}
                </Col>
            :
            <Col xs={24}>
                <Row>
                    <Col xs={12}>
                        <h3>Old Data</h3>
                        <b>Event Title : </b>{this.state.event1.title}<br/>
                        <b>Event Venue : </b>{this.state.event1.venue}<br/>
                        <b>Event Category : </b>{this.state.event1.category}<br/>
                        <b>Event Date : </b>{this.state.event1.event_date}<br/>
                        <b>Price Ticket : </b>{this.state.event1.price_ticket}<br/>
                        <b>Total Tickets : </b>{this.state.event1.total_tickets}<br/>
                        <b>Sold Tickets : </b>{this.state.event1.sold_tickets}<br/>
                        <b>Remaining Tickets : </b>{this.state.event1.remaining_tickets}</Col>
                    <Col xs={12}>
                        <h3>New Data</h3>
                        <b>Event Title : </b>{this.state.event2.title}<br/>
                        <b>Event Venue : </b>{this.state.event2.venue}<br/>
                        <b>Event Category : </b>{this.state.event2.category}<br/>
                        <b>Event Date : </b>{this.state.event2.event_date}<br/>
                        <b>Price Ticket : </b>{this.state.event2.price_ticket}<br/>
                        <b>Total Tickets : </b>{this.state.event2.total_tickets}<br/>
                        <b>Sold Tickets : </b>{this.state.event2.sold_tickets}<br/>
                        <b>Remaining Tickets : </b>{this.state.event2.remaining_tickets}
                    </Col>
                </Row>
                <Button type="primary" htmlType="submit" style={{marginRight: 8,}} onClick={()=>this.handleApprove(this.state.request.id)}>
                APPROVE
            </Button>
            <Button type="danger" htmlType="submit" onClick={()=>this.handleDisapprove(this.state.request.id)}>
                DISAPPROVE
            </Button>
            </Col>
        }
        </Row>
        </div>
            }
        </div>
  }</div>
    );
  }
}
