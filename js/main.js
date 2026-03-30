// Data Configuration

const MOODS = [
    { id: 'm1', label: '雨天低落', icon: '🌧️' },
    { id: 'm2', label: '晴天愉悦', icon: '☀️' },
    { id: 'm3', label: '雪天浪漫', icon: '❄️' },
    { id: 'm4', label: '表白告白', icon: '💝' },
    { id: 'm5', label: '生日祝福', icon: '🎂' },
    { id: 'm6', label: '自我治愈', icon: '✨' },
    { id: 'm7', label: '忧思怀念', icon: '🍂' },
    { id: 'm8', label: '节日庆祝', icon: '🎊' }
];

const STYLES = [
    { id: 's1', name: '韩式小清新', desc: '柔和色调、简约包装、自然感', bg: 'bg-1' },
    { id: 's2', name: '法式浪漫', desc: '丰盈饱满、经典配色、优雅丝带', bg: 'bg-2' },
    { id: 's3', name: '日式侘寂', desc: '极简留白、枝条线条感、禅意', bg: 'bg-3' },
    { id: 's4', name: '复古文艺', desc: '莫兰迪色系、干花混搭、做旧质感', bg: 'bg-4' },
    { id: 's5', name: '热烈奔放', desc: '高饱和色彩、大朵花材、视觉冲击', bg: 'bg-5' },
    { id: 's6', name: '森系自然', desc: '绿植为主、野趣感、不规则造型', bg: 'bg-6' }
];

// App State
const state = {
    selectedMoods: new Set(),
    selectedStyle: null,
    history: []
};

