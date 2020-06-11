import React from 'react';
import { Route } from 'react-router-dom';
import EventList from './containers/EventListView';
import EventDetail from './containers/EventDetailView';
import SignupForm from './components/SignupForm';
import LoginForm from './components/Form';
import EventForm from './components/EventForm';
import MyEventList from './containers/MyEventListView';
import RequestList from './containers/RequestListView';
import NotificationList from './containers/NotificationsListView';
import MyEventDetail from './containers/MyEventDetailView';
import RegistrationList from './containers/RegistrationListView';
import RegistrationDetail from './containers/RegistrationDetailView';
import OrganizerForm from './components/OrganizerForm';
import ActivateUser from './components/ActivateUser';
import Attendence from './components/Attendence';
import UserProfile from './components/UserProfile';
import App2 from './App2';
//import App2 from './containers/App2';
import App3 from './App3';
import App4 from './App4';
import EventRequestPage from './components/EventRequestPage';
const BaseRouter = () => (
    <div>
        <Route exact path='/' component={EventList}></Route>
        <Route exact path='/signup/' component={SignupForm}></Route>
        <Route exact path='/login/' component={LoginForm}></Route>
        <Route exact path='/events/' component={EventList}></Route>
        <Route exact path='/registrations/' component={RegistrationList}></Route>
        <Route exact path='/requests/' component={RequestList}></Route>
        <Route exact path='/notifications/' component={NotificationList}></Route>
        <Route exact path='/event/myEvents/' component={MyEventList}></Route>
        <Route exact path='/event/myEvents/:eventID/' component={MyEventDetail}></Route>
        <Route exact path='/event/addEvent/' component={EventForm}></Route>
        <Route exact path='/events/:eventID/' component={EventDetail}></Route>
        <Route exact path='/User/:UID/activate/' component={ActivateUser}></Route>
        <Route exact path='/User/:UID/event/:eventID/attendence/' component={Attendence}></Route>
        <Route exact path='/registrations/:rID/' component={RegistrationDetail}></Route>
        <Route exact path='/organizerForm/' component={OrganizerForm}></Route>
        <Route exact path='/request/:rID/' component={EventRequestPage}></Route>
        <Route exact path='/user_profile/:uID/' component={UserProfile}></Route>
        <Route exact path='/profile/' component={App2}></Route>
        <Route exact path='/profile/event/addEvent/' component={App2}></Route>
        <Route exact path='/profile/registrations/' component={App2}></Route>
        <Route exact path='/profile/my_events/' component={App2}></Route>
        <Route exact path='/profile/organizerForm' component={App2}></Route>
        <Route exact path='/profile/requests/' component={App2}></Route>
        <Route exact path='/profile/edit_profile/' component={App2}></Route>
        <Route exact path='/myEvents/:eventID/' component={App3}></Route>
        <Route exact path='/myEvents/:eventID/mark_attendence/' component={App3}></Route>
        <Route exact path='/myEvents/:eventID/registrations/' component={App3}></Route>
        <Route exact path='/myEvents/:eventID/payments/' component={App3}></Route>
        <Route exact path='/myEvents/:eventID/update/' component={App3}></Route>
        <Route exact path='/myEvents/:eventID/images/' component={App3}></Route>
        <Route exact path='/myEvents/:eventID/attendees/' component={App3}></Route>
        <Route exact path='/admin/users/' component={App4}></Route>
        <Route exact path='/admin/organizers/' component={App4}></Route>
        <Route exact path='/admin/admins/' component={App4}></Route>
        <Route exact path='/admin/events/' component={App4}></Route>
        <Route exact path='/admin/events/happening_today/' component={App4}></Route>
        <Route exact path='/admin/events/happened/' component={App4}></Route>
        <Route exact path='/admin/events/approved/' component={App4}></Route>
    </div>
);

export default BaseRouter;