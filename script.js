// Tab navigation dengan animasi macOS
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class dari semua button dan content
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });

    // Add active class ke button yang diklik dan content yang sesuai
    button.classList.add("active");
    const tabId = button.dataset.tab;
    document.getElementById(tabId).classList.add("active");

    // Tambah efek smooth scroll untuk mobile
    document
      .getElementById(tabId)
      .scrollIntoView({ behavior: "smooth", block: "nearest" });
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

// DIPERBAIKI: Fungsi cleanText dengan opsi pertahankan karakter non-alphabet
function cleanText(text, preserveNonAlpha = false) {
  if (preserveNonAlpha) {
    // Mode "Pertahankan karakter non-alfabet":
    // Huruf menjadi uppercase, spasi/angka/simbol tetap di posisi aslinya
    return text.toUpperCase();
  } else {
    // Mode default: Hanya ambil huruf A-Z saja, buang semua karakter lain
    return text.toUpperCase().replace(/[^A-Z]/g, "");
  }
}

// Helper: dapatkan checkbox "pertahankan non-alpha" yang sesuai dalam sebuah tab
function getPreserveCheckbox(tabId) {
  const tab = document.getElementById(tabId);
  if (!tab) return null;
  // cari checkbox di dalam tab (scoped lookup) — mengatasi duplikasi id di HTML
  return tab.querySelector(
    ".output-options input[type='checkbox'], input[type='checkbox']"
  );
}

// Helper: dapatkan tombol (fallback jika event tidak disediakan)
function getButtonFor(tabId, typeClass) {
  const tab = document.getElementById(tabId);
  if (!tab) return null;
  return (
    tab.querySelector(`.macos-button.${typeClass}`) ||
    tab.querySelector(".macos-button")
  );
}

// Default behavior untuk setiap tab (preserve non-alpha)
// DIPERBAIKI: hill & permutation -> default false (dan checkbox disembunyikan)
const preserveDefaults = {
  shift: true,
  substitution: true,
  affine: true,
  vigenere: true,
  hill: false,
  permutation: false,
};

function applyPreserveDefaults() {
  Object.keys(preserveDefaults).forEach((tabId) => {
    const cb = getPreserveCheckbox(tabId);
    if (cb) {
      cb.checked = !!preserveDefaults[tabId];
      
      // DIPERBAIKI: Sembunyikan checkbox untuk hill dan permutation
      if (tabId === 'hill' || tabId === 'permutation') {
        const label = cb.closest('label');
        if (label) {
          label.style.display = 'none';
        }
      }
    }
  });
}

// DIPERBAIKI: Fungsi untuk save hasil
function saveResult(cipherType) {
  const resultTextarea = document.getElementById(`${cipherType}-result`);
  if (!resultTextarea || !resultTextarea.value.trim()) {
    showError("Tidak ada hasil untuk disimpan");
    return;
  }

  const content = resultTextarea.value;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cipher_result_${cipherType}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showSuccess("Hasil berhasil disimpan sebagai file");
}

function showError(message) {
  // Buat notifikasi error style macOS
  const notification = document.createElement("div");
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
    notification.style.animation =
      "slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Copy to clipboard function
function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(resolve).catch(reject);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        successful ? resolve() : reject(new Error("Failed to copy text"));
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    }
  });
}

// Show copy notification
function showCopyNotification() {
  const notification = document.getElementById("copy-notification");
  if (!notification) return;
  notification.classList.add("show");
  setTimeout(() => notification.classList.remove("show"), 2000);
}

// Add copy button event listeners (separate listener so it runs early)
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const textToCopy = targetElement.value;

        copyToClipboard(textToCopy)
          .then(() => {
            showCopyNotification();
            const originalIcon = this.innerHTML;
            this.innerHTML = '<span class="copy-icon">✓</span>';
            this.style.opacity = "1";

            setTimeout(() => {
              this.innerHTML = originalIcon;
              this.style.opacity = "0.4";
            }, 1000);
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
            alert("Failed to copy text: " + err.message);
          });
      }
    });
  });
});

// DIPERBAIKI: Fungsi showSuccess untuk notifikasi sukses
function showSuccess(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #34C759;
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        font-family: var(--system-font);
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 8px 24px rgba(52, 199, 89, 0.3);
        animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation =
      "slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Tambahkan keyframes untuk animasi
const style = document.createElement("style");
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
  if (!button) return;
  if (isLoading) {
    button.classList.add("loading");
    button.disabled = true;
  } else {
    button.classList.remove("loading");
    button.disabled = false;
  }
}

