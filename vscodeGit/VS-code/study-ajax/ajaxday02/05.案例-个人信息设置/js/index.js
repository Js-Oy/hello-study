/**
 * 目标1：信息渲染
 *  1.1 获取用户的数据
 *  1.2 回显数据到标签上
 * */
//
//1.给用户起别名，获取用户信息
const creator = '韭菜'
const userForm = document.querySelector('.user-form')
const render = () => {
    axios({
        url: 'http://hmajax.itheima.net/api/settings',
        method: 'get',
        params: {
            creator
        }
    }).then(res => {
        // console.log(res);
        const { data } = res.data
        // console.log(data);
        //2.数据回显
        Object.keys(data).forEach(item => {
            //2.1由于数据中图片和性别信息不一致，所以需要进行一些单独小处理
            if (item === 'avatar') {
                document.querySelector('.prew').src=data[item]
            } else if (item === 'gender') {
                document.querySelector(`[name=gender][value=${data[item]}]`).checked=true
            } else {

            }
            // console.log(item);
            // console.log(userForm.querySelector(`[name="${item}"]`));
            userForm.querySelector(`[name="${item}"]`).value = data[item]
        })
    })
}
render()

//目标2：图像更换
//2.1点击按钮，选择图片
document.querySelector('.upload').addEventListener('change',e=>{
    const fd=new FormData
    fd.append('avator',e.target.files[0])
    fd.append('crestor',creator)
    //2.2 axios 上传图片
    axios({
        url:'http://hmajax.itheima.net/api/avator',
        method:'put',
        data:fd
    }).then(res=>{
         //2.3图片回显
        // console.log(res);
        // const {data}=res.data
        toastObj.show()
        document.querySelector('.info-box').innerHTML=res.data.message
        document.querySelector('.prew').src=data.avator
    })
})

//目标3：修改数据并提交
//3.1点击提交按钮，获取全部数据
    const myToast =document.querySelector('.my-tosat')
    const toastObj=new bootstrap.Toast(myToast)
    document.querySelector('.submit').addEventListener('click',e=>{
        const Obj=serialize(userForm,{hash:true,empty:true})
        Obj.creator=creator
        Obj.gender=+Obj.gender
        axios({
            url:'http://hmajax.itheima.net/api/settings',
            method:'put',
            data:Obj
        }).then(res=>{
            console.log(res);
            toastObj.show()
            document.querySelector('.info-box').innerHTML=res.data.message
        }).catch(err=>{
            console.log(err);
        })
    })
//3.2修改数据
//3.3提交数据
//3.4回显数据


