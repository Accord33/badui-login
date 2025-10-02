// ポップアップ関連の要素を取得
const usernamePopupOverlay = document.getElementById('username-popup-overlay');
const passwordPopupOverlay = document.getElementById('password-popup-overlay');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const usernameDisplay = document.getElementById('username-display');
const passwordDisplay = document.getElementById('password-display');
const usernameBtn = document.querySelector('.username-input-btn');
const passwordBtn = document.querySelector('.password-input-btn');

// 格納用変数
let storedPassword = '';

// ユーザーネーム入力ポップアップを開く
function openUsernamePopup() {
    usernamePopupOverlay.classList.add('show');
    // 少し遅延を入れてからフォーカスを当てる
    setTimeout(() => {
        usernameInput.focus();
    }, 100);
    
    // 現在の値があれば入力フィールドに設定
    const currentValue = usernameDisplay.textContent;
    if (currentValue !== 'ユーザー名を入力') {
        usernameInput.value = currentValue;
    }
}

// パスワード入力ポップアップを開く
function openPasswordPopup() {
    passwordPopupOverlay.classList.add('show');
    
    // スクロール位置をリセット
    const passwordPopupContent = document.getElementById('password-popup-content');
    passwordPopupContent.scrollTop = 0;
    
    // 理解確認チェックボックスをリセット
    resetUnderstandingCheckboxes();
    
    // 入力フィールドを無効化
    disablePasswordInput();
    
    // スクロールイベントリスナーを追加
    passwordPopupContent.addEventListener('scroll', handlePasswordPopupScroll);
    
    // 理解確認チェックボックスのイベントリスナーを追加
    setupUnderstandingCheckboxListeners();
    
    // 少し遅延を入れてからフォーカスを当てる（スクロール後に有効になる）
    setTimeout(() => {
        checkScrollAndEnableInput();
    }, 100);
    
    // パスワード表示チェックボックスをリセット
    document.getElementById('show-password').checked = false;
    passwordInput.type = 'password';
}

// パスワード入力フィールドを無効化
function disablePasswordInput() {
    const passwordPopup = document.getElementById('password-popup-overlay');
    const confirmBtn = passwordPopup.querySelector('.confirm-btn');
    
    passwordInput.disabled = true;
    document.getElementById('show-password').disabled = true;
    confirmBtn.disabled = true;
}

// パスワード入力フィールドを有効化
function enablePasswordInput() {
    const passwordPopup = document.getElementById('password-popup-overlay');
    const confirmBtn = passwordPopup.querySelector('.confirm-btn');
    
    passwordInput.disabled = false;
    document.getElementById('show-password').disabled = false;
    confirmBtn.disabled = false;
    passwordInput.focus();
}

// 理解確認チェックボックスの状態をチェック
function checkAllUnderstandingBoxes() {
    const checkboxes = document.querySelectorAll('.understanding-checkbox');
    console.log('チェックボックス数:', checkboxes.length);
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    console.log('全てチェック済み:', allChecked);
    return allChecked;
}

// 理解確認チェックボックスの状態更新
function updateUnderstandingCheckStatus() {
    console.log('updateUnderstandingCheckStatus が呼ばれました');
    const checkboxes = document.querySelectorAll('.understanding-checkbox');
    
    checkboxes.forEach(checkbox => {
        const container = checkbox.closest('.understanding-check');
        if (checkbox.checked) {
            container.classList.add('checked');
        } else {
            container.classList.remove('checked');
        }
    });
    
    // 全てチェックされている場合は即座に有効化（スクロール条件は不要）
    if (checkAllUnderstandingBoxes()) {
        console.log('全てのチェックボックスがチェックされました - パスワード入力を有効化');
        const passwordPopup = document.getElementById('password-popup-overlay');
        const confirmBtn = passwordPopup.querySelector('.confirm-btn');
        const showPasswordCheckbox = document.getElementById('show-password');
        
        console.log('パスワード入力要素:', passwordInput);
        console.log('パスワード表示チェックボックス:', showPasswordCheckbox);
        console.log('確定ボタン:', confirmBtn);
        
        passwordInput.disabled = false;
        showPasswordCheckbox.disabled = false;
        confirmBtn.disabled = false;
        
        console.log('有効化後の状態:');
        console.log('パスワード入力disabled:', passwordInput.disabled);
        console.log('パスワード表示disabled:', showPasswordCheckbox.disabled);
        console.log('確定ボタンdisabled:', confirmBtn.disabled);
        
        if (storedPassword) {
            passwordInput.value = storedPassword;
        }
        passwordInput.focus();
    } else {
        console.log('一部のチェックボックスがチェックされていません - パスワード入力を無効化');
        disablePasswordInput();
    }
}