// Add success animation
function addSuccessAnimation(element) {
  if (!element) return;
  element.classList.add("success-pulse");
  setTimeout(() => element.classList.remove("success-pulse"), 600);
}

// DIPERBAIKI: Shift Cipher dengan opsi pertahankan karakter non-alphabet
function encryptShift() {
  // fallback button detection (inline onclick mungkin tidak punya event)
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("shift", "primary");

  setButtonLoading(button, true);

  setTimeout(() => {
    try {
      const text = document.getElementById("shift-text").value;
      const key = parseInt(document.getElementById("shift-key").value);

      // DAPATKAN NILAI CHECKBOX "Pertahankan karakter non-alfabet" yang spesifik untuk tab shift
      const preserveNonAlpha = getPreserveCheckbox("shift")?.checked ?? false;

      if (!text.trim()) {
        showError("Masukkan teks terlebih dahulu");
        return;
      }

      if (isNaN(key) || key < 1 || key > 25) {
        showError("Kunci harus antara 1 dan 25");
        return;
      }

      let result = "";

      // GUNAKAN FUNGSI cleanText DENGAN PARAMETER preserveNonAlpha
      const cleanTextValue = cleanText(text, preserveNonAlpha);

      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          // Hanya enkripsi huruf A-Z
          const shifted = (char.charCodeAt(0) - 65 + key) % 26;
          result += String.fromCharCode(shifted + 65);
        } else if (preserveNonAlpha) {
          // Pertahankan karakter non-alfabet seperti spasi, angka, simbol
          result += char;
        }
        // Jika preserveNonAlpha = false, karakter non-alfabet sudah dihapus oleh cleanText()
      }

      document.getElementById("shift-result").value = result;
      addSuccessAnimation(document.getElementById("shift-result"));
    } catch (error) {
      showError("Terjadi kesalahan saat enkripsi");
    } finally {
      setButtonLoading(button, false);
    }
  }, 300);
}

function decryptShift() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("shift", "secondary");

  setButtonLoading(button, true);

  setTimeout(() => {
    try {
      const text = document.getElementById("shift-text").value;
      const key = parseInt(document.getElementById("shift-key").value);

      const preserveNonAlpha = getPreserveCheckbox("shift")?.checked ?? false;

      if (!text.trim()) {
        showError("Masukkan teks terlebih dahulu");
        return;
      }

      if (isNaN(key) || key < 1 || key > 25) {
        showError("Kunci harus antara 1 dan 25");
        return;
      }

      let result = "";

      const cleanTextValue = cleanText(text, preserveNonAlpha);

      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const shifted = (char.charCodeAt(0) - 65 - key + 26) % 26;
          result += String.fromCharCode(shifted + 65);
        } else if (preserveNonAlpha) {
          result += char;
        }
      }

      document.getElementById("shift-result").value = result;
      addSuccessAnimation(document.getElementById("shift-result"));
    } catch (error) {
      showError("Terjadi kesalahan saat dekripsi");
    } finally {
      setButtonLoading(button, false);
    }
  }, 300);
}

// DIPERBAIKI: Substitution Cipher dengan opsi pertahankan karakter non-alphabet
function encryptSubstitution() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("substitution", "primary");
  setButtonLoading(button, true);

  setTimeout(() => {
    try {
      const text = document.getElementById("substitution-text").value;
      const key = document
        .getElementById("substitution-key")
        .value.toUpperCase();

      const preserveNonAlpha =
        getPreserveCheckbox("substitution")?.checked ?? false;

      if (!text.trim()) {
        showError("Masukkan teks terlebih dahulu");
        return;
      }

      if (
        key.length !== 26 ||
        !/^[A-Z]+$/.test(key) ||
        new Set(key).size !== 26
      ) {
        showError("Kunci harus berupa 26 huruf unik (A-Z)");
        return;
      }

      let result = "";

      const cleanTextValue = cleanText(text, preserveNonAlpha);

      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const index = char.charCodeAt(0) - 65;
          result += key[index];
        } else if (preserveNonAlpha) {
          result += char;
        }
      }

      document.getElementById("substitution-result").value = result;
      addSuccessAnimation(document.getElementById("substitution-result"));
    } catch (error) {
      showError("Terjadi kesalahan saat enkripsi");
    } finally {
      setButtonLoading(button, false);
    }
  }, 300);
}

