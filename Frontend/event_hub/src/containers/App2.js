import React from 'react';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import BaseRouter2 from '../routes2';
import CustomLayout2 from './Layout2';
import * as actions from '../store/actions/auth';


class App2 extends React.Component {
  componentDidMount(){
    this.props.onTryAutoSignup(); 
  }
  render(){
    return (
      <div className="App">
          <CustomLayout2 {...this.props}>
            <BaseRouter2/>
          </CustomLayout2>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !==null,
    isOrganizer:localStorage.getItem("is_organizer"),
    isAdmin:localStorage.getItem("is_admin")
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App2);
