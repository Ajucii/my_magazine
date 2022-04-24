
import styled from "styled-components";

const Button = (props) => {

    const { width, height, text, _onClick, children, is_footer, is_edit, margin, disabled, position, zIndex, verticalAlign } = props;

    const styles = {
        width: width,
        height: height,
        margin: margin,
        position: position,
        zIndex: zIndex,
        verticalAlign: verticalAlign,
    }

    if (disabled) {
        return (
            <DisabledButton disabled={disabled} {...styles}>{text ? text : children}</DisabledButton>
        )
    }

    if (is_footer) {
        return (
            <FooterButton onClick={_onClick}>{text ? text : children}</FooterButton>
        )
    }

    if (is_edit) {
        return (
            <EditButton {...styles} onClick={_onClick}>{text ? text : children}</EditButton>
        )
    }


    return (
        <ElButton {...styles} onClick={_onClick}>{text ? text : children}</ElButton>
    )
}



Button.defaultProps = {
    text: false,
    children: null,
    _onClick: () => { },
    is_float: false,
    margin: false,
    width: '100%',
    height: '100%',
    disabled: false,
    position: null,
    zIndex: null,
}

const EditButton = styled.button`
    
    width : ${(props) => props.width};
    height : ${(props) => props.height};
    background-color: #212121;
    color : #ffffff;
    padding : 8px 0px;
    box-sizing: border-box;
    border : none;
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')};
    ${(props) => (props.position ? `position: ${props.position};` : '')};
    ${(props) => (props.zIndex ? `z-index: ${props.zIndex};` : '')};
    cursor: pointer;

`;

const ElButton = styled.button`

    width : ${(props) => props.width};
    height : ${(props) => props.height};
    background-color: #212121;
    color : #ffffff;
    padding : 12px 0px;
    box-sizing: border-box;
    vertical-align: middle;
    border : none;
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')};
    ${(props) => (props.position ? `position: ${props.position};` : '')};
    ${(props) => (props.zIndex ? `z-index: ${props.zIndex};` : '')};
    cursor: pointer;
`;


const DisabledButton = styled.button`

    width : ${(props) => props.width};
    height : ${(props) => props.height};
    background-color: #C5C5C5;
    color : #ffffff;
    padding : 12px 0px;
    box-sizing: border-box;
    border : none;
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')};
`;


const FooterButton = styled.button`
    margin: auto;
    width: 60px;
    height: 32px;
    border-radius: 20px;
    border:none;
    background: linear-gradient( 45deg, tomato, red );
    color: white;
    font-size: 20px;
    font-weight:lighter;
    cursor: pointer;
`;


export default Button;