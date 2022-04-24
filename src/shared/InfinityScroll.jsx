import React, { useCallback, useEffect } from "react";
import _ from "lodash";
import ScrollSpinner from "../elements/ScrollSpinner";


const InfinityScroll = (props) => {

    const { children, callNext, is_next, loading } = props;

    const _handleScroll = _.throttle(() => {

        if (loading) {
            return;
        }
        const { innerHeight } = window;
        const { scrollHeight } = document.body;

        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

        if (scrollHeight - innerHeight - scrollTop < 100) {
            callNext();
        }
    }, 700);

    const handleScroll = useCallback(_handleScroll, [loading]);


    // 처음 로드가 됐을 때 이벤트를 달아주기
    useEffect(() => {
        if (loading) {
            return;
        }

        if (is_next) {
            window.addEventListener("scroll", handleScroll);
        } else {

            window.removeEventListener("scroll", handleScroll);
        }
        // 함수형 컴포넌트에서 구독취소하는 방법. (클린업) 함수형 컴포넌트가 화면에서 사라질때 return에 있는 구문이 실행.
        return () => window.removeEventListener("scroll", handleScroll)
    }, [is_next, loading]);


    return (
        <>
            {props.children}
            {is_next && (<ScrollSpinner />)}
        </>
    )
}

InfinityScroll.defaultProps = {
    children: null,
    callNext: () => { },
    is_next: false,
    loading: false,
}

export default InfinityScroll;

