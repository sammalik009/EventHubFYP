import React from 'react';
import axios from 'axios';
import {
    Form,
    Input,
    Icon,
    Button,
    Spin
  } from 'antd';
  
  class EditProfile extends React.Component {
    state= {
        user:{},
        organizer:{},
        loading : true
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(values.address!==this.state.organizer.address || values.phone_number!==this.state.organizer.phone_number || values.cnic!==this.state.organizer.cnic){
                    const address=values.address!==undefined?values.title:this.state.event.title;
                    const cnic=values.cnic!==undefined?values.event_date:this.state.event.event_date;
                    const phone_number=values.phone_number!==undefined?values.venue:this.state.event.venue;
                    axios.post('http://127.0.0.1:8000/user/api/Organizers/update_organizer/',{
                        address :address,
                        cnic : cnic,
                        phone_number :phone_number,
                        user : localStorage.getItem("user"),
                    })
                    .then(res =>{
                        window.location.reload(false);
                    })
                    .catch();
                }
            }
        });
      }
    componentDidMount(){
      axios.post('http://127.0.0.1:8000/user/api/Users/get_user/',{
          user:parseInt(localStorage.getItem('user'))
      })
      .then(res=>{
          this.setState({
            user:res.data.user,
            organizer:res.data.organizer,
            loading : false
          })
      })
  }
    render() {
      if(localStorage.getItem("token")){
        if(localStorage.getItem("is_organizer")==="false"){
          window.location.href="/profile/";
        }
      }
      else{
        window.location.href="/login/";
      }
      const { getFieldDecorator } = this.props.form;
      return (
        <div>
          { this.state.loading? 
          <Spin size='large'/>
          :
        <Form onSubmit={this.handleSubmit}>
            <Form.Item label="Address">
            {getFieldDecorator('address', { initialValue:this.state.organizer.address,
                rules: [{ required: true, message: 'Please input address!' }],
            })(
                <Input
                prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Address"
                />,
            )}
            </Form.Item>
            <Form.Item label="CNIC">
            {getFieldDecorator('cnic', { initialValue:this.state.organizer.cnic ,
                rules: [{ required: true, message: 'Please input CNIC!' }],
            })(
                <Input
                prefix={<Icon type="bank" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="CNIC"
                />,
            )}
            </Form.Item>
            <Form.Item label="Phone Number">
            {getFieldDecorator('phone_number', {initialValue:this.state.organizer.phone_number,
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
  
const WrappedRegistrationForm = Form.create()(EditProfile);
export default WrappedRegistrationForm;
