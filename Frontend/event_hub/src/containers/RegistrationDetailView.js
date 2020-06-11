import React from 'react';
import axios from 'axios';
import {Card} from 'react-bootstrap';
import Carousel1 from '../elements/carousel';
import {Spin} from 'antd';
class RegistrationDetail extends React.Component{

    state = {
        registration : {},
        images :[],
        loading :true
    }
    
    componentDidMount(){
        const rID = this.props.match.params.rID;
        axios.post('http://127.0.0.1:8000/event/api/Registrations/get_registration/',{
            id:rID
        })
        .then(res =>{
            this.setState({
                registration: res.data.registration,
                images : res.data.images,
                loading : false
            });
        })
        .catch();
    }

    render (){
        if(!localStorage.getItem("token")){
            window.location.href="/login/";
        }
        return (
            <div>
              { this.state.loading? 
              <Spin size='large'/>
              :
          <div>
                <Carousel1 images={this.state.images}/>
                        <Card>
                    <Card.Body>
                        <Card.Title><a href={`/events/${this.state.registration.event}/`}><h1>{this.state.registration.event_title}</h1></a></Card.Title>
                        <h3>VOUCHER CODE : {this.state.registration.voucher_code}</h3>
                        <h3>NUMBER OF TICKETS : {this.state.registration.number_of_tickets}</h3>
                        <h3>PRICE OF TICKET : {this.state.registration.price}</h3>
                        <h3>TOTAL PRICE : {this.state.registration.total_price}</h3>
                            </Card.Body>
                        </Card>

          </div>}</div>
        );
    }
}

export default RegistrationDetail;