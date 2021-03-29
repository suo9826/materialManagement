//接口统一是这种返回格式
interface = {
    success: Boolean,
    msg: '',//需要提示的信息
    data: '',//可以是数组，字符串，对象
    total: 0,//当data是数组时返回
}

//所有的list都是post接口
//参数统一是，如果有额外的参数加在里面
params = {
    pageNum: Number,
    filter: String,
    ...extraParams
}

//大类
bigclass = {
    create: {
        path: '/class/big/create',
        params: { name: '', desc: "" }
    },
    delete: {
        path: '/class/big/delete',
        params: { ids: [] }
    },
    update: {
        path: '/class/big/update',
        params: { id: '', name: '', desc: '' }//可能还会有别的，只取自己需要的
    },
    list: {
        path: '/class/big/list',
        response: {
            id: '',
            name: '',
            desc: '',
            owner: '',
            time: ''
        }
    }
}

//小类
smallclass = {
    create: {
        path: '/class/small/create',
        params: { name: '', desc: '', pid: '' }
    },
    delete: {
        path: '/class/small/delete',
        params: { ids: [] }
    },
    update: {
        path: '/class/small/update',
        params: { id: '', name: '', desc: '' }
    },
    list: {
        path: '/class/small/list',
        response: [
            {
                id: '',
                name: '',
                desc: '',
                pidName: '',
                owner: '',
                time: ''
            }
        ]
    }
}