// Router
class Router {
    constructor() {
        this.view = document.getElementById('router-view');
        this.routes = {
            'login': this.renderLogin.bind(this),
            'register': this.renderRegister.bind(this),
            'home': this.renderHome.bind(this),
            'style': this.renderStyle.bind(this),
            'loading': this.renderLoading.bind(this),
            'result': this.renderResult.bind(this),
            'collection': this.renderCollection.bind(this)
        };
        
        // Navigation links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
                const route = e.currentTarget.dataset.route;
                this.navigate(route);
            });
        });
    }

    navigate(route) {
        // Toggle Auth Mode UI (hides sidebar, resets layout)
        const appContainer = document.getElementById('app');
        if (route === 'login' || route === 'register') {
            appContainer.classList.add('auth-mode');
        } else {
            appContainer.classList.remove('auth-mode');
            // update active link in navbar
            document.querySelectorAll('.nav-links a').forEach(l => {
                l.classList.remove('active');
                if (l.dataset.route === route || (route === 'result' && l.dataset.route === 'home') || (route === 'loading' && l.dataset.route === 'home') || (route === 'style' && l.dataset.route === 'home')) {
                    l.classList.add('active');
                }
            });
        }

        // Simple animation trigger
        this.view.style.opacity = '0';
        
        setTimeout(() => {
            const template = document.getElementById(`tmpl-${route}`);
            if (template) {
                this.view.innerHTML = '';
                this.view.appendChild(template.content.cloneNode(true));
                // Call the route handler explicitly
                if (this.routes[route]) {
                    this.routes[route]();
                }
            } else {
                console.error(`Route ${route} not found`);
            }
            
            this.view.style.opacity = '1';
        }, 150);
    }

    // --- Auth Handlers ---
    renderLogin() {
        const form = document.getElementById('form-login');
        const errorMsg = document.getElementById('login-error');
        const linkRegister = document.getElementById('link-to-register');

        linkRegister.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigate('register');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;

            // Mock authentication rules
            if ((user === '' && pass === '') || (user === 'test' && pass === '123456')) {
                errorMsg.textContent = '';
                this.navigate('home');
            } else {
                errorMsg.textContent = '用户名或密码错误。使用空密码或test/123456。';
            }
        });
    }

    renderRegister() {
        const form = document.getElementById('form-register');
        const linkLogin = document.getElementById('link-to-login');

        linkLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigate('login');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById('reg-password').value;
            const passConfirm = document.getElementById('reg-password-confirm').value;

            if (pass !== passConfirm) {
                alert('两次输入的密码不一致！');
                return;
            }
            // Mock register success and route to home or login
            alert('注册成功！(演示环境)');
            this.navigate('home');
        });
    }

    // --- Page Handlers ---

    renderHome() {
        const container = document.getElementById('mood-tags');
        const actionBar = document.getElementById('home-action');
        const nextBtn = document.getElementById('btn-next-style');

        container.innerHTML = '';
        
        MOODS.forEach(mood => {
            const el = document.createElement('div');
            el.className = `mood-tag ${state.selectedMoods.has(mood.id) ? 'selected' : ''}`;
            el.innerHTML = `<span class="icon">${mood.icon}</span> <span>${mood.label}</span>`;
            
            el.addEventListener('click', () => {
                if (state.selectedMoods.has(mood.id)) {
                    state.selectedMoods.delete(mood.id);
                    el.classList.remove('selected');
                } else {
                    state.selectedMoods.add(mood.id);
                    el.classList.add('selected');
                }
                
                // Show/hide action bar
                if (state.selectedMoods.size > 0) {
                    actionBar.classList.remove('hide');
                } else {
                    actionBar.classList.add('hide');
                }
            });
            
            container.appendChild(el);
        });

        // Ensure action bar is visible if already selected
        if (state.selectedMoods.size > 0) {
            actionBar.classList.remove('hide');
        }

        nextBtn.addEventListener('click', () => {
            if (state.selectedMoods.size > 0) {
                this.navigate('style');
            }
        });
    }

    renderStyle() {
        const container = document.getElementById('style-cards');
        const actionBar = document.getElementById('style-action');
        const backBtn = document.getElementById('btn-back-home');
        const generateBtn = document.getElementById('btn-generate');

        container.innerHTML = '';

        STYLES.forEach(st => {
            const el = document.createElement('div');
            el.className = `style-card ${state.selectedStyle === st.id ? 'selected' : ''}`;
            
            el.innerHTML = `
                <div class="style-image ${st.bg}"></div>
                <div class="style-info">
                    <h3>${st.name}</h3>
                    <p>${st.desc}</p>
                </div>
            `;
            
            el.addEventListener('click', () => {
                // Single select
                document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
                el.classList.add('selected');
                state.selectedStyle = st.id;
                actionBar.classList.remove('hide');
            });
            
            container.appendChild(el);
        });

        if (state.selectedStyle) {
            actionBar.classList.remove('hide');
        }

        backBtn.addEventListener('click', () => {
            this.navigate('home');
        });

        generateBtn.addEventListener('click', () => {
            if (state.selectedStyle) {
                this.navigate('loading');
            }
        });
    }

    renderLoading() {
        // Simulate AI API call delay
        const titles = ["正在挑选主花...", "正在搭配绿叶...", "正在构思花语...", "正在渲染 3D 效果..."];
        const msgEl = document.querySelector('.loading-subtitle');
        
        let index = 0;
        const interval = setInterval(() => {
            index++;
            if (index < titles.length && msgEl) {
                msgEl.textContent = titles[index];
            }
        }, 800);

        setTimeout(() => {
            clearInterval(interval);
            this.navigate('result');
        }, 3500);
    }

    renderResult() {
        // Back buttons
        document.getElementById('btn-back-style').addEventListener('click', () => {
            this.navigate('style');
        });
        
        document.getElementById('btn-re-generate').addEventListener('click', () => {
            this.navigate('loading');
        });

        document.getElementById('btn-save').addEventListener('click', () => {
            alert('已保存到本地相册');
        });

        document.getElementById('btn-share').addEventListener('click', () => {
            alert('分享链接已复制，快去分享给朋友吧！');
        });

        // 360 degree drag simulation interaction
        const image = document.getElementById('bouquet-view');
        let isDragging = false;
        let startX = 0;
        let rotation = 0;

        image.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            startX = e.clientX;
            
            rotation += deltaX * 0.5;
            // Since we use a static image, we simulate 3D rotation with simple scale and skew, or just slight translations to mimic "parallax"
            // Since requirements say "fixed image", we just do a parallax wiggle
            const constrain = Math.max(-20, Math.min(rotation, 20));
            image.style.transform = `perspective(1000px) rotateY(${constrain}deg)`;
        });

        // Save to History (Mock)
        if (state.selectedStyle && state.selectedMoods.size > 0) {
            const moodNames = Array.from(state.selectedMoods).map(id => MOODS.find(m => m.id === id).label);
            const styleObj = STYLES.find(s => s.id === state.selectedStyle);
            
            // Only add once per gen
            if (!state.history.some(h => h.timestamp > Date.now() - 5000)) {
                state.history.push({
                    title: '「繁星落雨」',
                    moods: moodNames,
                    style: styleObj.name,
                    timestamp: Date.now()
                });
            }
        }
    }

    renderCollection() {
        const container = document.querySelector('.collection-grid');
        
        if (state.history.length === 0) {
            container.innerHTML = `
                <div class="collection-card empty-state">
                    <div class="empty-icon" style="font-size:48px; margin-bottom: 20px;">🌸</div>
                    <p style="color: var(--text-secondary);">暂无收藏的花束，快去定制一束吧</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        container.style.gap = '24px';

        state.history.slice().reverse().forEach(item => {
            const el = document.createElement('div');
            el.className = 'glass-panel';
            el.style.padding = '20px';
            
            el.innerHTML = `
                <div style="height: 160px; background: url('flowertest.png') center/contain no-repeat; margin-bottom: 16px;"></div>
                <h3 style="margin-bottom: 8px;">${item.title}</h3>
                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">基于心情：${item.moods.join('、')}</p>
                <span class="badge">${item.style}</span>
            `;
            container.appendChild(el);
        });
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    const app = new Router();
    // Default route
    app.navigate('login');
});
