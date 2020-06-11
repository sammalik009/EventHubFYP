import React from 'react';
import { Icon, Form, Input, Button, Spin } from 'antd';
//import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

const antIcon = <Icon type="loading" style={{fontSize:24}} spin />
class CustomForm extends React.Component {

  state={
      data:[],
      error:[]
  }
  handleFormSubmit= (event)=>{
    event.preventDefault();
    this.setState({error:[]});
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(values.username.indexOf(" ")>=0 ||
          values.username.indexOf(",")>=0 ||
          values.username.indexOf("@")>=0 ||
          values.username.indexOf(":")>=0 ||
          values.username.indexOf(";")>=0 ||
          values.username.indexOf("'")>=0 ||
          values.username.indexOf("$")>=0 ||
          values.username.indexOf("#")>=0 ||
          values.username.indexOf("!")>=0 ||
          values.username.indexOf("`")>=0 ||
          values.username.indexOf("~")>=0 ||
          values.username.indexOf("%")>=0 ||
          values.username.indexOf("^")>=0 ||
          values.username.indexOf("&")>=0 ||
          values.username.indexOf("*")>=0 ||
          values.username.indexOf("-")>=0 ||
          values.username.indexOf("+")>=0 ||
          values.username.indexOf("=")>=0 ||
          values.username.indexOf("/")>=0 ||
          values.username.indexOf(".")>=0 ||
          values.username.indexOf("(")>=0 ||
          values.username.indexOf(")")>=0 ||
          values.username.indexOf("{")>=0 ||
          values.username.indexOf("}")>=0 ||
          values.username.indexOf("[")>=0 ||
          values.username.indexOf("]")>=0 ||
          values.username.indexOf("?")>=0 ||
          values.username.indexOf("<")>=0 ||
          values.username.indexOf(">")>=0 ){
          this.setState({error:"Username cannot contain special characters"});
        }
        else{
          this.props.onAuth(values.username, values.password);
        }}
    });
  }
  render() {
    if(this.props.isAuthenticated===true){
      window.location.href="/events/";
    }
    let errorMessage = null;
    if(this.props.error){
      errorMessage = (<p>{this.props.error.message}</p>);
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
        {errorMessage}{this.state.error}
        {
          this.props.loading ?
              <Spin indicator = {antIcon}/>
            :
              <Form onSubmit={this.handleFormSubmit} className="login-form">
                <Form.Item>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                  })(<Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Username"/>,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                  })(<Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="Password"/>,
                  )}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                  </Button> Or <a href="/signup/"> Signup</a>
                </Form.Item>
              </Form>
        }
      </div>
    );
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(CustomForm);
const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.token !==null
  }
}
const mapDispatchToProps =dispatch => {
  return {
    onAuth: (username, password)=> dispatch(actions.authLogin(username, password))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(WrappedNormalLoginForm);