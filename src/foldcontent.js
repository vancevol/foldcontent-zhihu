require('./style.css');
(() => {
    class foldcontent {
        constructor(option) {
            const defaultOption = {
                container: document.getElementsByClassName('foldcontent-panel'),
                btnBg: '#eff6fa',
                btnColor: '#0c5897',
                fixBtnBg: '#81baeb',
                fixBtnColor: '#fff',
                fontSize: '12px',
                padding: '5px',
                initialText: '展开',
                fixText: '收起',
                bottom: '15px',
                right: '20px',
                lineHeight: '1'
            };
            for(let defauleKey in defaultOption) {
                if(defaultOption.hasOwnProperty(defauleKey) && !option.hasOwnProperty(defauleKey)) {
                    option[defauleKey] = defaultOption[defauleKey];
                }
            }
            this.container = option.container;
            this.init(option);
        }

        init(option) {
            let doc = document,
                win = window,
                fold = doc.getElementsByClassName('unfold'),
                btnRight = parseInt(option.right),
                initialText = option.initialText,
                fixText = option.fixText;

            let html = `<div class="unfold" style="background-color: ${option.btnBg}; color: ${option.btnColor}; font-size: ${parseInt(option.fontSize) + 'px'};
 line-height: ${option.lineHeight}; right: ${option.right};bottom: ${option.bottom}; padding: ${option.padding};">${option.initialText}</div>`;
            Array.from(this.container).forEach(function (i) {
                i.innerHTML += html;
            });

            for(let i = 0; i < fold.length; i++){
                fold[i].addEventListener('click', (e) => {
                    let target = e.target,
                        part = doc.getElementsByClassName('part-content')[i],
                        all = doc.getElementsByClassName('all-content')[i],
                        btnBottom = parseInt(target.style.padding);
                    if(target.innerHTML !== fixText) {
                        target.innerHTML = fixText;
                        this.toggle(part, all);
                        let panel = target.parentNode,
                            panelWidth = parseInt(window.getComputedStyle(panel,null).getPropertyValue('width')),
                            h = win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight || 0,
                            w = doc.documentElement.getBoundingClientRect().width || 0,
                            // jquery width() 方法, 不包含滚动条宽度 vs document.body.clientWidth == document.body.offsetWidth  window.innerWidth)
                            s = win.pageYOffset || doc.body.scrollTop || doc.documentElement.scrollTop || 0;
                        h = h + s;
                        let t = panel.offsetTop,
                            p = panel.offsetParent;
                        while (p !== null) {
                            t += p.offsetTop;
                            p = p.offsetParent;
                        }
                        t += panel.clientHeight;
                        let right = (w - panelWidth) / 2 + btnRight > btnRight ?
                        (w - panelWidth) / 2 + btnRight : btnRight,
                            allContent = document.getElementsByClassName('all-content')[i],
                            allShow = allContent.style.display;
                        if (h - t < btnBottom) {
                            let fixBtn = doc.querySelector('.fix-btn');
                            if (fixBtn) {
                                this.changeStyle(fixBtn, option);
                            }
                            target.style.right = right + 'px';
                            this.changeFix(target, option);
                            if (allShow === 'block') {
                                target.classList.add('slide-btn')
                            }
                        }
                        let cb = {
                            onscroll: () => {
                                let h = win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight || 0,
                                    w = doc.documentElement.getBoundingClientRect().width || 0,
                                    s = win.pageYOffset || doc.body.scrollTop || doc.documentElement.scrollTop || 0;
                                h = h + s;
                                let t = panel.offsetTop,
                                    p = panel.offsetParent;
                                while (p !== null) {
                                    t += p.offsetTop;
                                    p = p.offsetParent;
                                }
                                let th = t + panel.clientHeight,
                                    right = (w - panelWidth) / 2 + btnRight > btnRight ?
                                    (w - panelWidth) / 2 + btnRight : btnRight,
                                    allContent = document.getElementsByClassName('all-content')[i],
                                    allShow = allContent.style.display;

                                if (th - h > 0 && h - t > 90 && target.innerHTML !== initialText) {
                                    target.style.right = right + 'px';
                                    this.changeFix(target, option);
                                    if (allShow === 'block') {
                                        target.classList.remove('slide-btn')
                                    }
                                } else {
                                    this.changeStyle(target, option);
                                }
                                doc.removeEventListener("scroll", cb.onscroll, false);
                                setTimeout(() => {
                                    doc.addEventListener("scroll", cb.onscroll);
                                }, 50);
                            }
                        };
                        doc.addEventListener('scroll', cb.onscroll, false);
                    } else {
                        this.changeStyle(target, option);
                        target.innerHTML = initialText;
                        this.toggle(part, all);
                    }
                });
            }
        }
        // ES6 布丁参数, 停止使用 arguments
        toggle(...list) {
            for(let i of list) {
                if (window.getComputedStyle(i,null).getPropertyValue('display') !== 'none') {
                    i.style.display = 'none'
                } else {
                    i.style.display = 'block'
                }
            }
        }
        changeStyle(i, option) {
            let style = i.style;
            style.right = option.right;
            style.color = option.btnColor;
            style.backgroundColor = option.btnBg;
            style.position = 'absolute';
            i.classList.remove('fix-btn');
        }
        changeFix(i, option) {
            let style = i.style;
            style.color = option.fixBtnColor;
            style.backgroundColor = option.fixBtnBg;
            style.position = 'fixed';
            i.classList.add('fix-btn');
        }
    }

    if( typeof module !== "undefined" && typeof module.exports !== "undefined" ){
        module.exports = foldcontent;
    } else{
        window.foldContent = foldcontent;
    }
})();
// todo: 收起一个 div 时判断下一个 div 是否显示固定定位按钮; 添加按钮在固定定位、绝对定位状态切换时的动画效果