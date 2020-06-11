import React from 'react';
import axios from 'axios';
import {
    Table,
    Spin
  } from 'antd';
class MyEventPayments extends React.Component{
  state = {
    payments:[],
    loading:true
}
columns_payment = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
    },
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
  componentDidMount(){
    const eventID = this.props.match.params.eventID;
    axios.post('http://127.0.0.1:8000/event/api/Events/get_event_payments/',{
      event:eventID,
    })
    .then(res =>{
      this.setState({
          payments: res.data,
          loading:false
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
    return (
      <div>
        { this.state.loading? 
        <Spin size='large'/>
        :
      <div style={{ background: '#fff', padding: 24 }}>
      { this.state.payments.length>0?
        <div>
          <h3>Payments</h3>
          <Table columns={this.columns_payment} dataSource={this.state.payments} rowKey="id"/>
          </div>
          :
          <h1>No Payments Yet</h1>
      }
        
      </div>
  }</div>
    );
  }
}
export default MyEventPayments;
