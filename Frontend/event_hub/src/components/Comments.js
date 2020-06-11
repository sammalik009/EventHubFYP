import React from 'react';
import { Avatar, Input, Comment } from 'antd';
import Replies from './Replies';
import axios from 'axios';

const { Search } = Input;

const handleReplySubmit = (id, text, event) => {
    if(!localStorage.getItem('user'))window.location.href = '/login/';
    if(text.length>0){
        axios.post('http://127.0.0.1:8000/comment/api/Comments/add_reply/',{
            event:event,
            text:text,
            comment:id,
            user: parseInt(localStorage.getItem('user'))
        })
        .then(res =>{
            window.location.reload(false)
        });
    }
  };

const handleCommentSubmit = (text, event) => {
    if(!localStorage.getItem('user'))window.location.href = '/login/';
    if(text.length>0){
        axios.post('http://127.0.0.1:8000/comment/api/Comments/add_comment/',{
            event:event,
            text:text,
            user: parseInt(localStorage.getItem('user'))
        })
        .then(res =>{
            window.location.reload(false)
        });
    }
}
const Comments = (props) =>{
    return(
        <div>
            {props.comments.map(function(item, index){
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
                    <Replies replies={props.replies[index]} />
                    <Search
                        placeholder="Add a reply"
                        enterButton="Save"
                        size="large"
                        onSearch={value => handleReplySubmit(item.id,value, item.event)}
                    />
                </Comment>
            })}
            <br/>
                    <Search
                        placeholder="Add a comment"
                        enterButton="Save"
                        size="large"
                        onSearch={value => handleCommentSubmit(value, props.event)}
                    />
            </div>
    );
}
export default Comments;