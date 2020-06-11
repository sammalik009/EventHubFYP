import React from 'react';
import axios from 'axios';
import {
    Table,
    Spin
  } from 'antd';
class AdminEvents extends React.Component{
    state = {
      events:[],
      sold : [],
      loading : true
    }
    columns_events = [
      {
        title: 'Event ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Organizer',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: 'Date',
        dataIndex: 'event_date',
        key: 'event_date',
      },
      {
        title: 'Price',
        dataIndex: 'price_ticket',
        key: 'price_ticket',
      },
      {
        title: 'Total Tickets',
        dataIndex: 'total_tickets',
        key: 'total_tickets',
      },
      {
        title: 'Sold Tickets',
        dataIndex: 'sold_tickets',
        key: 'sold_tickets',
      },
      {
        title: 'Sold %',
        dataIndex: 'sold',
        key: 'sold',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
    ]
      componentDidMount(){
        axios.get('http://127.0.0.1:8000/event/api/Events/get_admin_events/')
        .then(res =>{
          this.setState({
            events :res.data.events,
            sold : res.data.sold,
          });
          let data = []
          for(let i=0;i<res.data.events.length;i++){
            data.push({
                key : i,
                id : res.data.events[i].id,
                title : res.data.events[i].title,
                user_name : res.data.events[i].user_name,
                category : res.data.events[i].category,
                event_date : res.data.events[i].event_date,
                price_ticket : res.data.events[i].price_ticket,
                total_tickets : res.data.events[i].total_tickets,
                sold_tickets : res.data.events[i].sold_tickets,
                sold : res.data.sold[i],
                status : res.data.events[i].status
            });
          }
          this.setState({
              data : data,
              loading : false
          });
        })
        .catch();
      }
      render (){
        return (
          <div>
            { this.state.loading? 
            <Spin size='large'/>
            :
          <div style={{ background: '#fff', padding: 24 }}>
            { this.state.events.length>0?
              <div>
                <h3>Events</h3>
              <Table columns={this.columns_events} dataSource={this.state.data} rowKey="id" onRow={(record, rowIndex) => {
                return {
                  onClick: event => {
                    if(parseInt(localStorage.getItem('user')) === this.state.events[rowIndex].user){
                      window.location.href = `/myEvents/${this.state.events[rowIndex].id}/`;
                    }
                    else{
                      window.location.href = `/events/${this.state.events[rowIndex].id}/`;  
                    }
                  },
                };
              }}/>
              </div>
              :
              <h1>No Events Yet</h1>
          }
            
          </div>
      }</div>
        );
      }
    }
export default AdminEvents;
