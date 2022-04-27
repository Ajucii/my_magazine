
import styled from "styled-components"
import CircularProgress from '@mui/material/CircularProgress';

// 로딩 화면 컴포넌트
const Spinner = () => {

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



export default Spinner;