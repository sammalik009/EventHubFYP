import React from 'react';
import { List, Icon, Button, Row, Col } from 'antd';//, Avatar
import {Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 4 }} />
      <span style={{ marginRight: 8 }}>{text}</span>
    </span>
);
const Events = (props) =>{
    return(
/*        <List
            itemLayout="vertical"
            size="large"
            pagination={{
            onChange: page => {
                console.log(page);
            },
            pageSize: 20,
            }}
            dataSource={props.data}
            grid={{ gutter: 16, column: 4,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 4,
                xl: 4,
                xxl: 4,
             }}
            footer={
                <div>
                    <b>EventHub </b> ©2020 Created by Usama Industries
                </div>
            }
            renderItem={(item, index) => (              
                <List.Item
                    key={item.title}
                    actions={[
                        <IconText type="star-o" text={item.total_tickets} key="list-vertical-star-o" />,
                        <IconText type="like-o" text={item.price_ticket} key="list-vertical-like-o" />,
                        <IconText type="message" text={item.sold_tickets} key="list-vertical-message" />,
                        <div>
                        {
                            parseInt(localStorage.getItem('user'))!==item.user ?
                            <Button type="primary"><Link to={`/events/${item.id}/`}>Register</Link></Button>
                            :
                            <Button type="primary"><Link to={`/event/myEvents/${item.id}/`}>Details</Link></Button>
                        }</div>,
                    ]}>                
                    <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={
                        parseInt(localStorage.getItem('user'))!==item.user ?
                            <a href={`/events/${item.id}/`}><h3>{item.title}</h3></a>
                        :
                            <a href={`/event/myEvents/${item.id}/`}><h3>{item.title}</h3></a>
                        }
                    description={item.category}/>
                    <Card>
                        <Card.Body>
                            <img
                                height={272}
                                width={272}
                                alt="logo"
                                src={`http://127.0.0.1:8000${props.images[index].image}`}
                            />
                            <Card.Title><h4>{item.venue}</h4></Card.Title>
                        </Card.Body>
                    </Card>
                </List.Item>
            )}
        />*/
        
        <div className="gutter-example">
        <Row >
          <Col className="gutter-row" span={1}>         
          </Col>
         <Col className="gutter-row" span={23}>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
            onChange: page => {
                console.log(page);
            },
            pageSize: 12,
            }}
            dataSource={props.data}
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
                key={item.title}>
                <Card style={{ width: '15rem' }}>
                    <Card.Img variant="top" src={`http://127.0.0.1:8000${props.images[index].image}`} height={300} width={270} />
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
          </Col>
        </Row>
      </div>
    );
}

export default Events;