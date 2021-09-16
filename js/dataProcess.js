var vm = new Vue({
	el: '#app',
	data: {
		taglist:[],
		mdfileContent:"",
		menuList:[
			{
				menuName:"笔记",
				id:"gr54r",
				target:""
			},
			{
				menuName:"博客",
				id:"ylidje4r",
				target:"https://www.cnblogs.com/simpleMirror/"
			},
			{
				menuName:"其他",
				id:"hh3ts",
				target:""
			}
			,]
	},
	mounted() {
		this.getJsonContents()
		
	},
	methods: {
		// 切换标签并更换显示内容
		changeTagcontent(id){
			// this.HlightNav(id) //根据url判断nav是否高亮
			for (let item of this.taglist) {
				if(item.id === id){
					window.history.replaceState("","","?" + id)
					// this.getMdFile(item.filename)
					$.get("./" + item.filename, (mdString, status) => {
						this.mdfileContent = marked(mdString)
						// console.log(this.mdfileContent)
						//this.setCodeTageClass()   //设置高亮类
						// console.log(this.mdfileContent)
					})
					// this.mdfileContent = marked(this.getMdFile(item.filename)) 
				}
			}
			
		},
		//引入json目录
		getJsonContents(){
			// 这里有个奇怪的现象，用../ 找不到文件，用  ./ 又能找到文件
			$.get("./contents/mdfileContents.json", (data, status) => {
				// console.log(data)
				this.taglist = data
				this.changeTagcontent(this.taglist[0].id)
				window.history.replaceState("","","?id=" + this.taglist[0].id)
				// this.HlightNav(this.taglist[0].id) //根据url判断nav是否高亮
			})
		},
		// 给侧边栏标签添加高亮
		HlightNav(id){
			let urlParams = window.location.search
			console.log(urlParams.indexOf(id))
			if(id == urlParams){
				return "isActive"
			}else{
				return "notActive"
			}
			
		},
		// 给code标签添加高亮
		setCodeTageClass(){
			let allCode = document.querySelectorAll("code")
			allCode.forEach((itemCodeTag)=>{
				itemCodeTag.setAttribute("class","language-html")
			})
			console.log("----------------执行--------------------------")
		}

		

	}
})