// スクロール検知とフィールド有効化
function handlePasswordPopupScroll() {
    checkScrollAndEnableInput();
}

function checkScrollAndEnableInput() {
    const passwordPopupContent = document.getElementById('password-popup-content');
    const scrollThreshold = 800; // 800px スクロールしたら有効化（200px → 800px）
    
    if (passwordPopupContent.scrollTop >= scrollThreshold && checkAllUnderstandingBoxes()) {
        enablePasswordInput();
        // イベントリスナーを削除（一度有効化したら再度無効化しない）
        passwordPopupContent.removeEventListener('scroll', handlePasswordPopupScroll);
    }
}

// ユーザーネームポップアップを閉じる
function closeUsernamePopup() {
    usernamePopupOverlay.classList.remove('show');
    usernameInput.value = '';
}

// パスワードポップアップを閉じる
function closePasswordPopup() {
    passwordPopupOverlay.classList.remove('show');
    passwordInput.value = '';
    document.getElementById('show-password').checked = false;
    passwordInput.type = 'password';
    
    // スクロールイベントリスナーを削除
    const passwordPopupContent = document.getElementById('password-popup-content');
    passwordPopupContent.removeEventListener('scroll', handlePasswordPopupScroll);
    
    // 理解確認チェックボックスをリセット
    resetUnderstandingCheckboxes();
}

// 理解確認チェックボックスをリセット
function resetUnderstandingCheckboxes() {
    const checkboxes = document.querySelectorAll('.understanding-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.understanding-check').classList.remove('checked');
        // イベントリスナーを削除
        checkbox.removeEventListener('change', updateUnderstandingCheckStatus);
    });
}

// 理解確認チェックボックスのイベントリスナーを設定
function setupUnderstandingCheckboxListeners() {
    console.log('setupUnderstandingCheckboxListeners が呼ばれました');
    const checkboxes = document.querySelectorAll('.understanding-checkbox');
    console.log('見つかったチェックボックス数:', checkboxes.length);
    checkboxes.forEach((checkbox, index) => {
        console.log(`チェックボックス ${index + 1}: ${checkbox.id}`);
        checkbox.addEventListener('change', updateUnderstandingCheckStatus);
    });
}

// ユーザーネームを確定する
function confirmUsername() {
    const username = usernameInput.value.trim();
    
    if (username === '') {
        alert('ユーザー名を入力してください');
        return;
    }
    
    // ボタンの表示を更新
    usernameDisplay.textContent = username;
    usernameBtn.classList.add('has-value');
    
    // ポップアップを閉じる
    closeUsernamePopup();
}

// パスワードを確定する
function confirmPassword() {
    const password = passwordInput.value;
    
    if (password === '') {
        alert('パスワードを入力してください');
        return;
    }
    
    // パスワードを保存
    storedPassword = password;
    
    // ボタンの表示を更新（●で隠す）
    passwordDisplay.textContent = '●'.repeat(Math.min(password.length, 12));
    passwordBtn.classList.add('has-value');
    
    // ポップアップを閉じる
    closePasswordPopup();
}

// パスワード表示/非表示を切り替える
function togglePasswordVisibility() {
    const showPassword = document.getElementById('show-password').checked;
    passwordInput.type = showPassword ? 'text' : 'password';
}

// Enterキーでも確定できるようにする
usernameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        confirmUsername();
    }
});

passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        confirmPassword();
    }
});

// Escapeキーでポップアップを閉じる
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (usernamePopupOverlay.classList.contains('show')) {
            closeUsernamePopup();
        }
        if (passwordPopupOverlay.classList.contains('show')) {
            closePasswordPopup();
        }
    }
});

