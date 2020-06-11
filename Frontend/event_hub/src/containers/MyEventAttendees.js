import React from 'react';
import axios from 'axios';
import {
    Table,
    Button,
    Rate,
    Spin
  } from 'antd';
class MyEventAttendees extends React.Component{
  state = {
    attendees :[],
    data : [],
    event:{},
    count:0,
    feedback:0.0,
    loading : true
}
columns_attendees = [
  {
    title: 'Event Id',
    dataIndex: 'event'
  },
  {
    title: 'Method',
    dataIndex: 'method'
  },
  {
    title: 'Total Payment',
    dataIndex: 'total_amount'
  },
  {
    title: 'Received Payment',
    dataIndex: 'received_amount'
  },
  {
    title: 'Feedback',
    dataIndex: 'feedback',
    render:feedback =>(
      <div>
        { feedback===undefined || feedback === 0 || feedback===null?
          <Rate value={0} disabled/>
          :
          <Rate value={feedback} disabled/>
        }
        </div>
    )
  },
] 
  componentDidMount(){
    const eventID = this.props.match.params.eventID;
      axios.post('http://127.0.0.1:8000/event/api/Events/get_event_attendees/',{
        event:eventID
      })
      .then(res =>{
        this.setState({
            attendees: res.data.data,
            payments:res.data.payments,
            event:res.data.event,
            feedback: res.data.feedback,
            count:res.data.count
        });
        let list1 = []
        for(let i=0;i<res.data.data.length;i++){
          list1.push({
            key: i,
            event: res.data.data[i].id,
            method: res.data.payments[i].method,
            total_amount: res.data.payments[i].total_amount,
            received_amount: res.data.payments[i].received_amount,
            feedback:res.data.data[i].feedback
            });
        }
        this.setState({
          data:list1,
          loading : false
        })
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
    return (
      <div>
        { this.state.loading? 
        <Spin size='large'/>
        :
      <div style={{ background: '#fff', padding: 24 }}>
        { this.state.attendees.length>0 && this.state.event.status==='HAPPENED'?
        <div>
          <h5>Current Rating : {this.state.feedback} by {this.state.count} users.</h5>
          <h3>Attendees</h3>
          <Table columns={this.columns_attendees} dataSource={this.state.data} rowKey="key" onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  window.location.href = `/user_profile/${this.state.attendees[rowIndex].user}/`;  
                }, // click row
              };
            }}/>
          </div>
          :
          <h1>No Attendees Yet</h1>
      }
       { this.state.event.status==='HAPPENING TODAY'?
        <Button type="primary" htmlType="button">
          <a href={`/myEvents/${this.props.match.params.eventID}/mark_attendence/`}>
          Add Attendees</a>
        </Button>
          :
          <span/>
      }
   
      </div>
  }</div>
    );
  }
}
export default MyEventAttendees;
