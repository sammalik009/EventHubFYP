import React from 'react';
import { Route } from 'react-router-dom';
import MyEventDetail2 from './containers/MyEventDetailView2';
import MyEventRegistrations from './containers/MyEventRegistrations';
import MyEventPayments from './containers/MyEventPayments';
import MyEventAttendees from './containers/MyEventAttendees';
import UpdateEvent from './containers/UpdateEvent';
import AttendencePage from './components/AttendencePage';
const BaseRouter3 = () => (
    <div>
        <Route exact path='/myEvents/:eventID/' component={MyEventDetail2}></Route>
        <Route exact path='/myEvents/:eventID/mark_attendence/' component={AttendencePage}></Route>
        <Route exact path='/myEvents/:eventID/registrations/' component={MyEventRegistrations}></Route>
        <Route exact path='/myEvents/:eventID/payments/' component={MyEventPayments}></Route>
        <Route exact path='/myEvents/:eventID/attendees/' component={MyEventAttendees}></Route>
        <Route exact path='/myEvents/:eventID/update/' component={UpdateEvent}></Route>
    </div>
);

export default BaseRouter3;