function decryptSubstitution() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("substitution", "secondary");
  setButtonLoading(button, true);

  setTimeout(() => {
    try {
      const text = document.getElementById("substitution-text").value;
      const key = document
        .getElementById("substitution-key")
        .value.toUpperCase();

      const preserveNonAlpha =
        getPreserveCheckbox("substitution")?.checked ?? false;

      if (!text.trim()) {
        showError("Masukkan teks terlebih dahulu");
        return;
      }

      if (
        key.length !== 26 ||
        !/^[A-Z]+$/.test(key) ||
        new Set(key).size !== 26
      ) {
        showError("Kunci harus berupa 26 huruf unik (A-Z)");
        return;
      }

      let result = "";

      const cleanTextValue = cleanText(text, preserveNonAlpha);

      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const index = key.indexOf(char);
          result += String.fromCharCode(index + 65);
        } else if (preserveNonAlpha) {
          result += char;
        }
      }

      document.getElementById("substitution-result").value = result;
      addSuccessAnimation(document.getElementById("substitution-result"));
    } catch (error) {
      showError("Terjadi kesalahan saat dekripsi");
    } finally {
      setButtonLoading(button, false);
    }
  }, 300);
}

// DIPERBAIKI: Affine Cipher dengan opsi pertahankan karakter non-alphabet
function encryptAffine() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("affine", "primary");
  setButtonLoading(button, true);

  setTimeout(() => {
    try {
      const text = document.getElementById("affine-text").value;
      const a = parseInt(document.getElementById("affine-key-a").value);
      const b = parseInt(document.getElementById("affine-key-b").value);

      const preserveNonAlpha = getPreserveCheckbox("affine")?.checked ?? false;

      if (!text.trim()) {
        showError("Masukkan teks terlebih dahulu");
        return;
      }

      if (gcd(a, 26) !== 1) {
        showError("Kunci a harus coprime dengan 26 (gcd(a,26)=1)");
        return;
      }

      if (b < 0 || b > 25) {
        showError("Kunci b harus antara 0 dan 25");
        return;
      }

      let result = "";

      const cleanTextValue = cleanText(text, preserveNonAlpha);

      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const p = char.charCodeAt(0) - 65;
          const c = (a * p + b) % 26;
          result += String.fromCharCode(c + 65);
        } else if (preserveNonAlpha) {
          result += char;
        }
      }

      document.getElementById("affine-result").value = result;
      addSuccessAnimation(document.getElementById("affine-result"));
    } catch (error) {
      showError("Terjadi kesalahan saat enkripsi");
    } finally {
      setButtonLoading(button, false);
    }
  }, 300);
}

function decryptAffine() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("affine", "secondary");
  setButtonLoading(button, true);

  setTimeout(() => {
    try {
      const text = document.getElementById("affine-text").value;
      const a = parseInt(document.getElementById("affine-key-a").value);
      const b = parseInt(document.getElementById("affine-key-b").value);

      const preserveNonAlpha = getPreserveCheckbox("affine")?.checked ?? false;

      if (!text.trim()) {
        showError("Masukkan teks terlebih dahulu");
        return;
      }

      if (gcd(a, 26) !== 1) {
        showError("Kunci a harus coprime dengan 26 (gcd(a,26)=1)");
        return;
      }

      if (b < 0 || b > 25) {
        showError("Kunci b harus antara 0 dan 25");
        return;
      }

      const a_inv = modInverse(a, 26);
      if (a_inv === null) {
        showError("Tidak dapat menemukan invers modular untuk kunci a");
        return;
      }

      let result = "";

      const cleanTextValue = cleanText(text, preserveNonAlpha);

      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const c = char.charCodeAt(0) - 65;
          const p = (a_inv * (c - b + 26)) % 26;
          result += String.fromCharCode(p + 65);
        } else if (preserveNonAlpha) {
          result += char;
        }
      }

      document.getElementById("affine-result").value = result;
      addSuccessAnimation(document.getElementById("affine-result"));
    } catch (error) {
      showError("Terjadi kesalahan saat dekripsi");
    } finally {
      setButtonLoading(button, false);
    }
  }, 300);
}

