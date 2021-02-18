// 设置背景图片
function setBodyImg(img) {
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPositionX = 'center';
    document.body.style.backgroundPositionY = 'center';
    document.body.style.backgroundImage = 'url(' + img + ')';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
}

// 去除背景图片
function rmBodyImg() {
    document.getElementsByTagName("body")[0].removeAttribute('style');
}

export {
    setBodyImg,
    rmBodyImg,
}