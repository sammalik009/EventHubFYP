import React from 'react';
import { Carousel } from 'antd';

class Carousel1 extends React.Component{
    render(){
        return (
            <div>
                {
                    this.props.status ?
                            <div>
                            <Carousel dotPosition="bottom" autoplay>
                                {this.props.images.map(function(item, index){
                                    return (
                                        <div key={index}>
                                            <img
                                                height={400}
                                                width={750}
                                                alt="logo"
                                                src={`http://127.0.0.1:8000${item.image}`}
                                                />
                                        </div>
                                    )
                                })}
                            </Carousel>
                            </div>
                        :
                        <div>
                                <Carousel dotPosition="bottom" autoplay>
                                    {this.props.images.map(function(item, index){
                                        return (
                                            <div key={index}>
                                                <img
                                                    height={400}
                                                    width={900}
                                                    alt="logo"
                                                    src={`http://127.0.0.1:8000${item.image}`}
                                                    />
                                            </div>
                                        )
                                    })}
                                </Carousel>
                        </div>
                    }
            </div>
        );
    }
}
export default Carousel1;
