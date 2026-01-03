/**
 * 68 Messenger 官网交互脚本
 */

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initFAQ();
    initVirusAlert();
    initSmoothScroll();
    initScrollAnimations();
    initMobileMenu();
});

/**
 * 导航栏滚动效果
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // 滚动超过50px时添加阴影效果
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 向下滚动时隐藏，向上滚动时显示
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

/**
 * FAQ 手风琴效果
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // 关闭其他已打开的FAQ
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // 切换当前FAQ的状态
                item.classList.toggle('active');
            });
        }
    });
}

/**
 * 报毒提示浮窗
 */
function initVirusAlert() {
    const virusAlert = document.getElementById('virusAlert');
    if (!virusAlert) return;
    
    // 检查是否已经关闭过
    const alertClosed = localStorage.getItem('virusAlertClosed');
    const closeTime = localStorage.getItem('virusAlertCloseTime');
    
    // 24小时后重新显示
    const showAfter = 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    if (alertClosed && closeTime && (now - parseInt(closeTime)) < showAfter) {
        virusAlert.classList.add('hidden');
    } else {
        // 延迟3秒显示
        setTimeout(() => {
            virusAlert.classList.remove('hidden');
        }, 3000);
    }
}

/**
 * 关闭报毒提示浮窗
 */
function closeVirusAlert() {
    const virusAlert = document.getElementById('virusAlert');
    if (virusAlert) {
        virusAlert.classList.add('hidden');
        localStorage.setItem('virusAlertClosed', 'true');
        localStorage.setItem('virusAlertCloseTime', Date.now().toString());
    }
}

/**
 * 平滑滚动
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 滚动动画
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-block, .tutorial-card, .service-card, .info-card, .reason-card, .step-item'
    );
    
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.classList.add('animate-hidden');
        observer.observe(element);
    });
    
    // 添加动画CSS
    addAnimationStyles();
}

/**
 * 添加动画样式
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-hidden {
            opacity: 0;
            transform: translateY(30px);
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .navbar.scrolled {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .navbar {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 移动端菜单
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    
    if (!menuBtn) return;
    
    // 创建移动端菜单
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <div class="mobile-menu-content">
            ${navLinks ? navLinks.innerHTML : ''}
            ${navActions ? navActions.innerHTML : ''}
        </div>
    `;
    
    document.body.appendChild(mobileMenu);
    
    // 添加移动端菜单样式
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .mobile-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .mobile-menu-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .mobile-menu-content a {
            padding: 12px 16px;
            border-radius: 8px;
            transition: background 0.2s;
        }
        
        .mobile-menu-content a:hover {
            background: #f1f5f9;
        }
        
        @media (min-width: 769px) {
            .mobile-menu {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 切换菜单
    menuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        
        const icon = menuBtn.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // 点击菜单项后关闭菜单
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            menuBtn.querySelector('i').className = 'fas fa-bars';
        });
    });
}

/**
 * 下载按钮点击统计
 */
function trackDownload(platform) {
    console.log(`Download clicked: ${platform}`);
    // 这里可以添加统计代码
}

/**
 * 复制文本到剪贴板
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('复制成功！');
    }).catch(() => {
        showToast('复制失败，请手动复制');
    });
}

/**
 * 显示提示消息
 */
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    // 添加样式
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #1e293b;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: toastIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// 添加Toast动画
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes toastIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes toastOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
`;
document.head.appendChild(toastStyle);