// ログインボタンの動作
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-button');
    let hoverTimeout = null;
    let isReset = false;
    let quickClickCount = 0;
    
    // ホバー開始
    loginButton.addEventListener('mouseenter', function() {
        if (isReset) return;
        
        // 0.3秒後にリセットモードに変更
        hoverTimeout = setTimeout(() => {
            loginButton.classList.add('show-reset');
            isReset = true;
        }, 300);
    });
    
    // ホバー終了
    loginButton.addEventListener('mouseleave', function() {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
        
        // リセットモードを解除（少し遅延を入れる）
        setTimeout(() => {
            loginButton.classList.remove('show-reset');
            isReset = false;
        }, 200);
    });
    
    // クリックイベント
    loginButton.addEventListener('click', function() {
        const username = usernameDisplay.textContent;
        
        if (username === 'ユーザー名を入力') {
            alert('ユーザー名を入力してください');
            return;
        }
        
        if (!storedPassword) {
            alert('パスワードを入力してください');
            return;
        }
        
        // リセットモードの場合
        if (isReset) {
            performReset();
            return;
        }
        
        // 素早いクリック（トラップ回避）を検知
        quickClickCount++;
        setTimeout(() => {
            quickClickCount = 0;
        }, 1000);
        
        if (quickClickCount >= 3) {
            // 3回以上の素早いクリックで正常ログイン
            performLogin();
        } else {
            // 通常のクリックはリセットに変更
            if (Math.random() < 0.7) { // 70%の確率でリセット
                performReset();
            } else {
                performLogin();
            }
        }
    });
    
    function performReset() {
        // 入力内容をリセット
        usernameDisplay.textContent = 'ユーザー名を入力';
        usernameBtn.classList.remove('has-value');
        
        passwordDisplay.textContent = 'パスワードを入力';
        passwordBtn.classList.remove('has-value');
        storedPassword = '';
        
        // チェックボックスもリセット
        document.getElementById('remember').checked = false;
        document.getElementById('terms').checked = false;
        
        // リセットエフェクト
        loginButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            loginButton.style.transform = 'scale(1)';
        }, 150);
        
        alert('入力内容がリセットされました！');
        
        // リセットモードを解除
        setTimeout(() => {
            loginButton.classList.remove('show-reset');
            isReset = false;
        }, 500);
    }
    
    function performLogin() {
        // 正常なログイン処理
        console.log('ログイン成功:', { username: usernameDisplay.textContent, password: storedPassword });
        
        // ログイン成功エフェクト
        loginButton.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        loginButton.querySelector('.button-text').textContent = '成功！';
        
        setTimeout(() => {
            // /home.htmlに移動
            window.location.href = '/home.html';
        }, 1000);
    }
});

