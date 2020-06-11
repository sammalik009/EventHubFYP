import React from 'react';
import { Route } from 'react-router-dom';
import MyEventList from './containers/MyEventListView';
import RegistrationList from './containers/RegistrationListView';
import Profile from './components/Profile';
import OrganizerForm from './components/OrganizerForm';
import UserRequests from './containers/UserRequests';
import EditProfile from './components/EditProfile';
const BaseRouter2 = () => (
    <div>
        <Route exact path='/profile/registrations/' component={RegistrationList}></Route>
        <Route exact path='/profile/requests/' component={UserRequests}></Route>
        <Route exact path='/profile/my_events/' component={MyEventList}></Route>
        <Route exact path='/profile/' component={Profile}></Route>
        <Route exact path='/profile/edit_profile/' component={EditProfile}></Route>
        <Route exact path='/profile/organizerForm' component={OrganizerForm}></Route>
    </div>
);

export default BaseRouter2;