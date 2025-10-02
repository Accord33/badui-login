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
    // 少し遅延を入れてからフォーカスを当てる
    setTimeout(() => {
        passwordInput.focus();
    }, 100);
    
    // 現在の値があれば入力フィールドに設定
    if (storedPassword) {
        passwordInput.value = storedPassword;
    }
    
    // パスワード表示チェックボックスをリセット
    document.getElementById('show-password').checked = false;
    passwordInput.type = 'password';
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

// ログインボタンのクリックイベント
document.querySelector('.login-button').addEventListener('click', function() {
    const username = usernameDisplay.textContent;
    
    if (username === 'ユーザー名を入力') {
        alert('ユーザー名を入力してください');
        return;
    }
    
    if (!storedPassword) {
        alert('パスワードを入力してください');
        return;
    }
    
    // ここで実際のログイン処理を行う
    console.log('ログイン試行:', { username, password: storedPassword });
    alert(`ログイン試行中...\nユーザー名: ${username}`);
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
