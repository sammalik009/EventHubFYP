import React from 'react';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import BaseRouter4 from './routes4';
import OverviewLayout from './containers/OverviewLayout';
import * as actions from './store/actions/auth';


class App2 extends React.Component {
  componentDidMount(){
    this.props.onTryAutoSignup(); 
  }
  render(){
    return (
      <div className="App">
          <OverviewLayout {...this.props}>
            <BaseRouter4/>
          </OverviewLayout>
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
