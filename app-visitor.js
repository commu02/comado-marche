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

    // 4. Monthly Calendar Cell Click -> Shop Detail Modal
    const calendarCells = document.querySelectorAll('.calendar-cell:not(.empty)');

    // Dictionary of shop details for quick lookup
    const shopDetails = {
        'COMADOベーカリー': {
            cat: 'ブレッド＆スイーツ',
            vendor: '山本 恵美',
            img: 'fixture_boxes.png',
            desc: '国産小麦と天然酵母にこだわったハード系パンと、しっとり食感の特製シナモンロールをお届けします。毎日の朝食やおやつに。'
        },
        'ラ・フルール': {
            cat: 'ボタニカル・生花',
            vendor: '佐藤 結衣',
            img: 'fixture_baskets.png',
            desc: '季節の小花を集めた素朴で可愛いミニブーケと、ドライフラワーのスワッグ。お部屋に小さな秋を飾りませんか？'
        },
        'アロマフォレスト': {
            cat: 'アロマ雑貨',
            vendor: '田中 玲奈',
            img: 'fixture_light.png',
            desc: '100%大豆ワックスを使用した、体に優しいソイキャンドルとブレンドエッセンシャルオイル。優しい灯りと香りに癒やされて。'
        },
        'スタジオブラス': {
            cat: 'アクセサリー',
            vendor: '伊藤 健太',
            img: 'fixture_brass.png',
            desc: '使えば使うほど味わいが増す無垢の真鍮アクセサリー。職人がひとつひとつ手作業で削り出しています。'
        },
        'リネンライフ': {
            cat: '布小物・リネン',
            vendor: '渡辺 奈々',
            img: 'fixture_linen.png',
            desc: '洗うほどに柔らかくなる上質なリネン100%のキッチンクロスとエプロン。暮らしに寄り添うナチュラル雑貨です。'
        },
        '自然派焼き菓子': {
            cat: '焼き菓子・スイーツ',
            vendor: '木村 美香',
            img: 'concept_pic.png',
            desc: '体に優しいオーガニック素材と国産バターをふんだんに使用した手作りサブレと焼き菓子セット。ギフトにも喜ばれます。'
        },
        '小笹カフェ': {
            cat: 'スイーツ＆コーヒー',
            vendor: '木村 さくら',
            img: 'visitor_concept.png',
            desc: '地元の食材を使った手作りスコーンと、相性抜群のカフェオレを提供します。お買い物の合間の素敵な休憩タイムに。'
        },
        '森の木工房': {
            cat: 'ウッドクラフト',
            vendor: '佐々木 茂',
            img: 'fixture_table.png',
            desc: '美しい木目の一枚板から切り出した、特製カッティングボード。おもてなしの食卓に木の温もりと彩りを添えます。'
        }
    };

    calendarCells.forEach(cell => {
        cell.style.cursor = 'pointer';
        
        cell.addEventListener('click', () => {
            const dayNum = cell.querySelector('.day-num') ? cell.querySelector('.day-num').textContent : '';
            const shopNameElem = cell.querySelector('.cell-shop');
            if (!shopNameElem) return;

            const shopName = shopNameElem.textContent.trim();
            const details = shopDetails[shopName] || {
                cat: 'ハンドメイド',
                vendor: 'マルシェ出店者',
                img: 'visitor_concept.png',
                desc: 'つくり手の想いが詰まったこだわりの作品をお届けします。ぜひ店頭で手に取ってご覧ください。'
            };

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
                    <div style="display: flex; align-items: center; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.08); margin-bottom: 1.5rem;">
                        <div style="width: 36px; height: 36px; background-color: #5b7053; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem;">
                            ${details.vendor.charAt(0)}
                        </div>
                        <div>
                            <span style="font-size: 0.75rem; color: #888; display: block;">出店者</span>
                            <span style="font-weight: 600; color: #333; font-size: 0.9rem;">${details.vendor}</span>
                        </div>
                    </div>
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
