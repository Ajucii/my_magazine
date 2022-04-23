import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

// user의 리듀서
import User from "./modules/user";
import Post from "./modules/post";
import Image from "./modules/image";
import Comment from "./modules/comment";


// 히스토리 객체 생성
export const history = createBrowserHistory();


// 루트 리듀서 (리듀서 모음)
const rootReducer = combineReducers({
    user: User,
    post: Post,
    image: Image,
    comment: Comment,

    // 리럭스에 넣어주기. 그럼 history와 라우터가 연결되고 스토어에 저장됨.
    router: connectRouter(history),
});


// 액션생성 함수 실행 후 reducer가 실행되기 전 단계에서 history를 사용할 수 있음.
// 비동기 다녀와서 .then하고 히스토리를 받아다가 사용 가능.
const middlewares = [thunk.withExtraArgument({ history: history })];


// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;


// 개발환경에서는 로거라는 걸 하나만 더 써볼게요.
if (env === "development") {
    const { logger } = require("redux-logger");
    middlewares.push(logger);
}

// 브라우저일때만 redux DevTools 사용하기
const composeEnhancers =
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
        : compose;


// 미들웨어 묵어쭈기
const enhancer = composeEnhancers(
    applyMiddleware(...middlewares)
);


// 스토어 만들기
let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();