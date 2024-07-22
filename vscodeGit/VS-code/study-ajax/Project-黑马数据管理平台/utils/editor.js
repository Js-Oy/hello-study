// 富文本编辑器
// 创建编辑器函数，创建工具栏函数
const { createEditor, createToolbar } = window.wangEditor

const editorConfig = {
    placeholder: '发布文章的内容...',
    //编辑器变化时回调函数
    onChange(editor) {
      const html = editor.getHtml()
    //   console.log('editor content', html)
      // 也可以同步到 <textarea>
      //为了后续快速收集表单中的内容
      document.querySelector('.publish-content').value=html
    }
}

const editor = createEditor({
    selector: '#editor-container',
    html: '<p><br></p>',
    config: editorConfig,
    mode: 'default', // or 'simple'
})

const toolbarConfig = {}

const toolbar = createToolbar({
    editor,
    selector: '#toolbar-container',
    config: toolbarConfig,
    mode: 'default', // or 'simple'
})