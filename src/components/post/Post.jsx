import { Grid, Image, Text, Button } from "../../elements/index"
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { useSelector, useDispatch } from "react-redux";
import { history } from "../../redux/configStore";
import like_icon from "../../like_icon.png";
import unlike_icon from "../../unlike_icon.png";
import { actionCreators as postActions } from "../../redux/modules/post"



const Post = (props) => {


    const post_id = props.postId;
    const is_login = useSelector(state => state.user.is_login);
    const dispatch = useDispatch();


    const likeToggle = () => {

        if (!is_login) {
            window.alert("로그인이 필요한 서비스입니다.")
            history.replace('/login');
            return;
        }
        dispatch(postActions.likePostBK(post_id))
    }


    return (

        <Grid>
            <Grid is_flex >
                <CardHeader
                    avatar={
                        <Avatar src="https://i.postimg.cc/Zq3qBrgR/june.jpg">
                        </Avatar>
                    }
                    title={props.nickname}
                    subheader={props.createdAt}
                />

                <Grid width="auto" margin="0px 15px">
                    {props.is_me && <Button

                        text="수정" margin="2px" width="60px" _onClick={() => {
                            history.push(`/write/${props.postId}`);
                        }}>
                    </Button>
                    }
                    {props.is_me && <Button

                        text="삭제" margin="2px" width="60px" _onClick={() => {
                            if (window.confirm("삭제하시겠습니까?")) {
                                dispatch(postActions.deletePostBK(props.postId));
                            }
                        }}>
                    </Button>
                    }
                </Grid>
            </Grid>


            {props.layout === "top" && (
                <Grid
                    _onClick={(e) => {
                        history.push(`/post/${props.postId}`)
                    }}>
                    <Image shape="rectangle" src={props.imageUrl} />
                    <Grid padding="16px 0px 5px 16px">
                        <Text>{props.content}</Text>
                    </Grid>
                </Grid>
            )}
            {props.layout === "bottom" && (
                <Grid
                    _onClick={(e) => {
                        history.push(`/post/${props.postId}`)
                    }}>
                    <Grid padding="16px 0px 5px 16px">
                        <Text>{props.content}</Text>
                    </Grid>
                    <Image shape="rectangle" src={props.imageUrl} />
                </Grid>
            )}
            {props.layout === "left" && (
                <Grid

                    is_flex
                    _onClick={(e) => {
                        history.push(`/post/${props.postId}`)
                    }}
                >
                    <Image cursor="pointer" shape="rectangle" src={props.imageUrl} />
                    <Grid padding="16px 0px 5px 16px">
                        <Text>{props.content}</Text>
                    </Grid>
                </Grid>
            )}
            {props.layout === "right" && (
                <Grid
                    is_left
                    _onClick={(e) => {
                        history.push(`/post/${props.postId}`)
                    }}>
                    <Image cursor="pointer" shape="rectangle" src={props.imageUrl} />
                    <Grid padding="16px 0px 5px 16px">
                        <Text>{props.content}</Text>
                    </Grid>
                </Grid>
            )}

            <Grid padding="0px 0px 20px 10px">
                {props.isLike && is_login ?
                    <button
                        style={{ background: "none", border: "none", margin: "10px 0px 0px 0px", cursor: "pointer" }}
                        onClick={likeToggle}>
                        <img
                            style={{ width: "30px" }}
                            src={like_icon} />
                    </button> :
                    <button
                        style={{ background: "none", border: "none", margin: "10px 0px 0px 0px", cursor: "pointer" }}
                        onClick={likeToggle}>
                        <img
                            style={{ width: "30px" }}
                            src={unlike_icon} />
                    </button>}
                <Text margin="5px" bold>좋아요 {props.likeCnt}개</Text>
                <Text margin="5px" bold>댓글 {props.commentCnt}개</Text>
            </Grid>



        </Grid>
    )
}


Post.defaultProps = {

    userId: 1,
    nickname: "june",
    postId: 3,
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    imgUrl: "https://i.postimg.cc/Zq3qBrgR/june.jpg",
    layout: "top",
    likeCnt: 5,
    commentCnt: 5,
    createdAt: "2020-04-13 10:00:00",
    isLike: false,

};

export default Post;

