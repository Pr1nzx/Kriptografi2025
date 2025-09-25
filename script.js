// Tab navigation dengan animasi macOS
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class dari semua button dan content
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class ke button yang diklik dan content yang sesuai
        button.classList.add('active');
        const tabId = button.dataset.tab;
        document.getElementById(tabId).classList.add('active');
        
        // Tambah efek smooth scroll untuk mobile
        document.getElementById(tabId).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

// Utility functions
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return null;
}

function cleanText(text) {
    return text.toUpperCase().replace(/[^A-Z]/g, '');
}

function showError(message) {
    // Buat notifikasi error style macOS
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #FF3B30;
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        font-family: var(--system-font);
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 8px 24px rgba(255, 59, 48, 0.3);
        animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    notification.textContent = `Error: ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Tambahkan keyframes untuk animasi
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Add button loading states
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Add success animation
function addSuccessAnimation(element) {
    element.classList.add('success-pulse');
    setTimeout(() => element.classList.remove('success-pulse'), 600);
}

// Shift Cipher
function encryptShift() {
    const button = event.target;
    setButtonLoading(button, true);
    
    setTimeout(() => {
        try {
            const text = document.getElementById('shift-text').value.toUpperCase();
            const key = parseInt(document.getElementById('shift-key').value);
            
            if (!text.trim()) {
                showError('Masukkan teks terlebih dahulu');
                return;
            }
            
            if (key < 1 || key > 25) {
                showError('Kunci harus antara 1 dan 25');
                return;
            }
            
            let result = '';
            for (let char of text) {
                if (char >= 'A' && char <= 'Z') {
                    const shifted = (char.charCodeAt(0) - 65 + key) % 26;
                    result += String.fromCharCode(shifted + 65);
                } else {
                    result += char;
                }
            }
            
            document.getElementById('shift-result').value = result;
            addSuccessAnimation(document.getElementById('shift-result'));
        } catch (error) {
            showError('Terjadi kesalahan saat enkripsi');
        } finally {
            setButtonLoading(button, false);
        }
    }, 300);
}

function decryptShift() {
    const button = event.target;
    setButtonLoading(button, true);
    
    setTimeout(() => {
        try {
            const text = document.getElementById('shift-text').value.toUpperCase();
            const key = parseInt(document.getElementById('shift-key').value);
            
            if (!text.trim()) {
                showError('Masukkan teks terlebih dahulu');
                return;
            }
            
            if (key < 1 || key > 25) {
                showError('Kunci harus antara 1 dan 25');
                return;
            }
            
            let result = '';
            for (let char of text) {
                if (char >= 'A' && char <= 'Z') {
                    const shifted = (char.charCodeAt(0) - 65 - key + 26) % 26;
                    result += String.fromCharCode(shifted + 65);
                } else {
                    result += char;
                }
            }
            
            document.getElementById('shift-result').value = result;
            addSuccessAnimation(document.getElementById('shift-result'));
        } catch (error) {
            showError('Terjadi kesalahan saat dekripsi');
        } finally {
            setButtonLoading(button, false);
        }
    }, 300);
}

// Substitution Cipher
function encryptSubstitution() {
    const button = event.target;
    setButtonLoading(button, true);
    
    setTimeout(() => {
        try {
            const text = document.getElementById('substitution-text').value.toUpperCase();
            const key = document.getElementById('substitution-key').value.toUpperCase();
            
            if (!text.trim()) {
                showError('Masukkan teks terlebih dahulu');
                return;
            }
            
            if (key.length !== 26 || !/^[A-Z]+$/.test(key) || new Set(key).size !== 26) {
                showError('Kunci harus berupa 26 huruf unik (A-Z)');
                return;
            }
            
            let result = '';
            for (let char of text) {
                if (char >= 'A' && char <= 'Z') {
                    const index = char.charCodeAt(0) - 65;
                    result += key[index];
                } else {
                    result += char;
                }
            }
            
            document.getElementById('substitution-result').value = result;
            addSuccessAnimation(document.getElementById('substitution-result'));
        } catch (error) {
            showError('Terjadi kesalahan saat enkripsi');
        } finally {
            setButtonLoading(button, false);
        }
    }, 300);
}

function decryptSubstitution() {
    const button = event.target;
    setButtonLoading(button, true);
    
    setTimeout(() => {
        try {
            const text = document.getElementById('substitution-text').value.toUpperCase();
            const key = document.getElementById('substitution-key').value.toUpperCase();
            
            if (!text.trim()) {
                showError('Masukkan teks terlebih dahulu');
                return;
            }
            
            if (key.length !== 26 || !/^[A-Z]+$/.test(key) || new Set(key).size !== 26) {
                showError('Kunci harus berupa 26 huruf unik (A-Z)');
                return;
            }
            
            let result = '';
            for (let char of text) {
                if (char >= 'A' && char <= 'Z') {
                    const index = key.indexOf(char);
                    result += String.fromCharCode(index + 65);
                } else {
                    result += char;
                }
            }
            
            document.getElementById('substitution-result').value = result;
            addSuccessAnimation(document.getElementById('substitution-result'));
        } catch (error) {
            showError('Terjadi kesalahan saat dekripsi');
        } finally {
            setButtonLoading(button, false);
        }
    }, 300);
}

// Affine Cipher
function encryptAffine() {
    const button = event.target;
    setButtonLoading(button, true);
    
    setTimeout(() => {
        try {
            const text = document.getElementById('affine-text').value.toUpperCase();
            const a = parseInt(document.getElementById('affine-key-a').value);
            const b = parseInt(document.getElementById('affine-key-b').value);
            
            if (!text.trim()) {
                showError('Masukkan teks terlebih dahulu');
                return;
            }
            
            if (gcd(a, 26) !== 1) {
                showError('Kunci a harus coprime dengan 26 (gcd(a,26)=1)');
                return;
            }
            
            if (b < 0 || b > 25) {
                showError('Kunci b harus antara 0 dan 25');
                return;
            }
            
            let result = '';
            for (let char of text) {
                if (char >= 'A' && char <= 'Z') {
                    const p = char.charCodeAt(0) - 65;
                    const c = (a * p + b) % 26;
                    result += String.fromCharCode(c + 65);
                } else {
                    result += char;
                }
            }
            
            document.getElementById('affine-result').value = result;
            addSuccessAnimation(document.getElementById('affine-result'));
        } catch (error) {
            showError('Terjadi kesalahan saat enkripsi');
        } finally {
            setButtonLoading(button, false);
        }
    }, 300);
}

function decryptAffine() {
    const button = event.target;
    setButtonLoading(button, true);
    
    setTimeout(() => {
        try {
            const text = document.getElementById('affine-text').value.toUpperCase();
            const a = parseInt(document.getElementById('affine-key-a').value);
            const b = parseInt(document.getElementById('affine-key-b').value);
            
            if (!text.trim()) {
                showError('Masukkan teks terlebih dahulu');
                return;
            }
            
            if (gcd(a, 26) !== 1) {
                showError('Kunci a harus coprime dengan 26 (gcd(a,26)=1)');
                return;
            }
            
            if (b < 0 || b > 25) {
                showError('Kunci b harus antara 0 dan 25');
                return;
            }
            
            const a_inv = modInverse(a, 26);
            if (a_inv === null) {
                showError('Tidak dapat menemukan invers modular untuk kunci a');
                return;
            }
            
            let result = '';
            for (let char of text) {
                if (char >= 'A' && char <= 'Z') {
                    const c = char.charCodeAt(0) - 65;
                    const p = (a_inv * (c - b + 26)) % 26;
                    result += String.fromCharCode(p + 65);
                } else {
                    result += char;
                }
            }
            
            document.getElementById('affine-result').value = result;
            addSuccessAnimation(document.getElementById('affine-result'));
        } catch (error) {
            showError('Terjadi kesalahan saat dekripsi');
        } finally {
            setButtonLoading(button, false);
        }
    }, 300);
}

// Vigenere Cipher
function encryptVigenere() {
    const button = event.target;
    setButtonLoading(button, true);
    
    setTimeout(() => {
        try {
            const text = document.getElementById('vigenere-text').value.toUpperCase();
            let key = document.getElementById('vigenere-key').value.toUpperCase().replace(/[^A-Z]/g, '');
            
            if (!text.trim()) {
                showError('Masukkan teks terlebih dahulu');
                return;
            }
            
            if (!key) {
                showError('Kunci harus mengandung setidaknya satu huruf');
                return;
            }
            
            let result = '';
            let keyIndex = 0;
            
            for (let char of text) {
                if (char >= 'A' && char <= 'Z') {
                    const p = char.charCodeAt(0) - 65;
                    const k = key.charCodeAt(keyIndex % key.length) - 65;
                    const c = (p + k) % 26;
                    result += String.fromCharCode(c + 65);
                    keyIndex++;
                } else {
                    result += char;
                }
            }
            
            document.getElementById('vigenere-result').value = result;
            addSuccessAnimation(document.getElementById('vigenere-result'));
        } catch (error) {
            showError('Terjadi kesalahan saat enkripsi');
        } finally {
            setButtonLoading(button, false);
        }
    }, 300);
}

function decryptVigenere() {
    const button = event.target;
    setButtonLoading(button, true);
    
    setTimeout(() => {
        try {
            const text = document.getElementById('vigenere-text').value.toUpperCase();
            let key = document.getElementById('vigenere-key').value.toUpperCase().replace(/[^A-Z]/g, '');
            
            if (!text.trim()) {
                showError('Masukkan teks terlebih dahulu');
                return;
            }
            
            if (!key) {
                showError('Kunci harus mengandung setidaknya satu huruf');
                return;
            }
            
            let result = '';
            let keyIndex = 0;
            
            for (let char of text) {
                if (char >= 'A' && char <= 'Z') {
                    const c = char.charCodeAt(0) - 65;
                    const k = key.charCodeAt(keyIndex % key.length) - 65;
                    const p = (c - k + 26) % 26;
                    result += String.fromCharCode(p + 65);
                    keyIndex++;
                } else {
                    result += char;
                }
            }
            
            document.getElementById('vigenere-result').value = result;
            addSuccessAnimation(document.getElementById('vigenere-result'));
        } catch (error) {
            showError('Terjadi kesalahan saat dekripsi');
        } finally {
            setButtonLoading(button, false);
        }
    }, 300);
}

// Hill Cipher
function encryptHill() {
    const button = event.target;
    setButtonLoading(button, true);
    
    setTimeout(() => {
        try {
            const text = cleanText(document.getElementById('hill-text').value);
            const key1 = parseInt(document.getElementById('hill-key-1').value);
            const key2 = parseInt(document.getElementById('hill-key-2').value);
            const key3 = parseInt(document.getElementById('hill-key-3').value);
            const key4 = parseInt(document.getElementById('hill-key-4').value);
            
            if (!text) {
                showError('Masukkan teks terlebih dahulu');
                return;
            }
            
            const keyMatrix = [[key1, key2], [key3, key4]];
            const det = (key1 * key4 - key2 * key3) % 26;
            
            if (gcd(det, 26) !== 1) {
                showError('Determinan matriks kunci harus coprime dengan 26');
                return;
            }
            
            let processedText = text;
            if (processedText.length % 2 !== 0) {
                processedText += 'X';
            }
            
            let result = '';
            for (let i = 0; i < processedText.length; i += 2) {
                const block = [
                    processedText.charCodeAt(i) - 65,
                    processedText.charCodeAt(i + 1) - 65
                ];
                
                const encryptedBlock = [
                    (keyMatrix[0][0] * block[0] + keyMatrix[0][1] * block[1]) % 26,
                    (keyMatrix[1][0] * block[0] + keyMatrix[1][1] * block[1]) % 26
                ];
                
                result += String.fromCharCode(encryptedBlock[0] + 65) + 
                          String.fromCharCode(encryptedBlock[1] + 65);
            }
            
            document.getElementById('hill-result').value = result;
            addSuccessAnimation(document.getElementById('hill-result'));
        } catch (error) {
            showError('Terjadi kesalahan saat enkripsi');
        } finally {
            setButtonLoading(button, false);
        }
    }, 300);
}

function decryptHill() {
    const button = event.target;
    setButtonLoading(button, true);
    
    setTimeout(() => {
        try {
            const text = cleanText(document.getElementById('hill-text').value);
            const key1 = parseInt(document.getElementById('hill-key-1').value);
            const key2 = parseInt(document.getElementById('hill-key-2').value);
            const key3 = parseInt(document.getElementById('hill-key-3').value);
            const key4 = parseInt(document.getElementById('hill-key-4').value);
            
            if (!text) {
                showError('Masukkan teks terlebih dahulu');
                return;
            }
            
            if (text.length % 2 !== 0) {
                showError('Panjang teks harus genap untuk Hill Cipher');
                return;
            }
            
            const keyMatrix = [[key1, key2], [key3, key4]];
            let det = (key1 * key4 - key2 * key3) % 26;
            if (det < 0) det += 26;
            
            if (gcd(det, 26) !== 1) {
                showError('Determinan matriks kunci harus coprime dengan 26');
                return;
            }
            
            const det_inv = modInverse(det, 26);
            if (det_inv === null) {
                showError('Tidak dapat menemukan invers modular untuk determinan');
                return;
            }
            
            const adjugate = [
                [key4, -key2],
                [-key3, key1]
            ];
            
            const invMatrix = [
                [
                    (det_inv * adjugate[0][0]) % 26,
                    (det_inv * adjugate[0][1]) % 26
                ],
                [
                    (det_inv * adjugate[1][0]) % 26,
                    (det_inv * adjugate[1][1]) % 26
                ]
            ];
            
            // Ensure positive values
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    if (invMatrix[i][j] < 0) invMatrix[i][j] += 26;
                }
            }
            
            let result = '';
            for (let i = 0; i < text.length; i += 2) {
                const block = [
                    text.charCodeAt(i) - 65,
                    text.charCodeAt(i + 1) - 65
                ];
                
                const decryptedBlock = [
                    (invMatrix[0][0] * block[0] + invMatrix[0][1] * block[1]) % 26,
                    (invMatrix[1][0] * block[0] + invMatrix[1][1] * block[1]) % 26
                ];
                
                result += String.fromCharCode(decryptedBlock[0] + 65) + 
                          String.fromCharCode(decryptedBlock[1] + 65);
            }
            
            document.getElementById('hill-result').value = result;
            addSuccessAnimation(document.getElementById('hill-result'));
        } catch (error) {
            showError('Terjadi kesalahan saat dekripsi');
        } finally {
            setButtonLoading(button, false);
        }
    }, 300);
}

// Permutation Cipher (fixed)
function encryptPermutation() {
    // ambil teks dan kunci
    const text = cleanText(document.getElementById('permutation-text').value);
    const keyStr = document.getElementById('permutation-key').value;
    
    if (!text) {
        showError('Masukkan teks terlebih dahulu');
        return;
    }
    
    // parse key (as numbers)
    const key = keyStr.split(',').map(s => Number(s.trim()));
    const n = key.length;
    
    if (n < 2) {
        showError('Kunci harus memiliki setidaknya 2 angka');
        return;
    }
    
    // validasi tanpa memodifikasi urutan asli => gunakan salinan untuk sorting
    const sortedKey = [...key].sort((a, b) => a - b);
    const expected = [...Array(n).keys()].map(x => x + 1);
    if (JSON.stringify(sortedKey) !== JSON.stringify(expected)) {
        showError(`Kunci harus berisi angka 1 sampai ${n} tanpa pengulangan`);
        return;
    }
    
    // padding: pastikan positif di JS
    const padding = (n - (text.length % n)) % n; // hasil 0..n-1
    let processedText = text;
    if (padding > 0) {
        processedText += 'X'.repeat(padding);
    }
    
    // enkripsi: tulis per baris, baca per kolom berdasarkan urutan kunci
    let result = '';
    for (let i = 0; i < processedText.length; i += n) {
        const block = processedText.substring(i, i + n);
        // gunakan urutan kolom sesuai key (tanpa mengubah key)
        for (let k = 0; k < n; k++) {
            const colIndex = key[k] - 1; // posisi yang ingin diambil dari block
            if (colIndex < block.length) {
                result += block[colIndex];
            }
        }
    }
    
    document.getElementById('permutation-result').value = result;
}

function decryptPermutation() {
    const text = cleanText(document.getElementById('permutation-text').value);
    const keyStr = document.getElementById('permutation-key').value;
    
    if (!text) {
        showError('Masukkan teks terlebih dahulu');
        return;
    }
    
    const key = keyStr.split(',').map(s => Number(s.trim()));
    const n = key.length;
    
    if (n < 2) {
        showError('Kunci harus memiliki setidaknya 2 angka');
        return;
    }
    
    const sortedKey = [...key].sort((a, b) => a - b);
    const expected = [...Array(n).keys()].map(x => x + 1);
    if (JSON.stringify(sortedKey) !== JSON.stringify(expected)) {
        showError(`Kunci harus berisi angka 1 sampai ${n} tanpa pengulangan`);
        return;
    }
    
    if (text.length % n !== 0) {
        showError(`Panjang teks harus kelipatan dari ${n} (panjang kunci)`);
        return;
    }
    
    let result = '';
    for (let i = 0; i < text.length; i += n) {
        const block = text.substring(i, i + n);
        const decryptedBlock = new Array(n);
        
        // Isi decryptedBlock berdasarkan urutan kunci
        // saat enkripsi, ciphertext posisi j diisi dengan block[keyIndex-1]
        // untuk dekripsi kita tempatkan kembali: decryptedBlock[key[j]-1] = block[j]
        for (let j = 0; j < n; j++) {
            const targetIndex = key[j] - 1; // posisi di plaintext
            decryptedBlock[targetIndex] = block[j];
        }
        
        result += decryptedBlock.join('');
    }
    
    document.getElementById('permutation-result').value = result;
}

// Add macOS-style interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to inputs
    const inputs = document.querySelectorAll('.macos-input, .macos-textarea');
    inputs.forEach(input => {
        input.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
            this.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        input.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            const activeTab = document.querySelector('.tab-content.active').id;
            switch(e.key) {
                case 'e':
                    e.preventDefault();
                    const encryptBtn = document.querySelector(`#${activeTab} .macos-button.primary`);
                    if (encryptBtn) encryptBtn.click();
                    break;
                case 'd':
                    e.preventDefault();
                    const decryptBtn = document.querySelector(`#${activeTab} .macos-button.secondary`);
                    if (decryptBtn) decryptBtn.click();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    // Navigate to previous tab
                    const currentTab = document.querySelector('.tab-button.active');
                    const prevTab = currentTab.previousElementSibling || 
                                  document.querySelector('.tab-button:last-child');
                    if (prevTab) prevTab.click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    // Navigate to next tab
                    const currentTab2 = document.querySelector('.tab-button.active');
                    const nextTab = currentTab2.nextElementSibling || 
                                  document.querySelector('.tab-button:first-child');
                    if (nextTab) nextTab.click();
                    break;
            }
        }
    });
    
    // Add smooth scrolling for better UX
    const tabContents = document.querySelectorAll('.tab-content');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    tabContents.forEach(content => {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(content);
    });
});