import React from 'react';
import axios from 'axios';
import {
    Form,
    Input,
    Icon,
    Button,
  } from 'antd';
  
  class OrganizerForm extends React.Component {

    state = {
      request : "NO"
    }
    componentDidMount(){
      let url;
      url='http://127.0.0.1:8000/user/api/OrganizerRequests/get_organizer_request/';
      axios.post(url,{
          user : parseInt(localStorage.getItem('user'))
      })
      .then(res =>{
          this.setState({
              request: res.data.status
          });
      })
      .catch();
  }
  handleDelete = () => {
    let url;
    url='http://127.0.0.1:8000/user/api/OrganizerRequests/delete_organizer_request/';
    axios.post(url,{
        user : parseInt(localStorage.getItem('user'))
    })
    .then(res =>{
      window.location.reload()
    })
    .catch();
  }
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            console.log(values.event_date);
            axios.post('http://127.0.0.1:8000/user/api/Organizers/add_organizer/',{
            address :values.address,
            cnic : values.cnic,
            phone_number :values.phone_number,
            user : parseInt(localStorage.getItem("user"))
        })
        .then(res =>{
            window.location.reload(false);
        })
        .catch();
        }
      });
    };
    render() {
      if(localStorage.getItem("token")){
        if(localStorage.getItem("is_organizer")==="true"){
          window.location.href="/events/";
        }
      }
      else{
        window.location.href="/login/";
      }
      const { getFieldDecorator } = this.props.form;
      return (
        <div>
        {
          this.state.request === "YES"?
          <div>
          <h1>You have a pending request</h1>
          <Button type="danger" htmlType="button" onClick={this.handleDelete}>
              Delete
            </Button>
          </div>
          :
        <Form onSubmit={this.handleSubmit}>
            <Form.Item label="Address">
            {getFieldDecorator('address', {
                rules: [{ required: true, message: 'Please input address!' }],
            })(
                <Input
                prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Address"
                />,
            )}
            </Form.Item>
            <Form.Item label="CNIC">
            {getFieldDecorator('cnic', {
                rules: [{ required: true, message: 'Please input CNIC!' }],
            })(
                <Input
                prefix={<Icon type="bank" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="CNIC"
                />,
            )}
            </Form.Item>
            <Form.Item label="Phone Number">
            {getFieldDecorator('phone_number', {
                rules: [{ required: true, message: 'Please input Phone Number!' }],
            })(
                <Input
                prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Phone Number"
                />,
            )}
            </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
        }</div>
      );
    }
  }
  
const WrappedRegistrationForm = Form.create()(OrganizerForm);
export default WrappedRegistrationForm;
