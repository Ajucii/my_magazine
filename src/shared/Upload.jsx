import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as imageActions } from "../redux/modules/image";


const Upload = (props) => {

    const fileInput = useRef();
    const dispatch = useDispatch();
    const is_uploading = useSelector((state) => state.image.uploading);

    const selectFile = (e) => {

        const reader = new FileReader();
        const file = fileInput.current.files[0];

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            dispatch(imageActions.setPreview(reader.result));
        };
    };



    return (
        <>
            <input style={{ marginTop: "20px" }} type="file" ref={fileInput} onChange={selectFile} disabled={is_uploading} />
        </>
    );
};

export default Upload;