// DIPERBAIKI: Vigenere Cipher dengan opsi pertahankan karakter non-alphabet
function encryptVigenere() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("vigenere", "primary");
  setButtonLoading(button, true);

  setTimeout(() => {
    try {
      const text = document.getElementById("vigenere-text").value;
      let key = document
        .getElementById("vigenere-key")
        .value.toUpperCase()
        .replace(/[^A-Z]/g, "");

      const preserveNonAlpha =
        getPreserveCheckbox("vigenere")?.checked ?? false;

      if (!text.trim()) {
        showError("Masukkan teks terlebih dahulu");
        return;
      }

      if (!key) {
        showError("Kunci harus mengandung setidaknya satu huruf");
        return;
      }

      let result = "";
      let keyIndex = 0;

      const cleanTextValue = cleanText(text, preserveNonAlpha);

      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const p = char.charCodeAt(0) - 65;
          const k = key.charCodeAt(keyIndex % key.length) - 65;
          const c = (p + k) % 26;
          result += String.fromCharCode(c + 65);
          keyIndex++;
        } else if (preserveNonAlpha) {
          result += char;
          // Tidak increment keyIndex untuk karakter non-alfabet
        }
      }

      document.getElementById("vigenere-result").value = result;
      addSuccessAnimation(document.getElementById("vigenere-result"));
    } catch (error) {
      showError("Terjadi kesalahan saat enkripsi");
    } finally {
      setButtonLoading(button, false);
    }
  }, 300);
}

function decryptVigenere() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("vigenere", "secondary");
  setButtonLoading(button, true);

  setTimeout(() => {
    try {
      const text = document.getElementById("vigenere-text").value;
      let key = document
        .getElementById("vigenere-key")
        .value.toUpperCase()
        .replace(/[^A-Z]/g, "");

      const preserveNonAlpha =
        getPreserveCheckbox("vigenere")?.checked ?? false;

      if (!text.trim()) {
        showError("Masukkan teks terlebih dahulu");
        return;
      }

      if (!key) {
        showError("Kunci harus mengandung setidaknya satu huruf");
        return;
      }

      let result = "";
      let keyIndex = 0;

      const cleanTextValue = cleanText(text, preserveNonAlpha);

      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const c = char.charCodeAt(0) - 65;
          const k = key.charCodeAt(keyIndex % key.length) - 65;
          const p = (c - k + 26) % 26;
          result += String.fromCharCode(p + 65);
          keyIndex++;
        } else if (preserveNonAlpha) {
          result += char;
          // Tidak increment keyIndex untuk karakter non-alfabet
        }
      }

      document.getElementById("vigenere-result").value = result;
      addSuccessAnimation(document.getElementById("vigenere-result"));
    } catch (error) {
      showError("Terjadi kesalahan saat dekripsi");
    } finally {
      setButtonLoading(button, false);
    }
  }, 300);
}

// DIPERBAIKI: Hill Cipher - HILANGKAN opsi pertahankan karakter non-alphabet
function encryptHill() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("hill", "primary");
  setButtonLoading(button, true);

  setTimeout(() => {
    try {
      const text = document.getElementById("hill-text").value;
      const key1 = parseInt(document.getElementById("hill-key-1").value);
      const key2 = parseInt(document.getElementById("hill-key-2").value);
      const key3 = parseInt(document.getElementById("hill-key-3").value);
      const key4 = parseInt(document.getElementById("hill-key-4").value);

      // DIPERBAIKI: Hill Cipher TIDAK menggunakan opsi preserveNonAlpha
      // Langsung set ke false
      const preserveNonAlpha = false;

      if (!text.trim()) {
        showError("Masukkan teks terlebih dahulu");
        return;
      }

      // DIPERBAIKI: Hill Cipher hanya memproses huruf, tidak ada opsi preserve
      const cleanTextValue = text.toUpperCase().replace(/[^A-Z]/g, "");

      if (!cleanTextValue) {
        showError("Teks harus mengandung huruf untuk Hill Cipher");
        return;
      }

      const keyMatrix = [
        [key1, key2],
        [key3, key4],
      ];
      let det = (key1 * key4 - key2 * key3) % 26;
      if (det < 0) det += 26;

      if (gcd(det, 26) !== 1) {
        showError("Determinan matriks kunci harus coprime dengan 26");
        return;
      }

      let processedText = cleanTextValue;
      if (processedText.length % 2 !== 0) {
        processedText += "X";
      }

      let encryptedLetters = "";
      for (let i = 0; i < processedText.length; i += 2) {
        const block = [
          processedText.charCodeAt(i) - 65,
          processedText.charCodeAt(i + 1) - 65,
        ];

        const encryptedBlock = [
          (keyMatrix[0][0] * block[0] + keyMatrix[0][1] * block[1]) % 26,
          (keyMatrix[1][0] * block[0] + keyMatrix[1][1] * block[1]) % 26,
        ];

        encryptedLetters +=
          String.fromCharCode(encryptedBlock[0] + 65) +
          String.fromCharCode(encryptedBlock[1] + 65);
      }

      // DIPERBAIKI: Hill Cipher tidak mendukung preserve non-alpha
      // Hasil hanya berisi huruf
      const result = encryptedLetters;

      document.getElementById("hill-result").value = result;
      addSuccessAnimation(document.getElementById("hill-result"));
    } catch (error) {
      showError("Terjadi kesalahan saat enkripsi");
    } finally {
      setButtonLoading(button, false);
    }
  }, 300);
}

