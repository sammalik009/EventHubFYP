import React from 'react';
import { List, Avatar, Icon } from 'antd';

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

const Events = (props) =>{
    return(
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
            onChange: page => {
                console.log(page);
            },
            pageSize: 3,
            }}
            dataSource={props.data}
            renderItem={item => (
            <List.Item
                key={item.title}
                actions={[
                    <IconText type="star-o" text={item.total_tickets} key="list-vertical-star-o" />,
                    <IconText type="like-o" text={item.price_ticket} key="list-vertical-like-o" />,
                    <IconText type="message" text={item.sold_tickets} key="list-vertical-message" />,
                    <IconText type="message" text={item.user} key="list-vertical-message" />,
                ]}
                extra={
                    <img
                        width={272}
                        alt="logo"
                        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"/>
                }
            >
                <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a href={`/events/${item.id}/`}>{item.category}</a>}
                    description={item.description}/>
                {item.content}
            </List.Item>
            )}
        />
    );
}

export default Events;