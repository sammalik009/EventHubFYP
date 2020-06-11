import React from 'react';
import axios from 'axios';
import {
    Icon,
    Table,
    Spin
  } from 'antd';
class MyEventRegistrations extends React.Component{
  state = {
    registrations :[],
    loading:true
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
    title: 'Payment ID',
    dataIndex: 'payment',
    key: 'payment',
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
  componentDidMount(){
    const eventID = this.props.match.params.eventID;
    axios.post('http://127.0.0.1:8000/event/api/Events/get_event_registrations/',{
      event:eventID,
    })
    .then(res =>{
      this.setState({
          registrations: res.data.data,
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
                  { this.state.registrations.length>0?
        <div>
          <h3>Registrations</h3>
        <Table columns={this.columns_registration} dataSource={this.state.registrations} rowKey="id" onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  window.location.href = `/user_profile/${this.state.registrations[rowIndex].user}/`;  
                },
              };
            }}/>
          </div>
          :
          <h1>No Registrations Yet</h1>
      }
        
      </div>
  }</div>
    );
  }
}
export default MyEventRegistrations;