function decryptHill() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("hill", "secondary");
  setButtonLoading(button, true);

  setTimeout(() => {
    try {
      const text = document.getElementById("hill-text").value;
      const key1 = parseInt(document.getElementById("hill-key-1").value);
      const key2 = parseInt(document.getElementById("hill-key-2").value);
      const key3 = parseInt(document.getElementById("hill-key-3").value);
      const key4 = parseInt(document.getElementById("hill-key-4").value);

      // DIPERBAIKI: Hill Cipher TIDAK menggunakan opsi preserveNonAlpha
      // Langsung set ke false
      const preserveNonAlpha = false;

      if (!text.trim()) {
        showError("Masukkan teks terlebih dahulu");
        return;
      }

      // DIPERBAIKI: Hill Cipher hanya memproses huruf, tidak ada opsi preserve
      const cleanTextValue = text.toUpperCase().replace(/[^A-Z]/g, "");

      if (!cleanTextValue) {
        showError("Teks harus mengandung huruf untuk Hill Cipher");
        return;
      }

      if (cleanTextValue.length % 2 !== 0) {
        showError("Panjang teks huruf harus genap untuk Hill Cipher");
        return;
      }

      const keyMatrix = [
        [key1, key2],
        [key3, key4],
      ];
      let det = (key1 * key4 - key2 * key3) % 26;
      if (det < 0) det += 26;

      if (gcd(det, 26) !== 1) {
        showError("Determinan matriks kunci harus coprime dengan 26");
        return;
      }

      const det_inv = modInverse(det, 26);
      if (det_inv === null) {
        showError("Tidak dapat menemukan invers modular untuk determinan");
        return;
      }

      const adjugate = [
        [key4, -key2],
        [-key3, key1],
      ];

      const invMatrix = [
        [(det_inv * adjugate[0][0]) % 26, (det_inv * adjugate[0][1]) % 26],
        [(det_inv * adjugate[1][0]) % 26, (det_inv * adjugate[1][1]) % 26],
      ];

      // Ensure positive values
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          if (invMatrix[i][j] < 0) invMatrix[i][j] += 26;
        }
      }

      let decryptedLetters = "";
      for (let i = 0; i < cleanTextValue.length; i += 2) {
        const block = [
          cleanTextValue.charCodeAt(i) - 65,
          cleanTextValue.charCodeAt(i + 1) - 65,
        ];

        const decryptedBlock = [
          (invMatrix[0][0] * block[0] + invMatrix[0][1] * block[1]) % 26,
          (invMatrix[1][0] * block[0] + invMatrix[1][1] * block[1]) % 26,
        ];

        decryptedLetters +=
          String.fromCharCode(decryptedBlock[0] + 65) +
          String.fromCharCode(decryptedBlock[1] + 65);
      }

      // DIPERBAIKI: Hill Cipher tidak mendukung preserve non-alpha
      // Hasil hanya berisi huruf
      const result = decryptedLetters;

      document.getElementById("hill-result").value = result;
      addSuccessAnimation(document.getElementById("hill-result"));
    } catch (error) {
      showError("Terjadi kesalahan saat dekripsi");
    } finally {
      setButtonLoading(button, false);
    }
  }, 300);
}

