document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1.5 Drawer Navigation Menu Toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navDrawer = document.getElementById('nav-drawer');
    const navDrawerClose = document.getElementById('nav-drawer-close');
    const navDrawerBackdrop = document.getElementById('nav-drawer-backdrop');
    const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta-btn');

    function openDrawer() {
        if (navDrawer) navDrawer.classList.add('active');
    }

    function closeDrawer() {
        if (navDrawer) navDrawer.classList.remove('active');
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
    if (navDrawerClose) navDrawerClose.addEventListener('click', closeDrawer);
    if (navDrawerBackdrop) navDrawerBackdrop.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // 2. Scroll Reveal Animation using Intersection Observer
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

    // 3. Tab Filtering for Fixtures Section
    const tabButtons = document.querySelectorAll('.fixture-tab-btn');
    const fixtureItems = document.querySelectorAll('.fixture-item');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            fixtureItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 4. Plan Selection Button Interaction with Form
    const planSelectButtons = document.querySelectorAll('[data-select-plan]');
    planSelectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const planValue = btn.getAttribute('data-select-plan');
            const targetRadio = document.querySelector(`input[name="form-plan"][value="${planValue}"]`);
            if (targetRadio) {
                targetRadio.checked = true;
            }
        });
    });

    // 5. Accordion for Rules & FAQ
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            
            const isActive = item.classList.contains('active');
            
            document.querySelectorAll('.accordion-item').forEach(el => {
                el.classList.remove('active');
                const c = el.querySelector('.accordion-content');
                if (c) c.style.maxHeight = null;
            });
            
            if (!isActive && content) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // 6. Entry Form Submission & GAS Integration
    const entryForm = document.getElementById('marche-entry-form');

    if (entryForm) {
        entryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Safe input value getters
            const name = document.getElementById('form-name') ? document.getElementById('form-name').value : '';
            const email = document.getElementById('form-email') ? document.getElementById('form-email').value : '';
            const shop = document.getElementById('form-shop') ? document.getElementById('form-shop').value : '';
            const category = document.getElementById('form-category') ? document.getElementById('form-category').value : '';
            
            const planElem = document.querySelector('input[name="form-plan"]:checked');
            const plan = planElem ? planElem.value : 'spot';

            const intro = document.getElementById('form-intro') ? document.getElementById('form-intro').value : '';
            const url = document.getElementById('form-url') ? document.getElementById('form-url').value : '';

            // Google Apps Script (GAS) Web App URL integration
            const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycby3CjMnZP4uynYV75ogWB3LwZB1jh-QX3vUcKYjVnWCCI3tWzPqc5V1Jf2DKjQoJ6od2w/exec"; 

            if (GAS_WEB_APP_URL) {
                try {
                    const formData = new URLSearchParams();
                    formData.append('name', name);
                    formData.append('email', email);
                    formData.append('shop', shop);
                    formData.append('category', category);
                    formData.append('plan', plan);
                    formData.append('intro', intro);
                    formData.append('url', url);

                    fetch(GAS_WEB_APP_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: formData.toString()
                    }).catch(err => console.error("Form submission error:", err));
                } catch (err) {
                    console.error("Fetch exception:", err);
                }
            }

            // Custom premium popup modal for submission success
            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '0';
            popup.style.left = '0';
            popup.style.width = '100%';
            popup.style.height = '100%';
            popup.style.backgroundColor = 'rgba(58, 71, 53, 0.4)';
            popup.style.backdropFilter = 'blur(8px)';
            popup.style.display = 'flex';
            popup.style.alignItems = 'center';
            popup.style.justifyContent = 'center';
            popup.style.zIndex = '2000';
            popup.style.opacity = '0';
            popup.style.transition = 'opacity 0.3s ease';

            popup.innerHTML = `
                <div style="background-color: #fcfbf7; border: 1px solid rgba(91, 112, 83, 0.2); padding: 3.5rem 3rem; border-radius: 24px; text-align: center; max-width: 500px; width: 90%; box-shadow: 0 20px 50px rgba(62, 55, 48, 0.15); transform: translateY(20px); transition: transform 0.3s ease;">
                    <div style="width: 72px; height: 72px; background-color: #5b7053; color: #fcfbf7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; font-size: 2rem;">
                        ✓
                    </div>
                    <h3 style="font-family: 'Noto Serif JP', serif; font-size: 1.5rem; color: #3a4735; margin-bottom: 1rem;">エントリーが完了しました！</h3>
                    <p style="color: #79746c; font-size: 0.95rem; line-height: 1.7; margin-bottom: 2.5rem;">
                        ${name}様、エントリーありがとうございます。ご入力いただいた内容を運営事務局にて確認し、3営業日以内に <strong>${email}</strong> 宛てにご連絡いたします。
                    </p>
                    <button id="close-popup-btn" style="background-color: #5b7053; color: #fcfbf7; border: none; padding: 0.85rem 2.5rem; border-radius: 9999px; font-weight: 600; cursor: pointer; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(91, 112, 83, 0.25); transition: background-color 0.2s ease;">
                        閉じる
                    </button>
                </div>
            `;

            document.body.appendChild(popup);

            setTimeout(() => {
                popup.style.opacity = '1';
                const innerBox = popup.querySelector('div');
                if (innerBox) innerBox.style.transform = 'translateY(0)';
            }, 50);

            const closeBtn = popup.querySelector('#close-popup-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    popup.style.opacity = '0';
                    const innerBox = popup.querySelector('div');
                    if (innerBox) innerBox.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        popup.remove();
                        entryForm.reset();
                    }, 300);
                });
            }
        });
    }
});
