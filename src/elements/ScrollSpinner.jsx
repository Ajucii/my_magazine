import styled from "styled-components";
import CircularProgress from '@mui/material/CircularProgress';


const ScrollSpinner = (props) => {
    const { type, size, is_dim } = props;

    return (

        <SpinnerWrap type={type} is_dim={is_dim}>
            <CircularProgress color="inherit" />
        </SpinnerWrap>

    );
};

ScrollSpinner.defaultProps = {
    type: "inline", // inline, page
    is_dim: false,
    size: 60,
};

const SpinnerWrap = styled.div`
  opacity: 0.3;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  ${(props) =>
        props.type === "page"
            ? `position: fixed;
        height: 95vh;
        top: 0;
        left: 0;
        padding: 0;
        zIndex: 9999;`
            : ``}
  ${(props) =>
        props.is_dim
            ? `
      background: rgba(0,0,0,0.4); 
      height: 100vh;
  `
            : ``}
`;

export default ScrollSpinner;
