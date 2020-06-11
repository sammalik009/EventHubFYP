import React from 'react';
import axios from 'axios';
import {Card} from 'react-bootstrap';
  
class ActivateUser extends React.Component{

    state = {
        activated : null,
        user: []
    }
    componentDidMount(){
        const UID = this.props.match.params.UID;
        axios.post('http://127.0.0.1:8000/user/api/Users/activate/',{
            user:UID
        })
        .then(res =>{
            this.setState({
                activated: res.data.status==="T",
                user : res.data.user
            });
        })
        .catch();
    }
    render (){
        return (
            <div>
               {
                    this.state.activated ? 
                       <Card>
                          <Card.Body>
                              <Card.Title><h1>Congratulations {this.state.user.username} Your account has been activated. You can Login now</h1></Card.Title>
                          </Card.Body>
                        </Card>
                    :
                        <Card>
                            <Card.Body>
                                <Card.Title><h1>Sorry {this.state.user.username} Your Request Cannot be processed</h1></Card.Title>
                            </Card.Body>
                        </Card>
                
               }
            </div>
        );
    }
}

export default ActivateUser;