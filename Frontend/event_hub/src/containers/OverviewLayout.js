import React from 'react';
import { Layout, Menu, Row, Col } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
const { Content } = Layout;
const { SubMenu } = Menu;
class OverviewLayout extends React.Component{
    handleClick = e => {
        switch(e.key){
            case '1':
                window.location.href = '/admin/users/';
                break;
            case '2':
                window.location.href = '/admin/organizers/';
                break;
            case '3':
                window.location.href = '/admin/admins/';
                break;
            case '4':
                window.location.href = '/admin/events/';
                break;
            case '5':
                window.location.href = '/admin/events/happening_today/';
                break;
            case '6':
                window.location.href = '/admin/events/happened/';
                break;
            case '7':
                window.location.href = '/admin/events/approved/';
                break;
            default:
                return;
        }
      };
    render(){ 
        if(localStorage.getItem("token")){
          if(localStorage.getItem("is_admin")==="false"){
            window.location.href="/events/";
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
                                <Menu.Item key="1"><b>Users</b></Menu.Item>
                                <Menu.Item key="2"><b>Organizers</b></Menu.Item>
                                <Menu.Item key="3"><b>Admins</b></Menu.Item>
                                <SubMenu key="sub3" title={<b>Events</b>}>
                                    <Menu.Item key="4">All</Menu.Item>
                                    <Menu.Item key="5">Happening Today</Menu.Item>
                                    <Menu.Item key="6">Happened</Menu.Item>
                                    <Menu.Item key="7">Approved</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Col>
                        <Col span={20}>
                            <Content style={{ padding: '0 50px' }}>
                                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
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
export default connect(null, mapDispatchToProps)(OverviewLayout);


