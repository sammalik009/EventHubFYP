import React from 'react';
import { Comment, Avatar } from 'antd';

const Replies = (props) =>{
    return(
        <div>
            {props.replies.map(function(item, index){
                return <Comment key={index}
                    avatar={
                      <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        alt="Han Solo"
                      />
                    }
                    content={
                      <div><b><a href={`/user_profile/${item.id}/`}>{item.username}</a></b>
                    <p>{item.text}</p></div>
                    }>
                </Comment>
            })}
        </div>
    );
}

export default Replies;