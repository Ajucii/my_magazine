import styled from "styled-components"



const Image = (props) => {

    const { shape, src, size } = props;


    const styles = {
        src: src,
        size: size,

    }

    if (shape === "circle") {
        return (
            <ImageCircle {...styles}></ImageCircle>
        )
    }

    if (shape === "rectangle") {
        return (
            <AspectOutter>
                <AspectInner {...styles}></AspectInner>
            </AspectOutter>
        )
    }

    if (shape === "preview") {
        return (
            <AspectOutter>
                <Preview {...styles}></Preview>
            </AspectOutter>
        )
    }

    return null;
}

Image.defaultProps = {
    shape: "circle",
    src: "https://i.postimg.cc/Zq3qBrgR/june.jpg",
    size: 36,
};

const AspectOutter = styled.div`
    width:100%;
    min-width: 250px;
    cursor: pointer;
    
`;

const AspectInner = styled.div`
    /* position: relative; */
    padding-top : 75%;
    overflow: hidden;
    background-image: url("${(props) => props.src}");
    background-size : cover;
`;

const Preview = styled.div`
   /* position: relative; */
    padding-top : 75%;
    overflow: hidden;
    background-image: url("${(props) => props.src}");
    background-size : cover;
`;


const ImageCircle = styled.div`
    --size: ${(props) => props.size}px;
    width : var(--size);
    height : var(--size);
    border-radius: var(--size);
    background-image: url("${(props) => props.src}");
    background-size : cover;
    margin: 4px;
`;



export default Image;