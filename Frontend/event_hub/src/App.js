import React from 'react';
import 'antd/dist/antd.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseRouter from './routes';
import CustomLayout from './containers/LayoutsFolder/Layout';
//import CustomLayout from './containers/Layout';
import * as actions from './store/actions/auth';


class App extends React.Component {
  componentDidMount(){
    this.props.onTryAutoSignup(); 
  }
  render(){
    return (
      <div className="App">
        <Router>
          <CustomLayout {...this.props}>
            <BaseRouter/>
          </CustomLayout>
        </Router>
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


export default connect(mapStateToProps, mapDispatchToProps)(App);
