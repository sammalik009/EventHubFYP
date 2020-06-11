import React from 'react';
import { List, Button } from 'antd';
import {Card} from 'react-bootstrap';
import axios from 'axios';

const handleDelete=(id)=>{
    axios.delete(`http://127.0.0.1:8000/event/api/Images/${id}`)
    .then(res=>{
        window.location.reload();
    });
}
const Images = (props) =>{
    return(
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
            grid={{ gutter: 16, column: 4,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 4,
                xl: 4,
                xxl: 4,
             }}
            renderItem={(item, index) => (              
                <List.Item
                    key={item.title}
                    actions={[
                        <div>
                        {
                            parseInt(localStorage.getItem('user'))!==props.user ?
                            <span/>
                            :
                            <Button type="primary" onClick={()=>handleDelete(item.id)}>Delete</Button>
                        }</div>,
                    ]}>
                    <Card>
                        <Card.Body>
                        <Card.Img variant="top" src={`http://127.0.0.1:8000${item.image}`} height={300} width={270} />
{
    /*                            <img
                                height={272}
                                width={272}
                                alt="logo"
                                src={`http://127.0.0.1:8000${item.image}`}
                            />
*/
}
                        </Card.Body>
                    </Card>
                </List.Item>
            )}
        />
    );
}

export default Images;