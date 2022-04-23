import React from "react";
import { useSelector } from "react-redux";


// 헤더에서 로그인 상태인지 아닌지에 따라 변하게끔
const Permit = (props) => {

    const is_login = useSelector(state => state.user.is_login);

    // 세션이 있나 확인합니다
    const is_session = sessionStorage.getItem('token');



    if (is_login && is_session) {
        //props.children - 이 안에 자식노드 있으면 그대로 내보내주는 역할.
        return <React.Fragment>{props.children}</React.Fragment>;
    }

    return null;
}

export default Permit;