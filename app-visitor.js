document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // 3. Weekly / Monthly Tab Switcher
    const schedButtons = document.querySelectorAll('.sched-tab-btn');
    const schedLists = document.querySelectorAll('.sched-list');

    schedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            schedButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const date = btn.getAttribute('data-date');

            schedLists.forEach(list => {
                const listId = list.getAttribute('id');
                if (listId === `sched-${date}`) {
                    list.style.display = (date === 'monthly') ? 'block' : 'grid';
                    setTimeout(() => {
                        list.style.opacity = '1';
                        list.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    list.style.opacity = '0';
                    list.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        list.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 4. Google Sheets Schedule Fetch & Live Auto-Sync
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby3CjMnZP4uynYV75ogWB3LwZB1jh-QX3vUcKYjVnWCCI3tWzPqc5V1Jf2DKjQoJ6od2w/exec';
    
    window.liveScheduleData = {};

    async function fetchLiveSchedule() {
        try {
            const response = await fetch(`${GAS_WEB_APP_URL}?action=getSchedule`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.schedule) {
                    applyScheduleData(data.schedule);
                }
            }
        } catch (err) {
            console.log('Google Sheets Sync: Using static template / Coming Soon fallback');
        }
    }

    function applyScheduleData(scheduleList) {
        scheduleList.forEach(item => {
            let dayNum = item.day;
            if (!dayNum) return;

            // Extract day number (e.g. 1, 15) from Date strings or numbers
            const parsedDate = new Date(dayNum);
            if (!isNaN(parsedDate.getDate())) {
                dayNum = String(parsedDate.getDate());
            } else {
                const match = String(dayNum).match(/\d+/);
                if (match) dayNum = match[0];
            }

            window.liveScheduleData[dayNum] = item;

            // 1. Update Calendar Cell
            const cell = document.querySelector(`.calendar-cell[data-day="${dayNum}"]`);
            if (cell && item.shop && item.shop !== 'Coming Soon') {
                const shopSpan = cell.querySelector('.cell-shop');
                if (shopSpan) shopSpan.textContent = item.shop;
                const thumbImg = cell.querySelector('.cell-thumb');
                if (thumbImg && item.img) thumbImg.src = item.img;
            }

            // 2. Update Weekly Schedule Items
            const card = document.querySelector(`.sched-item[data-day="${dayNum}"]`);
            if (card && item.shop && item.shop !== 'Coming Soon') {
                const titleElem = card.querySelector('.sched-title');
                if (titleElem) titleElem.textContent = item.shop;
                const timeElem = card.querySelector('.sched-time');
                if (timeElem && item.cat) timeElem.textContent = item.cat;
                const descElem = card.querySelector('.sched-desc');
                if (descElem && item.desc) descElem.textContent = item.desc;
                const imgElem = card.querySelector('.sched-img');
                if (imgElem && item.img) imgElem.src = item.img;
            }
        });
    }

    fetchLiveSchedule();

    // 5. Monthly Calendar Cell Click -> Shop Detail Modal
    const calendarCells = document.querySelectorAll('.calendar-cell:not(.empty)');

    calendarCells.forEach(cell => {
        cell.style.cursor = 'pointer';
        
        cell.addEventListener('click', () => {
            const dayNum = cell.querySelector('.day-num') ? cell.querySelector('.day-num').textContent.trim() : '';

            const liveData = window.liveScheduleData[dayNum];
            
            let shopName = 'Coming Soon';
            let details = {
                cat: '出店店舗 順次発表',
                img: 'visitor_concept.png',
                desc: '10月の出店店舗は決定次第、公式Instagram（@comado.marche）および当サイトにて順次発表いたします！現在、出店メンバーを募集中です。出店をご希望の方は「出店希望の方」ボタンよりお気軽にお申し込みください。'
            };

            if (liveData && liveData.shop && liveData.shop !== 'Coming Soon') {
                shopName = liveData.shop;
                details = {
                    cat: liveData.cat || 'おすすめ店舗',
                    img: liveData.img || 'visitor_concept.png',
                    desc: liveData.desc || 'つくり手の想いが詰まったこだわりの商品をお届けします。ぜひ店頭でご覧ください。'
                };
            }

            // Open Detail Modal
            showShopModal(dayNum, shopName, details);
        });
    });

    function showShopModal(dayNum, shopName, details) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '0';
        popup.style.left = '0';
        popup.style.width = '100%';
        popup.style.height = '100%';
        popup.style.backgroundColor = 'rgba(58, 71, 53, 0.45)';
        popup.style.backdropFilter = 'blur(8px)';
        popup.style.display = 'flex';
        popup.style.alignItems = 'center';
        popup.style.justifyContent = 'center';
        popup.style.zIndex = '3000';
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.3s ease';

        popup.innerHTML = `
            <div style="background-color: #fcfbf7; border: 1px solid rgba(91, 112, 83, 0.2); border-radius: 24px; max-width: 480px; width: 90%; overflow: hidden; box-shadow: 0 20px 50px rgba(62, 55, 48, 0.2); transform: translateY(20px); transition: transform 0.3s ease; position: relative;">
                <button id="modal-close-x" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.8); border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.25rem; color: #555; z-index: 10; backdrop-filter: blur(4px);">✕</button>
                <div style="position: relative; height: 200px; overflow: hidden;">
                    <img src="${details.img}" alt="${shopName}" style="width: 100%; height: 100%; object-fit: cover;">
                    <div style="position: absolute; top: 1rem; left: 1rem; background-color: var(--accent-sage, #5b7053); color: #fff; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
                        10月${dayNum}日（出店）
                    </div>
                </div>
                <div style="padding: 2rem;">
                    <span style="font-size: 0.8rem; color: #5b7053; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">${details.cat}</span>
                    <h3 style="font-family: 'Noto Serif JP', serif; font-size: 1.5rem; color: #3a4735; margin: 0.35rem 0 1rem;">${shopName}</h3>
                    <p style="color: #666; font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.5rem;">
                        ${details.desc}
                    </p>
                    <button id="modal-close-btn" style="width: 100%; background-color: #5b7053; color: #fcfbf7; border: none; padding: 0.85rem 0; border-radius: 9999px; font-weight: 600; cursor: pointer; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(91, 112, 83, 0.25);">
                        閉じる
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.style.opacity = '1';
            const box = popup.querySelector('div');
            if (box) box.style.transform = 'translateY(0)';
        }, 50);

        const closeX = popup.querySelector('#modal-close-x');
        const closeBtn = popup.querySelector('#modal-close-btn');

        const closeModal = () => {
            popup.style.opacity = '0';
            const box = popup.querySelector('div');
            if (box) box.style.transform = 'translateY(20px)';
            setTimeout(() => popup.remove(), 300);
        };

        if (closeX) closeX.addEventListener('click', closeModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        popup.addEventListener('click', (e) => {
            if (e.target === popup) closeModal();
        });
    }
});
