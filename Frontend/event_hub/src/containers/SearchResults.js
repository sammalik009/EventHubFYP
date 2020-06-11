import React from 'react';
import { List, Icon, Button, Row, Col, Avatar } from 'antd';//, Avatar
import {Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 4 }} />
      <span style={{ marginRight: 8 }}>{text}</span>
    </span>
);
class SearchResults extends React.Component {
    state = {
        users:[],
        events:[],
        images:[]
    }
    componentDidMount(){
        console.log(this.props.match.params.text);
        axios.post('http://127.0.0.1:8000/event/api/Events/search/',{
            user:1,
            search:this.props.match.params.text
        })
        .then(res =>{
            this.setState({
                users:res.data.users,
                events:res.data.events,
                images:res.data.images
            })
            console.log(res.data)});
    }
    render(){
    return(
        
        <div className="gutter-example">
          <h1>Users</h1>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
            onChange: page => {
                console.log(page);
            },
            pageSize: 12,
            }}
            dataSource={this.state.users}
            grid={{ gutter: 20, column: 2,
              xs: 2,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
           }}
            renderItem={(item, index) => (
            <List.Item
                key={item.title}
                >
                    <h4><a href={`/user_profile/${item.id}/`}>{item.username.toUpperCase()}(
                        {
                    item.is_organizer?<span>Organizer</span>:<span>User</span>})</a></h4>
            </List.Item>
            )}
        />
        <br/>
        <h1>Events</h1>
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
            onChange: page => {
                console.log(page);
            },
            pageSize: 12,
            }}
            dataSource={this.state.events}
            grid={{ gutter: 20, column: 2,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 4,
           }}
            renderItem={(item, index) => (
            <List.Item
                key={item.title}
                avatar={
                      <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        alt="Han Solo"
                      />
                    }>
                <Card style={{ width: '15rem' }}>
                    <Card.Img variant="top" src={`http://127.0.0.1:8000${this.state.images[index].image}`} height={300} width={270} />
                    <List.Item.Meta  
                    title={
                        parseInt(localStorage.getItem('user'))!==item.user ?
                            <a href={`/events/${item.id}/`}><h3>{item.title}</h3></a>
                        :
                            <a href={`/myEvents/${item.id}/`}><h3>{item.title}</h3></a>
                        }
                    />  
                    <Card.Body>
                        <i>{item.category}</i>
                        <Card.Text>
                            <IconText type="star-o" text={item.total_tickets} key="list-vertical-star-o" />
                            <IconText type="like-o" text={item.price_ticket} key="list-vertical-like-o" />
                            <IconText type="message" text={item.sold_tickets} key="list-vertical-message" />
                        </Card.Text>
                        {
                            parseInt(localStorage.getItem('user'))!==item.user ?
                            <Button type="primary"><Link to={`/events/${item.id}/`}>Register</Link></Button>
                            :
                            <Button type="primary"><Link to={`/myEvents/${item.id}/`}>Details</Link></Button>
                        }
                    </Card.Body>  
                </Card>
            </List.Item>
            )}
        />
      </div>
    );
}
}

export default SearchResults;