import { Grid, Text, Button } from "../elements";
import { history } from "../redux/configStore"
import styled from "styled-components";
import { useSelector } from "react-redux";

const Footer = (props) => {

    const is_login = useSelector((state) => state.user.is_login);



    return (

        <Wrapper>
            <Grid is_flex>
                <Button _onClick={() => {
                    if (is_login) {
                        history.push('/write')
                    } else {
                        window.alert("로그인이 필요합니다.")
                        history.push('/login')
                    }
                }} is_footer text="+"></Button>
            </Grid>
        </Wrapper>
    )
}


const Wrapper = styled.div`
  background-color: white;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 500px;
  height: 55px;
  border-top: 1px solid #E5E5E5;
`;

export default Footer;