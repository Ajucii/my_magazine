
import styled from "styled-components"
import CircularProgress from '@mui/material/CircularProgress';

// 페이지가 로딩상태(P_LOADING)일 때 페이지 로딩 스피너 컴포넌트
const PageSpinner = () => {

    return (
        <Outter>
            <CircularProgress color="inherit" />
        </Outter>
    )
}

const Outter = styled.div`
    background: white;
    opacity: 0.3;
    width : 100%;
    height: 100%;
    border-radius: 10px;
    position: fixed;
    display : flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transition:all 1s;
`;


export default PageSpinner;