import React from 'react';
import { Layout, Menu, Row, Col, Badge } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
import axios from 'axios';
const { Content } = Layout;
class CustomLayout2 extends React.Component{
    state = {
        registrations:[],
        sold:{},
        payment:{},
        attendees:[],
        feedback:0,
        count:0
    }
    componentDidMount(){
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
            axios.post('http://127.0.0.1:8000/event/api/Events/get_event_attendees/',{
              event:this.props.match.params.eventID
            })
            .then(res =>{
              this.setState({
                  attendees: res.data.data,
                  feedback:res.data.feedback,
                  count:res.data.count
              });
            })
            .catch();      
    }
    handleClick = e => {
        switch(e.key){
            case '1':
                window.location.href = `/myEvents/${this.props.match.params.eventID}/`;
                break;
            case '2':
                window.location.href = `/myEvents/${this.props.match.params.eventID}/registrations/`;
                break;
            case '3':
                window.location.href = `/myEvents/${this.props.match.params.eventID}/payments/`;
                break;
            case '4':
                window.location.href = `/myEvents/${this.props.match.params.eventID}/attendees/`;
                break;
            case '5':
                window.location.href = `/myEvents/${this.props.match.params.eventID}/update/`;
                break;
            default:
                return;
        }
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
        return (
            <Layout className="layout">
                <div>
                    <Row>
                        <Col span={4}>
                            <Menu
                            onClick={this.handleClick}
                            style={{ width: 256 }}
                            mode="inline"
                            >
                                <Menu.Item key="1"><b>Event</b></Menu.Item>
                                <Menu.Item key="2"><b>Registrations</b></Menu.Item>
                                <Menu.Item key="3"><b>Payments</b></Menu.Item>
                                <Menu.Item key="4"><b>Attendees</b></Menu.Item>
                                <Menu.Item key="5"><b>Update Event</b></Menu.Item>
                            </Menu>
                        </Col>
                        <Col span={20}>
                            <Content style={{ padding: '0 50px' }}>
                                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                                <Badge count={`Registrations : ${this.state.registrations.length}   `} style={{ backgroundColor: '#2db7f5' }} ></Badge>
                                <Badge count={`Sold Tickets : ${this.state.sold}`} style={{ backgroundColor: '#2db7f5' }} ></Badge>
                                <Badge count={`Payments : ${this.state.payment} $`} style={{ backgroundColor: '#2db7f5' }} ></Badge>
                                <Badge count={`Attendees : ${this.state.attendees.length}`} style={{ backgroundColor: '#2db7f5' }} ></Badge>
                                <Badge count={`Rating : ${this.state.feedback}`} style={{ backgroundColor: '#2db7f5' }} ></Badge>
                                {this.props.children}</div>
                            </Content>
                        </Col>
                    </Row>
                </div>
            </Layout>
        );
    }
}
const mapDispatchToProps =dispatch => {
    return {
        logout: ()=> dispatch(actions.logout())
    }
}
export default connect(null, mapDispatchToProps)(CustomLayout2);
