import React from 'react';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import BaseRouter3 from './routes3';
import CustomLayout3 from './containers/LayoutsFolder/Layout3';
//import CustomLayout3 from './containers/Layout3';
import * as actions from './store/actions/auth';


class App2 extends React.Component {
  componentDidMount(){
    this.props.onTryAutoSignup(); 
  }
  render(){
    return (
      <div className="App">
          <CustomLayout3 {...this.props}>
            <BaseRouter3/>
          </CustomLayout3>
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
