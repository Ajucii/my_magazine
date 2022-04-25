import { createAction, handleActions } from "redux-actions";
import produce from "immer";


const UPLOAD_IMAGE = "UPLOAD_IMAGE";
const SET_PREVIEW = "SET_PREVIEW";


const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({ image_url }));
const setPreview = createAction(SET_PREVIEW, (preview) => ({ preview }));


const initialState = {
    image_url: "http://via.placeholder.com/400x300",
    uploading: false,
    preview: null,
};


export default handleActions(
    {
        [UPLOAD_IMAGE]: (state, action) => produce(state, (draft) => {
            draft.image_url = action.payload.image_url;
            draft.uploading = false;
        }),

        [SET_PREVIEW]: (state, action) => produce(state, (draft) => {
            draft.preview = action.payload.preview;
        }),
    },
    initialState
);

const actionCreators = {
    uploadImage,
    setPreview,
};

export { actionCreators };