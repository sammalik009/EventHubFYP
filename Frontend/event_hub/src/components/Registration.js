import React from 'react';
import { List } from 'antd';

class Registrations extends React.Component{
    render(){ 
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
                dataSource={this.props.data}
                grid={{ gutter: 16, column: 4,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 3,
                    xl: 4,
                    xxl: 4,
                    }}
                renderItem={item => (
                <List.Item style={{borderColor: 'black',}}
                    key={item.event_title}
                >
                    
                    <List.Item.Meta
                    title={<a href={`/registrations/${item.id}/`}><h3>{item.event_title}</h3></a>}
                    />
                    <p>{item.voucher_code}</p>
                </List.Item>
                )}
            />
        );
    }
}

export default Registrations;