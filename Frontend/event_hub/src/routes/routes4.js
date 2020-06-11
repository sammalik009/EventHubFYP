import React from 'react';
import { Route } from 'react-router-dom';
import AdminUsers from './components/AdminUsers';
import AdminOrganizers from './components/AdminOrganizers';
import AdminEvents from './components/AdminEvents';
import Admins from './components/Admins';
import AdminEventsH from './components/AdminEventsH';
import AdminEventsHT from './components/AdminEventsHT';
import AdminEventsA from './components/AdminEventsA';
const BaseRouter3 = () => (
    <div>
        <Route exact path='/admin/users/' component={AdminUsers}></Route>
        <Route exact path='/admin/organizers/' component={AdminOrganizers}></Route>
        <Route exact path='/admin/admins/' component={Admins}></Route>
        <Route exact path='/admin/events/' component={AdminEvents}></Route>
        <Route exact path='/admin/events/happening_today/' component={AdminEventsHT}></Route>
        <Route exact path='/admin/events/happened/' component={AdminEventsH}></Route>
        <Route exact path='/admin/events/approved/' component={AdminEventsA}></Route>
    </div>
);

export default BaseRouter3;