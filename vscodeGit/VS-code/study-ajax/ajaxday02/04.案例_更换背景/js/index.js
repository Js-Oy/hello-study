/**
 * 目标：网站-更换背景
 *  1. 选择图片上传，设置body背景
 *  2. 上传成功时，"保存"图片url网址
 *  3. 网页运行后，"获取"url网址使用
 * */
const url=localStorage.getItem('url')
if(url) document.body.style.backgroundImage=`url${url}`

document.querySelector('#bg').addEventListener('change',e=>{
    const fd=new FormData()
    fd.append('img',e.target.files[0])
    axios({
        url:'http://hmajax.itheima.net/api/uploadimg',
        method:'post',
        data:fd 
    }).then(res=>{
        // console.log(res);
        localStorage.setItem('url',res.data.data.url)
        document.body.style.backgroundImage=`url${res.data.data.url}`
        // document.querySelector('img').src=res.data.data.url
    })
})