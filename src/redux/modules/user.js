import { createAction, handleActions } from "redux-actions";
import { actionCreators as postActions } from "./post";
import { produce } from "immer";


import axios from "axios";


const LOG_OUT = "LOG_OUT";
const SET_USER = "SET_USER";
const P_LOADING = "P_LOADING";


// 액션 생성 함수
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));
const p_loading = createAction(P_LOADING, (p_loading) => ({ p_loading }));

const token = sessionStorage.getItem('token');

const initialState = {
    user_info: {
        nickname: '',
        isAdmin: false,
        userProfile: '',
    },
    is_login: false,
    p_loading: false,
};



// 로그인 미들웨어
const loginBK = (nickname, pwd, imageUrl = "") => {
    return function (dispatch, getState, { history }) {

        // 페이지 로딩 시작
        dispatch(p_loading(true));
        let _paging = getState().post.paging;

        axios({
            method: 'post',
            url: 'http://junehan-test.shop/api/users/login',
            data: {
                nickname: nickname,
                password: pwd,
            }
        }).then((response) => {

            const user_info = {
                nickname: response.data.data.nickname,
                isAdmin: response.data.data.isAdmin,
                userProfile: imageUrl,
            }
            // 로그인 시 받아온 유저정보와 토큰 설정
            sessionStorage.setItem('token', response.data.data.token);
            dispatch(setUser(user_info));
            // dispatch(postActions.getPostBK(_paging.start));
            history.push('/');

            // 페이지 로딩 끝
            dispatch(p_loading(false));

        }).catch((err) => {
            dispatch(p_loading(false));
            window.alert("아이디 혹은 비밀번호가 틀렸습니다.")
            console.log(err.message);
        })
    }
}


// 회원가입 미들웨어
const signupBK = (nickname, pwd, pwd2) => {
    return function (dispatch, getState, { history }) {

        axios({
            method: 'post',
            url: 'http://junehan-test.shop/api/users/register',
            data: {
                nickname: nickname,
                password: pwd,
                confirmPassword: pwd2,
            }

        }).then((response) => {
            // 회원가입에 성공하면 바로 로그인한 상태로 메인페이지 이동
            dispatch(loginBK(nickname, pwd))
            history.push('/');

        }).catch((err) => {
            window.alert("회원가입에 실패했습니다.")
            console.log(err.message);
        })
    }
}


// 로그인 체크 미들웨어(새로고침 시에도 로그인 유지되게)
const loginCheck = () => {
    return function (dispatch, getState, { history }) {

        axios({
            method: 'get',
            url: 'http://junehan-test.shop/api/users/auth',
            headers: {
                authorization: `Bearer ${token}`,
            }
        }).then(function (response) {
            const user_info = {
                nickname: response.data.data.nickname,
                isAdmin: response.data.data.isAdmin,
                userProfile: ""
            }
            dispatch(setUser(user_info))
        }).catch((err) => {
            console.log(err.message);
        })
    }
}


// 로그아웃 미들웨어
const logOutBK = () => {
    return function (dispatch, getState, { history }) {


        // let is_like = getState().post.paging;

        sessionStorage.removeItem('token');
        dispatch(logOut());
        history.push('/');
    }
}



// 유저 리듀서
export default handleActions({
    [SET_USER]: (state, action) => produce(state, (draft) => {
        draft.user_info = action.payload.user;
        console.log(draft.user_info);
        draft.is_login = true;
    }),

    [LOG_OUT]: (state, action) => produce(state, (draft) => {
        draft.user_info = null;
        draft.is_login = false;
    }),

    [P_LOADING]: (state, action) => produce(state, (draft) => {
        draft.p_loading = action.payload.p_loading;
    }),

}, initialState);



//action creator export
const actionCreators = {
    logOut,
    logOutBK,
    loginBK,
    signupBK,
    loginCheck,
    setUser,
};

export { actionCreators };