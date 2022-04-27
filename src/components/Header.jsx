import { useDispatch, useSelector } from "react-redux";
import { Grid, Text, Button } from "../elements";
import { history } from "../redux/configStore"
import { actionCreators as userActions } from "../redux/modules/user";
import NotiBadge from "./NotiBadge";


const Header = () => {

    const is_login = useSelector((state) => state.user.is_login);
    const dispatch = useDispatch();

    const is_session = sessionStorage.getItem('token') ? true : false;



    if (is_session) {
        return (
            <Grid is_flex padding="4px 16px">
                <Grid>
                    <Text margin="0px" size="24px" bold><a style={{ color: "black", fontStyle: "italic" }} href="/">MyMag</a></Text>
                </Grid>
                <NotiBadge _onClick={() => history.push("/noti")} />

                <Grid is_flex width="auto">
                    <Button width="70px" _onClick={() => dispatch(userActions.logOutBK())} text="로그아웃"></Button>
                </Grid>
            </Grid>
        )
    }

    return (

        <Grid is_flex padding="4px 16px">
            <Grid>
                <Text margin="0px" size="24px" bold><a style={{ color: "black", fontStyle: "italic" }} href="/">MyMag</a></Text>
            </Grid>

            <Grid is_flex width="auto">
                <Button margin="0px 5px" width="70px" _onClick={() => history.push('/login')} text="로그인"></Button>
                <Button width="70px" _onClick={() => history.push('/signup')} text="회원가입"></Button>
            </Grid>
        </Grid>


    )
}

export default Header;