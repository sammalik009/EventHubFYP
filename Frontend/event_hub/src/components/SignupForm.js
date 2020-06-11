import React from 'react';
import { Form, Input, Button, Icon } from 'antd';
//import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

class SignupForm extends React.Component {

    state = {
        confirmDirty: false,
      };
      handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
      };
    
      compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
          callback('Two passwords that you enter is inconsistent!');
        } else {
          callback();
        }
      };
    
      validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      };
      handleSubmit = e => {
        e.preventDefault();
      };
      
      handleFormSubmit= (event)=>{
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              this.props.onAuth(values.username, values.email, values.password, values.confirm);
              window.location.href = '/login/';
            }
          });
    };
    
  render() {
    if(this.props.isAuthenticated===true){
      window.location.href="/events/";
    }
    const { getFieldDecorator } = this.props.form;
        return (
              <Form onSubmit={this.handleFormSubmit} style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                <Form.Item>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                      },
                      {
                        required: true,
                        message: 'Please input your E-mail!',
                      },
                    ],
                  })(<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email"
                />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                      {
                        validator: this.validateToNextPassword,
                      },
                    ],
                  })(<Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Password"
                />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('confirm', {
                    rules: [
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      {
                        validator: this.compareToFirstPassword,
                      },
                    ],
                  })(<Input.Password onBlur={this.handleConfirmBlur} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Password"
                />)}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Signup
                  </Button> Or
                  <NavLink to='/login/'> Login</NavLink>
                </Form.Item>
              </Form>
        );
        }
}
  
  
const WrappedRegistrationForm = Form.create()(SignupForm);
const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.token!==null
  }
}

const mapDispatchToProps =dispatch => {
  return {
    onAuth: (username,email, password1, password2)=> dispatch(actions.authSignup(username, email,password1,password2))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(WrappedRegistrationForm);
