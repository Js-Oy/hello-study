/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */
const creator = '韭菜'
const list = document.querySelector('.list')

//1.封装一个函数，用来渲染界面
const render = () => {
    //1.1请求表达式：
    axios({
        url: 'http://hmajax.itheima.net/api/books',
        method: 'get',
        params: {
            creator
        }
    }).then(res => {
        // console.log(res.data.data);
         const { data } = res.data
        //1.2渲染界面
        list.innerHTML = data.map((item,index) => {
            const {id ,bookname,author,publisher}=item//es6写法，
            return `<tr>
          <td>${index + 1}</td>
          <td>${item.bookname}</td>
          <td>${item.author}</td>
          <td>${item.publisher}</td>
          <td data-id=${id}>
            <span class="del">删除</span>
            <span class="edit">编辑</span>
          </td>
        </tr>`
        })
    })
}
//加载页面
render()

//目标2：新增图书
//2.1点击添加按钮，弹出模态框， 进行属性控制
    const addBtn=document.querySelector('.add-btn')//保存按钮类名
    const addForm=document.querySelector('.add-form')//新增表单里面的数据
    const addmodalDom=document.querySelector('.add-modal')
    const addmodal=new bootstrap.Modal(addmodalDom)
    addBtn.addEventListener('click',e=>{
        //2.2获取数据：使用serialize 查看接口文档
        const data=serialize(addForm,{hash:true,empty:true})
        // console.log(data);
        //2.3判断数据是否为空
        if(!data.author||!data.bookname||!data.publisher){
            return alert('请输入完整的数据')
        }
        //2.4根据axios发送请求
        axios({
            url:'http://hmajax.itheima.net/api/books',
            method:'post',
            data:{
                creator,
                ...data

            }
        }).then(res =>{
            //2.5渲染页面：添加成功，关闭弹窗，清空表单
            // console.log(res);
            addmodal.hide()//先关闭弹窗
            render()//渲染界面
            addForm.reset()//清空表单
        })
        

    })

//目标3：删除图书
//3.1给删除按钮添加绑定事件 》删除按钮为后追加的元素，所以不能直接获取，需要给父级元素添加事件委托
    list.addEventListener('click',e=>{
        //3.1.1判断点击的是不是删除这个元素，用list.classList.contains()
        //删除时还需要用到他的id值，在函数渲染时修改
        //const {target,target:{parentNode:{dataset}}}=e//简要写法，只用解一次
        const { target }=e
        if(target.classList.contains('del')){
            const {parentNode:{dataset}}=target
            console.log(dataset.id); //3.2获取当前数据的id值
            //3.3根据接口要求发送请求，删除数据
            axios({
                //删除，用path路径参数，要将参数写在url后面
                url:`http://hmajax.itheima.net/api/books/${dataset.id}`,
                method:'delete'

            }).then(res=>{
                // console.log(res);
                alert(res.data.message)
                //3.4重新渲染页面
                render()
            })

        }
    })

//目标4：编辑图书
//4.1显示编辑弹框，可以编辑图书 =》由于需要进行数据修改，所以应该用js控制逻辑
    const editModal=document.querySelector('.edit-modal')
    const edit=new bootstrap.Modal(editModal)
    const editForm=document.querySelector('.edit-form')
    list.addEventListener('click',e=>{
        const {target,target:{parentNode:{dataset}}}=e//es6解
        //判断点击的是不是这个元素
        if(target.classList.contains('edit')){
            console.log(dataset.id);
            
            //4.2要修改的数据可以在编辑表单中显示 = 》可以根据图书的id来获取图书详情
            const id=dataset.id
            edit.show()
            //4.3保存修改后的数据 = 》将最新的数据发送给服务器
            axios({
                url:`http://hmajax.itheima.net/api/books/${dataset.id}`,
                method:'get',
            }).then(res=>{
                // console.log(res);
                /*方案一：经过解构后，将表单中的每一个数据进行赋值，但是比较繁琐 
                const{id,bookname,author,publisher}=res.data.data
                editForm.querySelector('[name=bookname]').value=bookname 
                。。。。。。省略
                */
                //方案二：较为巧妙、
                const {data}=res.data//获取的是一个对象，包含表单中的每个元素
                const arr=Object.keys(data)//获取的是对象的所有键，且以数组形式展现
                arr.forEach(item=>{
                    editForm.querySelector(`[name=${item}]`).value=data[item] 

                })
                
            })
        }
    })

//4.4点击编辑的按钮，修改按钮，将最新的数据发送给服务器，修改数据
document.querySelector('.edit-btn').addEventListener('click',e=>{
    //方案二：
    //4.4.1通过serialize方式获取修改后表单中的数据
    const data=serialize(editForm,{hash:true,empty:true})
    //4.4.2通过axios方式发送数据给服务器
    axios({
        url:`http://hmajax.itheima.net/api/books${data.id}`,
        method:'put',
        data:{
            creator,
            ...data
        }
    }).then(res =>{
        //4.4.4渲染页面：修改成功，关闭弹窗
        // console.log(res);
        edit.hide()//先关闭弹窗
        render()//渲染界面
        edit.reset()//清空表单
    })
    /* 
    //类似于添加数据的方式
    //4.4.1获取数据：使用serialize 查看接口文档
    const data=serialize(editForm,{hash:true,empty:true})
    // console.log(data);
    //4.4.2判断数据是否为空
    if(!data.author||!data.bookname||!data.publisher){
        return alert('修改后数据不完整')
    }
    //4.4.3根据axios发送请求
    axios({
        url:'http://hmajax.itheima.net/api/books',
        method:'post',
        data:{
            creator,
            ...data

        }
    }).then(res =>{
        //4.4.4渲染页面：修改成功，关闭弹窗
        // console.log(res);
        edit.hide()//先关闭弹窗
        render()//渲染界面
    }) */
})






