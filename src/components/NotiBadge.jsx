import { Badge } from "@material-ui/core";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { realtime } from "../shared/firebase";
import { actionCreators as userActions } from "../redux/modules/user";

function NotiBadge(props) {

    const [is_read, setIsRead] = useState(true);
    const user_nickname = useSelector(state => state.user.user_info.nickname);
    const dispatch = useDispatch();

    console.log(user_nickname);

    const notiCheck = () => {
        const notiDB = realtime.ref(`noti/${user_nickname}`);
        notiDB.update({ read: true });

        props._onClick();
    }



    // 함수형 컴포넌트에서 리스너 구독하기
    useEffect(() => {

        if (user_nickname === "") {
            return;
        }

        const notiDB = realtime.ref(`noti/${user_nickname}`);
        notiDB.on("value", (snapshot) => {

            console.log(snapshot.val());
            console.log(snapshot.val().read);
            setIsRead(snapshot.val().read);

        });
        // 구독 해제
        return () => notiDB.off();

    }, [user_nickname]);


    return (
        <Badge
            color="secondary"
            variant="dot"
            invisible={is_read}
            onClick={notiCheck}>
            <NotificationsIcon />

        </Badge>
    )
}


NotiBadge.defaultProps = {
    _onClick: () => { },
}


export default NotiBadge