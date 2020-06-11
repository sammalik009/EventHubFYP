import React from 'react';
import { Layout, Menu, Row, Col } from 'antd';//, Badge
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
const { Content } = Layout;
class CustomLayout2 extends React.Component{
    handleClick = e => {
        switch(e.key){
            case '1':
                window.location.href = '/profile/';
                break;
            case '2':
                window.location.href = '/profile/my_events/';
                break;
            case '3':
                window.location.href = '/profile/registrations/';
                break;
            case '4':
                window.location.href = '/profile/requests/';
                break;
            case '5':
                window.location.href = '/profile/edit_profile/';
                break;
            default:
                return;
        }
      };
    render(){ 
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
                                <Menu.Item key="1"><b>Profile</b></Menu.Item>
                                { localStorage.getItem('is_organizer')==="true"?
                                    <Menu.Item key="2"><b>My Events</b></Menu.Item>
                                  :
                                    <span/>
                                }
                                <Menu.Item key="3"><b>Registrations</b></Menu.Item>
                                { localStorage.getItem('is_organizer')==="true"?
                                    <Menu.Item key="4"><b>My Requests</b></Menu.Item>
                                  :
                                    <span/>
                                }
                                { localStorage.getItem('is_organizer')==="true"?
                                    <Menu.Item key="5"><b>Edit Profile</b></Menu.Item>
                                :
                                    <span/>
                                }
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
export default connect(null, mapDispatchToProps)(CustomLayout2);

