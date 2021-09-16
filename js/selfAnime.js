let floatNav = document.getElementById("flexLeft")
let distanceClientTop = floatNav.getBoundingClientRect().top
// console.log(distanceClientTop)
// header部分滚动完就浮动nav
function floatNavFun() {
	// console.log("滚动", floatNav.getBoundingClientRect().top)
	if (floatNav.getBoundingClientRect().top < 0) {
		console.log("浮", floatNav.getBoundingClientRect().top)
		// floatNav.style.cssText = "position: fixed;left: 20px;top: 10vh;"
		floatNav.setAttribute("class","elFloatLeft")
		document.removeEventListener("scroll", floatNavFun)
	}
}
document.addEventListener("scroll", floatNavFun)


let interSe = new IntersectionObserver((entrise,observer)=>{
	// console.log(entrise)
	entrise.forEach(i=>{
		// console.log(i.intersectionRect.bottom)
		console.log(i.isIntersecting)
		// 此处代表头部已经显示，取消掉fixed，并加上滚动监听，防止往下滑的时候没有fixed的效果
		if (i.isIntersecting) {
			console.log("显示")
			floatNav.setAttribute("class","")
			document.addEventListener("scroll", floatNavFun)
		}
	})
})

let headerBox = document.getElementById("header")
interSe.observe(headerBox)
