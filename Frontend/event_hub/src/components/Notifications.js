import React from 'react';
import { List, Button } from 'antd';
import axios from 'axios';

const handleClick = (id, read, event, notification_type) =>{
    if(read===false){
        axios.post('http://127.0.0.1:8000/notification/api/Notifications/read_notification/',{
            notification:id
        })
        .then(res=>{
            axios.post('http://127.0.0.1:8000/event/api/Events/get_event/',{
                event:event
            })
            .then(res=>{
                if(notification_type==="USER"){
                    window.location.href= `/events/${res.data.event.id}/`;
                }
                else if(notification_type==="ORGANIZER"){
                    window.location.href= `/myEvents/${res.data.event.id}/`;
                }
                else if(notification_type === "PROFILE"){
                    window.location.href = '/profile/'
                }
                else if(notification_type === "COMMENT" || notification_type === "COMMENT_1" || notification_type === "COMMENT_2"){    
                    if(res.data.event.user !== parseInt(localStorage.getItem('user'))){
                        window.location.href= `/events/${res.data.event.id}/`;
                    }
                    else{
                        window.location.href= `/myEvents/${res.data.event.id}/`;
                    }
                }
                else{
                    window.location.reload();
                }
            });
        })
        .catch();
    }
    else{
        axios.post('http://127.0.0.1:8000/event/api/Events/get_event/',{
            event:event
        })
        .then(res=>{
            if(notification_type==="USER"){
                window.location.href= `/events/${res.data.event.id}/`;
            }
            else if(notification_type==="ORGANIZER"){
                window.location.href= `/myEvents/${res.data.event.id}/`;
            }
            else if(notification_type === "PROFILE"){
                window.location.href = '/profile/'
            }
            else if(notification_type === "COMMENT" || notification_type === "COMMENT_1" || notification_type === "COMMENT_2"){    
                if(res.data.event.user !== parseInt(localStorage.getItem('user'))){
                    window.location.href= `/events/${res.data.event.id}/`;
                }
                else{
                    window.location.href= `/myEvents/${res.data.event.id}/`;
                }
            }
            else{
                window.location.reload();
            }
    });
    }
}
const markAllRead = ()=> {
    axios.post('http://127.0.0.1:8000/notification/api/Notifications/read_all_notifications/',{
        user:parseInt(localStorage.getItem('user'))
    })
    .then(res => {
        window.location.reload();
    })
}
const Notifications = (props) =>{
    return(
        <div>
        <Button onClick={markAllRead} type='primary'>Mark all as read</Button>
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
            onChange: page => {
                console.log(page);
            },
            pageSize: 20,
            }}
            dataSource={props.data}
            renderItem={item => (
            <List.Item
                key={item.event_title}>
                <List.Item.Meta
                color='#000'
                title={
                    <span onClick={()=>handleClick(item.id, item.read, item.event, item.notification_type)}>
                    {
                        item.read===false?
                        <h3 style={{color:'blue'}}><i>{item.event_title}</i></h3>
                        :
                        <h5>{item.event_title}</h5>
                    }
                    </span>
                }
                description={<span onClick={()=>handleClick(item.id, item.read, item.event, item.notification_type)} dangerouslySetInnerHTML={{__html: item.description }}>
                    
                    </span>}
                />
                {/* {item.description}
                */}
            </List.Item>
            )}
        /></div>
    );
}

export default Notifications;