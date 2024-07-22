/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */
async function setChannels(){
    const res=await axios({
        url:'/v1_0/channels',
        method:'get'
    })
    // console.log(res);
    
    const htmlStr=res.data.channels.map(item=>{
        return `<option value="${item.id}">${item.name}</option>`
    }).join('')
    // console.log(htmlStr);
    document.querySelector('.form-select').innerHTML+=htmlStr
}
setChannels()
/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */
document.querySelector('.img-file').addEventListener('change',async e=>{
    // console.dir(e.target);
    const imgStr=e.target.files[0]
    const fd=new FormData()
    fd.append('image',imgStr)
    const res=await axios({
        url:'/v1_0/upload',
        method:'post',
        data:fd
    })
    // console.log(res);
    const imgUrl=res.data.url
    document.querySelector('.rounded').src=imgUrl
    document.querySelector('.rounded').classList.add('show')
    document.querySelector('.place').classList.add('hide')
})
//点击img可以重新选择图片,重新调用img-file的点击事件
document.querySelector('.rounded').addEventListener('click',()=>{
    document.querySelector('.img-file').click()
})
/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */
document.querySelector('.send').addEventListener('click',async e=>{
    if(e.target.innerHTML!=='发布') return
    const form=document.querySelector('.art-form')
    const data=serialize(form,{hash:true,empty:true})
    delete data.id
    data.cover={
        type:1,
        images:[document.querySelector('.rounded').src]
    }    
    // console.log(data);
    try{
        const res= await axios({
            url:'/v1_0/mp/articles',
            method:'post',
            data:data
        })
        myAlert(true,'发布成功')
        form.reset()//reset只能清空表单元素的内容，背景封面和文本域需要继续设置
        document.querySelector('.rounded').src=''
        document.querySelector('.rounded').classList.remove('show')
        document.querySelector('.place').classList.remove('hide')
        editor.setHtml('')//wangEditor插件中赋予的清空文本域的方法
        setTimeout(() => {
            location.href='../content/index.html'
        }, 1500);
    }catch(error){
        myAlert(false,error.response.data.message)
    }
})
/**
 * 目标4：编辑-回显文章
 *  4.1 页面跳转传参（URL 查询参数方式）
 *  4.2 发布文章页面接收参数判断（共用同一套表单）
 *  4.3 修改标题和按钮文字
 *  4.4 获取文章详情数据并回显表单
 */
;(function(){
    // console.log(location.search);
    const paramsStr=location.search
    const params=new URLSearchParams(paramsStr)
    params.forEach(async (value,key)=>{
        // console.log(value);
        if(key==='id'){//当前有需要被编辑的文章id传过来
            document.querySelector('.title span').innerHTML='修改文章'
            document.querySelector('.send').innerHTML='修改'
            //基于数据进行数据回显
            const res= await axios({
                url:`/v1_0/mp/articles/${value}`,
                method:'get'
            }) 
            //创造一个数组用来存储自己想要的数据            
            const {data}=res
            // console.log(data);
            const dataHtr={
                channel_id:data.channel_id,
                title:data.title,
                rounded:data.cover.images[0],
                content:data.content,
                id:data.id
            }
            //遍历数据对象的属性，映射到页面元素上，快速赋值
            Object.keys(dataHtr).forEach(key=>{
                if(key==='rounded'){
                    //进行是否有封面判断，有封面，进行渲染，没有封面则不管
                    if(dataHtr[key]){
                        document.querySelector('.rounded').src=dataHtr[key]
                        document.querySelector('.rounded').classList.add('show')
                        document.querySelector('.place').classList.add('hide')
                    }

                }else if(key==='content'){
                    editor.setHtml(dataHtr[key])
                }else{
                    document.querySelector(`[name=${key}]`).value=dataHtr[key]
                }
            })
        }
    })
})();
/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */
document.querySelector('.send').addEventListener('click',async e=>{
    
        if(e.target.innerHTML!=='修改') return
        const form=document.querySelector('.art-form')
        const data=serialize(form,{hash:true,empty:true})                                                             
         try{ const res=await axios({
            url:`/v1_0/mp/articles/${data.id}`,
            method:'put',
            data:{
                ...data,
                cover:{
                    type:document.querySelector('.rounded').src?1:0,
                    images:[document.querySelector('.rounded').src]
                }
            }
        }) 
        console.log(res);
        myAlert(true,'修改文章成功')
        setTimeout(() => {
            location.href='../content/index.html'
        }, 1500);
        // listHtml()
    }catch(err){
        console.log(err);
        myAlert(false,err.response.data.message)
       
    }
        
        
    
})