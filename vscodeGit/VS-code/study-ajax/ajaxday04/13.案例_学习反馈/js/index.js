/**
 * 目标1：完成省市区下拉列表切换
 *  1.1 设置省份下拉菜单数据
 *  1.2 切换省份，设置城市下拉菜单数据，清空地区下拉菜单
 *  1.3 切换城市，设置地区下拉菜单数据
 */

//1.1
axios({
    url:'http://hmajax.itheima.net/api/province'
}).then(res=>{
    const list=res.data.list
    // console.log(list);
    document.querySelector('.province').innerHTML+=list.map(item=>{
        return` <option value="${item}">${item}</option>`
    }).join('')
})
//1.2
document.querySelector('.province').addEventListener('change',async e=>{
    // console.log(e.target.value);
    document.querySelector('.city').innerHTML+=''
    document.querySelector('.area').innerHTML+=''
    const {data:{list}}= await axios({
                url:'http://hmajax.itheima.net/api/city',
                method:'get',
                params:{
                    pname:e.target.value
                }
            })
            console.log(list);
    document.querySelector('.city').innerHTML+=list.map(item=>{
        return`<option value="${item}">${item}</option>`
    }).join('')
})
//1.3
document.querySelector('.city').addEventListener('change',async e=>{
    // console.log(e.target.value);
    document.querySelector('.area').innerHTML+=''
    const pname=document.querySelector('.province').value
    const {data:{list}}= await axios({
                url:'http://hmajax.itheima.net/api/area',
                method:'get',
                params:{
                    pname:pname,
                    cname:e.target.value
                }
            })
            // console.log(data);
    document.querySelector('.area').innerHTML+=list.map(item=>{
        return`<option value="${item}">${item}</option>`
    }).join('')
})
//1.4.提交功能
//事件绑定
document.querySelector('.submit').addEventListener('click',async()=>{
    const form=document.querySelector('.info-form')
    const data=serialize(form,{hash:true,empty:true})
    try{
        const res=await axios({
            url:'http://hmajax.itheima.net/api/feedback',
            method:'post',
            data
        })
        alert(res.data.message)
    }catch(err){
        // console.log(err);
        alert(err.response.data.message)
    }
    // console.log(res);
})