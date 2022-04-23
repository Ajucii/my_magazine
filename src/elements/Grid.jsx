import styled from "styled-components";

const Grid = (props) => {

    const {
        is_flex,
        is_left,
        width,
        maxWidth,
        minHeight,
        margin,
        padding,
        paddingBottom,
        bg,
        children,
        _onClick,
        cursor,
        center,
        position,
        zIndex,
    } = props;

    const styles = {
        is_flex: is_flex,
        is_left: is_left,
        width: width,
        margin: margin,
        padding: padding,
        paddingBottom: paddingBottom,
        bg: bg,
        maxWidth: maxWidth,
        minHeight: minHeight,
        cursor: cursor,
        center: center,
        position: position,
        zIndex: zIndex,
    };

    return (
        <GridBox {...styles} onClick={_onClick}>{children}</GridBox>
    );
};

Grid.defaultProps = {
    chidren: null,
    is_flex: false,
    is_left: false,
    width: "100%",
    padding: false,
    margin: false,
    maxWidth: false,
    minHeight: false,
    bg: false,
    paddingBottom: false,
    _onClick: () => { },
    center: false,

};

const GridBox = styled.div`
  width: ${(props) => props.width};
  max-width: ${(props) => props.maxWidth};
  min-height: ${(props) => props.minHeight};
  padding-bottom: ${(props) => props.paddingBottom};
  height: 100%;
  box-sizing: border-box;

  ${(props) => (props.cursor ? `cursor: ${props.cursor}` : "")}
  ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  ${(props) => (props.bg ? `background-color: ${props.bg};` : "")}
  ${(props) =>
        props.is_flex
            ? `display: flex; align-items: center; justify-content: space-between; `
            : ""}
  ${(props) =>
        props.is_left
            ? `display: flex; flex-direction : row-reverse; align-items:center `
            : ""}
  ${(props) => (props.center ? `text-align: center;` : "")}
  ${(props) => (props.position ? `position: ${props.position};` : '')};
  ${(props) => (props.zIndex ? `z-index: ${props.zIndex};` : '')};
`;

export default Grid;