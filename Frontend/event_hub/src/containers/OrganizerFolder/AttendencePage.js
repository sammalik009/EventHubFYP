import React from 'react';
import { Button, Table, Spin } from 'antd';
import axios from 'axios';
const columns = [
    {
      title: 'Voucher Code',
      dataIndex: 'voucher_code',
    },
    {
      title: 'Number of Tickets',
      dataIndex: 'number_of_tickets',
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
    },
    {
      title: 'Received Amount',
      dataIndex: 'received_amount',
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      render:payment =>(
        <div>
        { payment==='PENDING' ?
        <b style={{ color: 'red' }}>PENDING</b>
          :
          <b style={{ color: 'green' }}>PAID</b>
        }
        </div>
      )
    },
  ];
class AttendenceSheet extends React.Component{
    state = {
        list1:[],
        list2:[],
        registrations:[],
        payment:[],
        selectedRowKeys: [],
        loading : true
    }
    componentDidMount(){  
        axios.post('http://127.0.0.1:8000/event/api/Events/get_event_registrations_and_payments/',{
            event:this.props.match.params.eventID,
        })
        .then(res =>{
            const data = [],list2=[], list3=[];
            for (let i = 0; i < res.data.data.length; i++) {
                list2.push(res.data.data[i].has_attended);
                if(res.data.data[i].has_attended){
                    list3.push(i);
                }
                data.push({
                key: i,
                voucher_code: res.data.data[i].voucher_code,
                number_of_tickets: res.data.data[i].voucher_code,
                total_amount: res.data.payments[i].total_amount,
                received_amount: res.data.payments[i].received_amount,
                payment : res.data.payments[i].total_amount !== res.data.payments[i].received_amount ? 'PENDING':'PAID'
                });
            }
            this.setState({
                registrations: res.data.data,
                payment: res.data.payments,
                list1:data,
                list2:list2,
                selectedRowKeys:list3,
                loading : false
            });
        })
        .catch();  
    }
    changeData = (id) =>{
        let list2 = []
        list2 = this.state.list3;
        list2[id] = !list2[id]
        this.setState({
            list3:list2
        })
    }
    saveData = () =>{
        let list2 = this.state.list2;
        let list3 = this.state.selectedRowKeys;
        for(let i=0;i<list3.length;i++){
            if(!list2[list3[i]])list2[list3[i]]=true;
        }
        console.log(list2);
        this.setState({
            list2:list2
        });
        axios.post('http://127.0.0.1:8000/attendee/api/Attendees/add_attendees/',{
            list1 :this.state.registrations,
            list2 : list2,
        })
        .then(res =>{
            window.location.href=`/myEvents/${this.props.match.params.eventID}/registrations/`;
        })
        .catch();
    }
      onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      };
    render(){ 
        if(localStorage.getItem("token")){
          if(localStorage.getItem("is_organizer")==="false"){
            window.location.href="/organizerForm/";
          }
        }
        else{
          window.location.href="/login/";
        }
        const { selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        return (
          <div>
            { this.state.loading? 
            <Spin size='large'/>
            :
          <div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.list1}  onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  if(parseInt(localStorage.getItem('user')) === this.state.users[rowIndex].id){
                    window.location.href = `/profile/${this.state.users[rowIndex].id}/`;
                  }
                  else{
                    window.location.href = `/user_profile/${this.state.users[rowIndex].id}/`;  
                  }
                },
              };
            }}/>
            <Button type="primary" onClick={this.saveData}>
          Save
        </Button>
          </div>
    }</div>
        );
    }
}
export default AttendenceSheet;