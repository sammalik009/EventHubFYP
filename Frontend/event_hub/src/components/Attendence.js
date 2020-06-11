import React from 'react';
import axios from 'axios';
import {Card} from 'react-bootstrap';
  
class Attendence extends React.Component{

    state = {
        marked : null,
        user: []
    }
    componentDidMount(){
        const UID = this.props.match.params.UID;
        const eventID = this.props.match.params.eventID;
        axios.post('http://127.0.0.1:8000/user/api/Users/mark_attendence/',{
            user:UID,
            event:eventID
        })
        .then(res =>{
            this.setState({
                marked: res.data.status==="T",
                user : res.data.user
            });
        })
        .catch();
    }
    render (){
        return (
            <div>
               {
                    this.state.marked ? 
                       <Card>
                          <Card.Body>
                              <Card.Title><h1>Congratulations {this.state.user.username} Your attendece has been marked</h1></Card.Title>
                          </Card.Body>
                        </Card>
                    :
                        <Card>
                            <Card.Body>
                                <Card.Title><h1>Sorry {this.state.user.username} Your attendece cannot be marked</h1></Card.Title>
                            </Card.Body>
                        </Card>
               }
            </div>
        );
    }
}

export default Attendence;