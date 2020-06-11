import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () =>{
    return {
        type: actionTypes.AUTH_START
    }
}


export const authSuccess = token =>{
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token
    }
}


export const authFail = error =>{
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const checkAuthTimeout = expirationDate => {
    return dispatch =>{
        setTimeout(()=> {
            dispatch(logout());
        }, expirationDate * 1000)
    }
}

export const logout = () =>{
    localStorage.removeItem('user');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    localStorage.removeItem('is_organizer');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('username');
    return {
        type:actionTypes.AUTH_LOGOUT
    };
}
export const authLogin = (username, password) =>{
    return dispatch =>{
        dispatch(authStart());
        axios.post('http://127.0.0.1:8000/rest-auth/login/',{
            username:username,
            password:password
        })
        .then(res => {
            const token = res.data.token;
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            if(res.data.user.is_verified===true){
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('user', res.data.user.pk);
                localStorage.setItem('is_organizer', res.data.user.is_organizer);
                localStorage.setItem('is_admin', res.data.user.is_admin);
                localStorage.setItem('username', res.data.user.username);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout(3600));    
            }
            else{
                dispatch(logout());
            }
        })
        .catch(err => {
            dispatch(authFail(err));
        });
    }
}

export const authSignup = (username, email,password1, password2) =>{
    return dispatch =>{
        dispatch(authStart());
        axios.post('http://127.0.0.1:8000/rest-auth/registration/',{
            username:username,
            email:email,
            password1:password1,
            password2:password2
        })
        .then(res => {
            dispatch(logout());
        })
        .catch(err => {
            dispatch(authFail(err));
        });
    }
}

export const authCheckState = () => {
    return dispatch=>{
        const token = localStorage.getItem('token');
        if (token === undefined){
            dispatch(logout);
        }
        else{
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate <= new Date()){
                dispatch(logout);
                dispatch(authStart);
            }
            else {
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout((expirationDate.getTime()-new Date().getTime())/1000));
            }
        }
    }
}