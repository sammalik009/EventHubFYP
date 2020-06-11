import React from 'react';
import { Layout, Badge } from 'antd';
import {Navbar, Nav, Button, Form,FormControl} from "react-bootstrap";
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
import axios from 'axios';
import styled from "styled-components";

const { Content, Footer } = Layout;
const NavItem = styled.div`
    background-color: #ffaf20;
`;
class CustomLayout extends React.Component{
    state={
        unread:null
    }
    componentDidMount(){
        if(localStorage.getItem("token")){
            axios.post('http://127.0.0.1:8000/notification/api/Notifications/get_notifications/',{
                user:parseInt(localStorage.getItem("user"))
            })
            .then(res =>{
                this.setState({
                    unread: res.data.unread
                });
            })
            .catch();
        }
    }
    render(){ 
          return (
            <Layout className="layout">
                <NavItem>
                    <Navbar collapseOnSelect expand="lg" >
                        <Navbar.Brand href="/">EventHub</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">                    
                                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                                <Button variant="outline-info">Search</Button>             
                            </Nav>
                            <Form inline>
                                <Nav className="mr-auto">
                                    {
                                        localStorage.getItem("is_admin")==="true" ?
                                        <Nav.Link href='/admin/users/'>Overview</Nav.Link>
                                        :
                                        <span/>
                                    }
                                    <Nav.Link href='/event/addEvent/'>Organize</Nav.Link>
                                    {
                                        localStorage.getItem("is_admin")==="true" ?
                                        <Nav.Link href='/requests/'>Requests</Nav.Link>
                                        :
                                        <span/>
                                    }
                                    {
                                        this.props.isAuthenticated===false ?
                                        <span/>
                                        :
                                        <Nav.Link href='/notifications/'>
                                            Notifications <Badge count={this.state.unread} style={{ backgroundColor: '#2db7f5' }} />
                                        </Nav.Link>
                                    }
                                    {
                                        localStorage.getItem("username") ?
                                        <Nav.Link href='/profile/'>{localStorage.getItem("username").toUpperCase()}</Nav.Link>
                                        :
                                        <span/>
                                    }
                                    <Nav.Link href="#features">Help</Nav.Link>
                                    {
                                        this.props.isAuthenticated===false ?
                                        <Nav.Link href='/login/'>Signin</Nav.Link>
                                        :
                                        <Nav.Link key="7" onClick={this.props.logout}>Signout</Nav.Link>
                                    }
                                    
                                </Nav>    
                            </Form>
                        </Navbar.Collapse>
                    </Navbar>
                </NavItem>            
                <Content style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    {this.props.children}
                    </Content>
                <Footer style={{ textAlign: 'center' }}>EventHub ©2020 Created by Usama Industries</Footer>
            </Layout>
        );
    }
}
const mapDispatchToProps =dispatch => {
    return {
        logout: ()=> dispatch(actions.logout())
    }
}
export default connect(null, mapDispatchToProps)(CustomLayout);
