import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import Post from "../components/post/Post";
import { Grid } from "../elements";


const PostList = (props) => {

    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user_info);



    return (
        <>
            <Grid bg="#f4f4f4" padding="15px 0px 47px 0px">
                <Grid>
                    {post_list.map((p, index) => {
                        if (p.nickname === user_info?.nickname) {
                            return (
                                <Grid
                                    bg="#ffffff"
                                    margin="8px 0px"
                                    key={p.postId}>
                                    <Post {...p} index={index} is_me is_like />
                                </Grid>
                            )
                        } else {
                            return (
                                <Grid
                                    bg="#ffffff"
                                    margin="8px 0px"
                                    key={p.postId}>
                                    <Post {...p} index={index} is_like />
                                </Grid>
                            )
                        }
                    })}
                </Grid>
            </Grid>
            <Footer />
        </>
    )
}




export default PostList;