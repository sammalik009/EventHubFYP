import React from 'react';
import axios from 'axios';
import Carousel1 from '../elements/carousel';
import Comments from '../components/Comments';
import {
    Button,
    Col,
    Spin
  } from 'antd';
import Images from '../components/Images';
class MyEventDetail2 extends React.Component{
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
    replies:[],
    loading:true
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
    if(new Date()>new Date(this.state.event.event_date)){
      axios.post('http://127.0.0.1:8000/event/api/Events/get_event_attendees/',{
        event:eventID
      })
      .then(res =>{
        this.setState({
            attendees: res.data
        });
        console.log(res.data);
      })
      .catch();
    }
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
      <div style={{ background: '#fff', padding: 24 }}>
        <Col xs={24}>
        <Carousel1 images={this.state.images2}/>
        </Col>
    <b>Event Title : </b>{this.state.event.title}<br/>
    <b>Event Venue : </b>{this.state.event.venue}<br/>
    <b>Event Category : </b>{this.state.event.category}<br/>
    <b>Event Date : </b>{this.state.event.event_date}<br/>
    <b>Price Ticket : </b>{this.state.event.price_ticket}<br/>
    <b>Total Tickets : </b>{this.state.event.total_tickets}<br/>
    <b>Sold Tickets : </b>{this.state.event.sold_tickets}<br/>
    <b>Remaining Tickets : </b>{this.state.event.remaining_tickets}
    <br/>
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
          </div>}
      </div>}</div>
    );
  }
}
export default MyEventDetail2;
