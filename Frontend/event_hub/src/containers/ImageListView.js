import React from 'react';
import axios from 'axios';
import Images from '../components/Images'
class ImageList extends React.Component{

    state = {
        events : [],
        images:[]
    }
    componentDidMount(){
        const eventID = this.props.match.params.eventID;
        axios.post(`http://127.0.0.1:8000/event/api/Events/get_event/`,{
      event: eventID
    })
    .then(res =>{
        this.setState({
            event: res.data.event,
            images:res.data.images
      });
    })
    .catch();
    }
    render (){      
        return (
            <Images data={this.state.images} user={this.state.event.user}/>);
    }
}

export default ImageList;