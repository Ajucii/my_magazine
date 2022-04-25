import React from "react";
import { useSelector } from "react-redux";


// 헤더에서 로그인 상태인지 아닌지에 따라 변하게끔
const Permit = (props) => {

    const is_login = useSelector(state => state.user.is_login);
    const is_session = sessionStorage.getItem('token');


    if (is_login && is_session) {
        return <React.Fragment>{props.children}</React.Fragment>;
    }

    return null;
}

export default Permit;