import React, { useEffect, useState } from "react";
import { Grid, Text, Image } from "../elements"
import Card from "../components/Card";

import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";


const Notification = (props) => {

    const user_info = useSelector(state => state.user.user_info);
    const [noti, setNoti] = useState([]);

    useEffect(() => {
        if (!user_info) {
            return;
        }

        const notiDB = realtime.ref(`noti/${user_info.nickname}/list`);
        const _noti = notiDB.orderByChild("insert_dt");

        _noti.once("value", snapshot => {
            if (snapshot.exists()) {
                let _data = snapshot.val();
                console.log(_data);

                // 역순으로 
                let _noti_list = Object.keys(_data).reverse().map(s => {
                    return _data[s];
                })

                console.log(_noti_list);
                setNoti(_noti_list);
            }
        })

    }, [user_info]);


    return (
        <React.Fragment>
            <Grid padding="16px" bg="#EFF6FF">
                {noti.map((n, index) => {
                    console.log(n);
                    return (
                        <Card {...n} key={`noti_${index}`}></Card>
                    )
                })}

            </Grid>
        </React.Fragment>
    )
}

export default Notification;