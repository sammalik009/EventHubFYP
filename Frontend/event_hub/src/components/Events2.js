import React from 'react';
import { List, Icon, Button, Row, Col } from 'antd';
import {Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 4 }} />
      <span style={{ marginRight: 8 }}>{text}</span>
    </span>
);
const Events2 = (props) =>{
    return(
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
                    title={<a href={`/events/${item.id}/`}><h3>{item.title}</h3></a>}/>  
                    <Card.Body>
                        <i>{item.category}</i>
                        <Card.Text>
                            {
                                item.status === 'HAPPENED' ?
                                <span>Rating : {props.feedback[index]}</span>
                                :
                                <span>{item.status}</span>
                            }
                            <br/>
                            <IconText type="star-o" text={item.total_tickets} key="list-vertical-star-o" />
                            <IconText type="like-o" text={item.price_ticket} key="list-vertical-like-o" />
                            <IconText type="message" text={item.sold_tickets} key="list-vertical-message" />
                        </Card.Text>
                          {
                            item.status === 'HAPPENED' ?
                            <Button type="primary"><Link to={`/events/${item.id}/`}>View</Link></Button>
                            :
                            <Button type="primary"><Link to={`/events/${item.id}/`}>Register</Link></Button>
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

export default Events2;