// 利用規約チェックボックスのいたずら効果
document.addEventListener('DOMContentLoaded', function() {
    const termsCheckboxContainer = document.querySelectorAll('.input-kiyaku')[1]; // 2番目のinput-kiyaku（利用規約）
    const termsCheckbox = document.getElementById('terms');
    let moveCount = 0;
    let isMoving = false;
    
    function createEscapeEffect() {
        if (isMoving) return;
        
        moveCount++;
        isMoving = true;
        
        // より大きなランダム移動距離を生成
        const randomX = (Math.random() - 0.5) * 280; // -140px to 140px（拡大）
        let randomY = (Math.random() - 0.5) * 120; // -60px to 60px（拡大）
        
        // 下方向への移動を制限（ログインボタンエリアを避ける）
        if (randomY > 20) {
            randomY = -Math.abs(randomY * 0.8); // 上方向に移動
        }
        
        // ランダムに斜め移動を追加
        const diagonalFactor = Math.random() * 1.5;
        let finalX = randomX * diagonalFactor;
        let finalY = randomY * diagonalFactor;
        
        // 移動回数に応じてさらにワイルドに
        if (moveCount > 2) {
            finalX *= 1.3;
            finalY *= 1.2;
        }
        
        if (moveCount > 5) {
            // 5回目以降はより予測不可能に
            finalX += (Math.random() - 0.5) * 100;
            finalY += (Math.random() - 0.5) * 60;
        }
        
        // カードの境界を考慮した範囲制限（より広い範囲）
        finalX = Math.max(-120, Math.min(120, finalX));
        finalY = Math.max(-80, Math.min(15, finalY)); // 少し下にも行けるように
        
        // CSS変数を設定
        termsCheckboxContainer.style.setProperty('--random-x', finalX);
        termsCheckboxContainer.style.setProperty('--random-y', finalY);
        
        // アニメーション適用（ランダムなアニメーション選択）
        const animations = ['escapeMove', 'zigzagMove', 'bounceMove', 'spiralMove'];
        const selectedAnimation = animations[Math.floor(Math.random() * animations.length)];
        termsCheckboxContainer.style.animation = `${selectedAnimation} 0.4s ease-out forwards`;
        
        // ちょろちょろ感を出すため、移動後に小刻みに揺れる
        setTimeout(() => {
            termsCheckboxContainer.style.animation += ', jitter 0.2s ease-in-out infinite';
        }, 400);
        
        // 揺れを止める
        setTimeout(() => {
            const currentTransform = `translate(${finalX}px, ${finalY}px)`;
            termsCheckboxContainer.style.animation = 'none';
            termsCheckboxContainer.style.transform = currentTransform;
        }, 800);
        
        // 移動後のテキスト変更
        const label = termsCheckboxContainer.querySelector('label');
        const messages = [
            '利用規約に同意する',
            '本当に同意しますか？',
            'まだ読んでませんよね？',
            '本当に本当に同意？',
            '諦めないでください...',
            'もう一度トライ！',
            '最後のチャンス！',
            'OK、あなたの勝ちです'
        ];
        
        if (moveCount <= messages.length) {
            setTimeout(() => {
                if (label) {
                    label.innerHTML = `<a href="/index.html">利用規約</a>${messages[moveCount - 1] || 'に同意する'}`;
                }
            }, 150);
        }
        
        // 8回目以降は移動を停止
        if (moveCount >= 8) {
            setTimeout(() => {
                termsCheckboxContainer.style.animation = 'none';
                termsCheckboxContainer.style.transform = 'translate(0, 0)';
                termsCheckbox.disabled = false;
                isMoving = false;
                
                // 最終メッセージ
                if (label) {
                    label.innerHTML = '<a href="/index.html">利用規約</a>を読んでいただき、ありがとうございます！';
                }
            }, 400);
            return;
        }
        
        setTimeout(() => {
            isMoving = false;
        }, 400);
    }
    
    // ホバーイベント
    termsCheckboxContainer.addEventListener('mouseenter', createEscapeEffect);
    termsCheckbox.addEventListener('mouseenter', createEscapeEffect);
    
    // チェックボックスを一時的に無効化（8回移動するまで）
    termsCheckbox.addEventListener('click', function(e) {
        if (moveCount < 8) {
            e.preventDefault();
            createEscapeEffect();
        }
    });
});

function alertSessionRenewal() {
    window.setTimeout(function(){
        alert('セッションを更新しますか？');
        alertSessionRenewal(); // 再度5秒後にアラート
    }, 5000);
}
// alertSessionRenewal();

// リダイレクト機能
// フォーム外クリックでリダイレクト機能
function redirectForm() {
    const formElements = document.querySelectorAll('.input-group, .input-kiyaku, .login-button');
    
    // 各要素を順番に飛ばす
    formElements.forEach((element, index) => {
        setTimeout(() => {
            // ランダムな飛ぶ方向を設定
            const randomX = (Math.random() - 0.5) * 1000;
            const randomY = -Math.random() * 800 - 200;
            
            // CSS変数を設定
            element.style.setProperty('--fly-x', `${randomX}px`);
            element.style.setProperty('--fly-y', `${randomY}px`);
            
            // 飛ぶアニメーションを適用
            element.classList.add('fly-away');
        }, index * 200); // 0.2秒ずつ遅延
    });
}

// フォーム外クリックイベントリスナーを追加
document.addEventListener('DOMContentLoaded', function() {
    const loginCard = document.querySelector('.login-card');
    let hasFlown = false; // 一度だけ実行するためのフラグ
    
    document.addEventListener('click', function(e) {
        // 既に飛んでいる場合は何もしない
        if (hasFlown) return;
        
        // クリックされた要素がログインカード内かチェック
        if (!loginCard.contains(e.target)) {
            hasFlown = true;
            redirectForm();
        }
    });
});