// DIPERBAIKI: Permutation Cipher - HILANGKAN opsi pertahankan karakter non-alphabet
function encryptPermutation() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("permutation", "primary");
  setButtonLoading(button, true);

  setTimeout(() => {
    try {
      const text = document.getElementById("permutation-text").value;
      const keyStr = document.getElementById("permutation-key").value;

      // DIPERBAIKI: Permutation Cipher TIDAK menggunakan opsi preserveNonAlpha
      // Langsung set ke false
      const preserveNonAlpha = false;

      if (!text.trim()) {
        showError("Masukkan teks terlebih dahulu");
        return;
      }

      // parse key (as numbers)
      const key = keyStr.split(",").map((s) => Number(s.trim()));
      const n = key.length;

      if (n < 2) {
        showError("Kunci harus memiliki setidaknya 2 angka");
        return;
      }

      const sortedKey = [...key].sort((a, b) => a - b);
      const expected = [...Array(n).keys()].map((x) => x + 1);
      if (JSON.stringify(sortedKey) !== JSON.stringify(expected)) {
        showError(`Kunci harus berisi angka 1 sampai ${n} tanpa pengulangan`);
        return;
      }

      // DIPERBAIKI: Permutation Cipher hanya memproses huruf, tidak ada opsi preserve
      const cleanTextValue = text.toUpperCase().replace(/[^A-Z]/g, "");

      if (!cleanTextValue) {
        showError("Teks harus mengandung huruf untuk Permutation Cipher");
        return;
      }

      let result = "";

      // DIPERBAIKI: Permutation Cipher tidak mendukung preserve non-alpha
      // Langsung proses teks yang sudah dibersihkan dari non-alpha
      const padding = (n - (cleanTextValue.length % n)) % n;
      let processedText = cleanTextValue;
      if (padding > 0) {
        processedText += "X".repeat(padding);
      }

      for (let i = 0; i < processedText.length; i += n) {
        const block = processedText.substring(i, i + n);
        for (let k = 0; k < n; k++) {
          const colIndex = key[k] - 1;
          if (colIndex < block.length) {
            result += block[colIndex];
          }
        }
      }

      document.getElementById("permutation-result").value = result;
      addSuccessAnimation(document.getElementById("permutation-result"));
    } catch (error) {
      showError("Terjadi kesalahan saat enkripsi");
    } finally {
      setButtonLoading(button, false);
    }
  }, 300);
}

function decryptPermutation() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("permutation", "secondary");
  setButtonLoading(button, true);

  setTimeout(() => {
    try {
      const text = document.getElementById("permutation-text").value;
      const keyStr = document.getElementById("permutation-key").value;

      // DIPERBAIKI: Permutation Cipher TIDAK menggunakan opsi preserveNonAlpha
      // Langsung set ke false
      const preserveNonAlpha = false;

      if (!text.trim()) {
        showError("Masukkan teks terlebih dahulu");
        return;
      }

      const key = keyStr.split(",").map((s) => Number(s.trim()));
      const n = key.length;

      if (n < 2) {
        showError("Kunci harus memiliki setidaknya 2 angka");
        return;
      }

      const sortedKey = [...key].sort((a, b) => a - b);
      const expected = [...Array(n).keys()].map((x) => x + 1);
      if (JSON.stringify(sortedKey) !== JSON.stringify(expected)) {
        showError(`Kunci harus berisi angka 1 sampai ${n} tanpa pengulangan`);
        return;
      }

      // DIPERBAIKI: Permutation Cipher hanya memproses huruf, tidak ada opsi preserve
      const cleanTextValue = text.toUpperCase().replace(/[^A-Z]/g, "");

      if (!cleanTextValue) {
        showError("Teks harus mengandung huruf untuk Permutation Cipher");
        return;
      }

      if (cleanTextValue.length % n !== 0) {
        showError(`Panjang teks harus kelipatan dari ${n} (panjang kunci)`);
        return;
      }

      let result = "";

      // DIPERBAIKI: Permutation Cipher tidak mendukung preserve non-alpha
      // Langsung proses teks yang sudah dibersihkan dari non-alpha
      for (let i = 0; i < cleanTextValue.length; i += n) {
        const block = cleanTextValue.substring(i, i + n);
        const decryptedBlock = new Array(n);

        for (let j = 0; j < n; j++) {
          const targetIndex = key[j] - 1;
          decryptedBlock[targetIndex] = block[j];
        }

        result += decryptedBlock.join("");
      }

      document.getElementById("permutation-result").value = result;
      addSuccessAnimation(document.getElementById("permutation-result"));
    } catch (error) {
      showError("Terjadi kesalahan saat dekripsi");
    } finally {
      setButtonLoading(button, false);
    }
  }, 300);
}

// Add macOS-style interactions & init defaults
document.addEventListener("DOMContentLoaded", function () {
  // Apply default preserve settings
  applyPreserveDefaults();

  // Add smooth interactions
  document.querySelectorAll("input, textarea, select").forEach((element) => {
    element.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    element.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused");
    });
  });

  // Add button hover effects
  document.querySelectorAll(".macos-button").forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-1px)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Add auto-resize for textareas
  document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
  });

  // Initialize textarea heights
  document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });
});