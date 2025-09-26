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
      if (tabId === "hill" || tabId === "permutation") {
        const label = cb.closest("label");
        if (label) {
          label.style.display = "none";
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

  // Get metadata from the result textarea's data attributes
  const isFile = resultTextarea.dataset.isFile === "true";
  const fileType = resultTextarea.dataset.fileType || "text";
  const originalFilename = resultTextarea.dataset.originalFilename;

  saveResultWithType(cipherType, resultTextarea.value, isFile, fileType, originalFilename);
}

// script.js -> Tambahkan di bagian Utility functions

function formatOutput(cipherType) {
    const resultTextarea = document.getElementById(`${cipherType}-result`);
    if (!resultTextarea) return;

    // Ambil hasil mentah yang kita simpan sebelumnya
    const rawResult = resultTextarea.dataset.rawResult || '';
    if (!rawResult) {
        resultTextarea.value = ''; // Kosongkan jika tidak ada hasil
        return;
    }

    // Jangan format jika hasilnya adalah file biner
    if (resultTextarea.dataset.fileType === 'binary') {
        resultTextarea.value = rawResult;
        return;
    }

    const selectedFormat = document.querySelector(`input[name="${cipherType}-format"]:checked`);
    const format = selectedFormat ? selectedFormat.value : 'plain';

    if (format === 'group5') {
        const noSpaces = rawResult.replace(/\s/g, ''); // Hapus spasi dulu
        resultTextarea.value = noSpaces.match(/.{1,5}/g)?.join(' ') || '';
    } else { // 'plain'
        resultTextarea.value = rawResult.replace(/\s/g, ''); // Tampilkan tanpa spasi
    }
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

// File handling utilities
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileType(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const textTypes = ["txt", "md", "csv", "json", "xml", "html", "css", "js"];
  return textTypes.includes(ext) ? "text" : "binary";
}

// Convert ArrayBuffer to Base64 for binary files
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 back to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Read file content (text or binary)
async function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const fileType = getFileType(file.name);

    reader.onload = function (e) {
      if (fileType === "text") {
        resolve({
          content: e.target.result,
          type: "text",
          filename: file.name,
          size: file.size,
        });
      } else {
        // For binary files, convert to base64
        const base64 = arrayBufferToBase64(e.target.result);
        resolve({
          content: base64,
          type: "binary",
          filename: file.name,
          size: file.size,
        });
      }
    };

    reader.onerror = function () {
      reject(new Error("Failed to read file"));
    };

    if (fileType === "text") {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}

// Get input content (from file or textarea)
async function getInputContent(tabId) {
  const fileInput = document.getElementById(`${tabId}-file`);
  const textInput = document.getElementById(`${tabId}-text`);

  if (fileInput && fileInput.files.length > 0) {
    try {
      const fileData = await readFileContent(fileInput.files[0]);
      return {
        content: fileData.content,
        isFile: true,
        fileType: fileData.type,
        filename: fileData.filename,
        size: fileData.size,
      };
    } catch (error) {
      throw new Error("Failed to read file: " + error.message);
    }
  } else {
    return {
      content: textInput.value,
      isFile: false,
      fileType: "text",
      filename: null,
      size: 0,
    };
  }
}

function saveResultWithType(cipherType, content, isFile, fileType, originalFilename) {
    if (!content || (typeof content === "string" && !content.trim())) {
        showError("Tidak ada hasil untuk disimpan");
        return;
    }

    const resultTextarea = document.getElementById(`${cipherType}-result`);
    const isDecryption = resultTextarea.dataset.isDecryption === "true";
    let filename;

    if (isDecryption && isFile && originalFilename) {
        // KASUS 1: Dekripsi file -> coba kembalikan nama asli
        // Contoh: "laporan_encrypted_vigenere.txt" -> "decrypted_laporan.txt"
        let restoredName = originalFilename.replace(`_encrypted_${cipherType}`, '');
        
        // Jika penggantian tidak terjadi (misal, nama file tidak cocok pola),
        // tetap gunakan nama file ciphertext sebagai dasar.
        if (restoredName === originalFilename) {
            filename = `decrypted_${originalFilename}`;
        } else {
            filename = `decrypted_${restoredName}`;
        }

    } else if (!isDecryption && isFile && originalFilename) {
        // KASUS 2: Enkripsi file -> tambahkan suffix sebelum ekstensi
        // Contoh: "laporan.txt" -> "laporan_encrypted_vigenere.txt"
        const parts = originalFilename.split('.');
        const ext = parts.length > 1 ? parts.pop() : ''; // Ambil ekstensi asli
        const baseName = parts.join('.');
        filename = `${baseName}_encrypted_${cipherType}${ext ? '.' + ext : ''}`;

    } else {
        // KASUS 3: Operasi dari/ke textarea (tidak ada file asli)
        const prefix = isDecryption ? 'decrypted' : 'encrypted';
        filename = `${prefix}_${cipherType}_result.txt`;
    }
    // --- AKHIR LOGIKA PENAMAAN FILE ---

    let blob;
    if (isFile && fileType === "binary") {
        const arrayBuffer = base64ToArrayBuffer(content);
        blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
    } else {
        blob = new Blob([resultTextarea.value], { type: "text/plain" });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSuccess(`Hasil berhasil disimpan sebagai ${filename}`);
}

// Add file input event listeners
function setupFileInputListeners() {
  const cipherTypes = [
    "shift",
    "substitution",
    "affine",
    "vigenere",
    "hill",
    "permutation",
    "playfair",
    "otp",
  ];

  cipherTypes.forEach((type) => {
    const fileInput = document.getElementById(`${type}-file`);
    const fileInfo = document.getElementById(`${type}-file-info`);
    const textInput = document.getElementById(`${type}-text`);

    if (fileInput && fileInfo) {
      fileInput.addEventListener("change", function () {
        if (this.files.length > 0) {
          const file = this.files[0];
          const fileType = getFileType(file.name);
          const size = formatFileSize(file.size);

          fileInfo.innerHTML = `
            <span>${file.name}</span>
            <span class="file-type-badge">${fileType}</span>
            <span class="file-size">${size}</span>
          `;
          fileInfo.classList.add("has-file");

          // Clear text input when file is selected
          if (textInput) {
            textInput.value = "";
            textInput.placeholder = "File selected. Text input disabled.";
            textInput.disabled = true;
          }
        } else {
          fileInfo.textContent = "No file selected";
          fileInfo.classList.remove("has-file");

          // Re-enable text input when no file
          if (textInput) {
            textInput.disabled = false;
            textInput.placeholder = "Masukkan teks di sini...";
          }
        }
      });
    }
  });
}

// Modified encryption/decryption functions to handle file input

// DIPERBAIKI: Shift Cipher with file support
async function encryptShift() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("shift", "primary");
  setButtonLoading(button, true);

  try {
    const inputData = await getInputContent("shift");
    const key = parseInt(document.getElementById("shift-key").value);
    const preserveNonAlpha = getPreserveCheckbox("shift")?.checked ?? false;

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }

    if (isNaN(key) || key < 1 || key > 25) {
      showError("Kunci harus antara 1 dan 25");
      return;
    }

    let result = "";
    let contentToProcess = inputData.content;

    if (inputData.isFile && inputData.fileType === "binary") {
      // For binary files, work with base64 string
      for (let char of contentToProcess) {
        const charCode = char.charCodeAt(0);
        const shifted = (charCode + key) % 256;
        result += String.fromCharCode(shifted);
      }
    } else {
      // Text processing (same as before)
      const cleanTextValue = cleanText(contentToProcess, preserveNonAlpha);
      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const shifted = (char.charCodeAt(0) - 65 + key) % 26;
          result += String.fromCharCode(shifted + 65);
        } else if (preserveNonAlpha) {
          result += char;
        }
      }
    }

    const resultTextarea = document.getElementById("shift-result");
    resultTextarea.dataset.rawResult = result;

    // 2. Simpan metadata file
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = inputData.fileType;
    resultTextarea.dataset.originalFilename = inputData.filename || "";
    resultTextarea.dataset.isDecryption = "false"; // Tandai sebagai hasil enkripsi

    // 3. Panggil fungsi formatOutput untuk tampilan awal
    formatOutput('shift');
    addSuccessAnimation(resultTextarea);
  } catch (error) {
    showError("Terjadi kesalahan saat enkripsi: " + error.message);
  } finally {
    setButtonLoading(button, false);
  }
}

async function decryptShift() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("shift", "secondary");
  setButtonLoading(button, true);

  try {
    const inputData = await getInputContent("shift");
    const key = parseInt(document.getElementById("shift-key").value);
    const preserveNonAlpha = getPreserveCheckbox("shift")?.checked ?? false;

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }

    if (isNaN(key) || key < 1 || key > 25) {
      showError("Kunci harus antara 1 dan 25");
      return;
    }

    let result = "";
    let contentToProcess = inputData.content;

    if (inputData.isFile && inputData.fileType === "binary") {
      // For binary files, work with base64 string
      for (let char of contentToProcess) {
        const charCode = char.charCodeAt(0);
        const shifted = (charCode - key + 256) % 256;
        result += String.fromCharCode(shifted);
      }
    } else {
      // Text processing (same as before)
      const cleanTextValue = cleanText(contentToProcess, preserveNonAlpha);
      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const shifted = (char.charCodeAt(0) - 65 - key + 26) % 26;
          result += String.fromCharCode(shifted + 65);
        } else if (preserveNonAlpha) {
          result += char;
        }
      }
    }

    const resultTextarea = document.getElementById("shift-result");
    resultTextarea.value = result;

    resultTextarea.dataset.rawResult = result; // Simpan hasil mentah juga
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = inputData.fileType;

    // Tandai sebagai hasil dekripsi dan simpan nama file asli
    if (inputData.isFile) {
      resultTextarea.dataset.originalFilename = inputData.filename;
      resultTextarea.dataset.isDecryption = "true";
    } else {
      resultTextarea.dataset.originalFilename = "";
      resultTextarea.dataset.isDecryption = "true"; // Tetap tandai sbg dekripsi
    }
    
    addSuccessAnimation(resultTextarea);
  } catch (error) {
    showError("Terjadi kesalahan saat dekripsi: " + error.message);
  } finally {
    setButtonLoading(button, false);
  }
}

// Note: Similar modifications should be applied to other cipher functions
// For brevity, I'll show the pattern for substitution cipher as well

async function encryptSubstitution() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("substitution", "primary");
  setButtonLoading(button, true);

  try {
    const inputData = await getInputContent("substitution");
    const key = document.getElementById("substitution-key").value.toUpperCase();
    const preserveNonAlpha = getPreserveCheckbox("substitution")?.checked ?? false;

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }

    if (key.length !== 26 || !/^[A-Z]+$/.test(key) || new Set(key).size !== 26) {
      showError("Kunci harus berupa 26 huruf unik (A-Z)");
      return;
    }

    let result = "";
    let contentToProcess = inputData.content;

    if (inputData.isFile && inputData.fileType === "binary") {
      // For binary files, apply substitution to each byte
      for (let char of contentToProcess) {
        const charCode = char.charCodeAt(0);
        const mappedCode = (charCode + key.charCodeAt(charCode % 26) - 65) % 256;
        result += String.fromCharCode(mappedCode);
      }
    } else {
      // Text processing
      const cleanTextValue = cleanText(contentToProcess, preserveNonAlpha);
      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const index = char.charCodeAt(0) - 65;
          result += key[index];
        } else if (preserveNonAlpha) {
          result += char;
        }
      }
    }

    const resultTextarea = document.getElementById("substitution-result");
    resultTextarea.dataset.rawResult = result;

    // 2. Simpan metadata file
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = inputData.fileType;
    resultTextarea.dataset.originalFilename = inputData.filename || "";
    resultTextarea.dataset.isDecryption = "false"; // Tandai sebagai hasil enkripsi

    // 3. Panggil fungsi formatOutput untuk tampilan awal
    formatOutput('substitution');
    addSuccessAnimation(resultTextarea);
  } catch (error) {
    showError("Terjadi kesalahan saat enkripsi: " + error.message);
  } finally {
    setButtonLoading(button, false);
  }
}

async function decryptSubstitution() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("substitution", "secondary");
  setButtonLoading(button, true);

  try {
    const inputData = await getInputContent("substitution");
    const key = document.getElementById("substitution-key").value.toUpperCase();
    const preserveNonAlpha = getPreserveCheckbox("substitution")?.checked ?? false;

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }

    if (key.length !== 26 || !/^[A-Z]+$/.test(key) || new Set(key).size !== 26) {
      showError("Kunci harus berupa 26 huruf unik (A-Z)");
      return;
    }

    let result = "";
    let contentToProcess = inputData.content;

    if (inputData.isFile && inputData.fileType === "binary") {
      // For binary files, reverse substitution
      for (let char of contentToProcess) {
        const charCode = char.charCodeAt(0);
        const mappedCode = (charCode - key.charCodeAt(charCode % 26) + 65 + 256) % 256;
        result += String.fromCharCode(mappedCode);
      }
    } else {
      // Text processing
      const cleanTextValue = cleanText(contentToProcess, preserveNonAlpha);
      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const index = key.indexOf(char);
          result += String.fromCharCode(index + 65);
        } else if (preserveNonAlpha) {
          result += char;
        }
      }
    }

    const resultTextarea = document.getElementById("substitution-result");
    resultTextarea.value = result;

    resultTextarea.dataset.rawResult = result; // Simpan hasil mentah juga
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = inputData.fileType;

    // Tandai sebagai hasil dekripsi dan simpan nama file asli
    if (inputData.isFile) {
      resultTextarea.dataset.originalFilename = inputData.filename;
      resultTextarea.dataset.isDecryption = "true";
    } else {
      resultTextarea.dataset.originalFilename = "";
      resultTextarea.dataset.isDecryption = "true"; // Tetap tandai sbg dekripsi
    }

    addSuccessAnimation(resultTextarea);
  } catch (error) {
    showError("Terjadi kesalahan saat dekripsi: " + error.message);
  } finally {
    setButtonLoading(button, false);
  }
}

// DIPERBAIKI: Affine Cipher dengan file support
async function encryptAffine() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("affine", "primary");
  setButtonLoading(button, true);

  try {
    const inputData = await getInputContent("affine");
    const a = parseInt(document.getElementById("affine-key-a").value);
    const b = parseInt(document.getElementById("affine-key-b").value);
    const preserveNonAlpha = getPreserveCheckbox("affine")?.checked ?? false;

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
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
    let contentToProcess = inputData.content;

    if (inputData.isFile && inputData.fileType === "binary") {
      // For binary files, apply affine transformation to each byte
      for (let char of contentToProcess) {
        const charCode = char.charCodeAt(0);
        const transformed = (a * charCode + b) % 256;
        result += String.fromCharCode(transformed);
      }
    } else {
      // Text processing
      const cleanTextValue = cleanText(contentToProcess, preserveNonAlpha);
      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const p = char.charCodeAt(0) - 65;
          const c = (a * p + b) % 26;
          result += String.fromCharCode(c + 65);
        } else if (preserveNonAlpha) {
          result += char;
        }
      }
    }

    const resultTextarea = document.getElementById("affine-result");
    resultTextarea.dataset.rawResult = result;

    // 2. Simpan metadata file
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = inputData.fileType;
    resultTextarea.dataset.originalFilename = inputData.filename || "";
    resultTextarea.dataset.isDecryption = "false"; // Tandai sebagai hasil enkripsi

    // 3. Panggil fungsi formatOutput untuk tampilan awal
    formatOutput('affine');

    addSuccessAnimation(resultTextarea);
  } catch (error) {
    showError("Terjadi kesalahan saat enkripsi: " + error.message);
  } finally {
    setButtonLoading(button, false);
  }
}

async function decryptAffine() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("affine", "secondary");
  setButtonLoading(button, true);

  try {
    const inputData = await getInputContent("affine");
    const a = parseInt(document.getElementById("affine-key-a").value);
    const b = parseInt(document.getElementById("affine-key-b").value);
    const preserveNonAlpha = getPreserveCheckbox("affine")?.checked ?? false;

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
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
    let contentToProcess = inputData.content;

    if (inputData.isFile && inputData.fileType === "binary") {
      // For binary files, apply inverse affine transformation
      const a_inv = modInverse(a, 256);
      if (a_inv === null) {
        showError("Tidak dapat menemukan invers modular untuk kunci a");
        return;
      }

      for (let char of contentToProcess) {
        const charCode = char.charCodeAt(0);
        const transformed = (a_inv * (charCode - b + 256)) % 256;
        result += String.fromCharCode(transformed);
      }
    } else {
      // Text processing
      const a_inv = modInverse(a, 26);
      if (a_inv === null) {
        showError("Tidak dapat menemukan invers modular untuk kunci a");
        return;
      }

      const cleanTextValue = cleanText(contentToProcess, preserveNonAlpha);
      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const c = char.charCodeAt(0) - 65;
          const p = (a_inv * (c - b + 26)) % 26;
          result += String.fromCharCode(p + 65);
        } else if (preserveNonAlpha) {
          result += char;
        }
      }
    }

    const resultTextarea = document.getElementById("affine-result");
    resultTextarea.value = result;

    resultTextarea.dataset.rawResult = result; // Simpan hasil mentah juga
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = inputData.fileType;

    // Tandai sebagai hasil dekripsi dan simpan nama file asli
    if (inputData.isFile) {
      resultTextarea.dataset.originalFilename = inputData.filename;
      resultTextarea.dataset.isDecryption = "true";
    } else {
      resultTextarea.dataset.originalFilename = "";
      resultTextarea.dataset.isDecryption = "true"; // Tetap tandai sbg dekripsi
    }

    addSuccessAnimation(resultTextarea);
  } catch (error) {
    showError("Terjadi kesalahan saat dekripsi: " + error.message);
  } finally {
    setButtonLoading(button, false);
  }
}

// DIPERBAIKI: Vigenere Cipher dengan file support
async function encryptVigenere() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("vigenere", "primary");
  setButtonLoading(button, true);

  try {
    const inputData = await getInputContent("vigenere");
    let key = document.getElementById("vigenere-key").value.toUpperCase().replace(/[^A-Z]/g, "");
    const preserveNonAlpha = getPreserveCheckbox("vigenere")?.checked ?? false;

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }

    if (!key) {
      showError("Kunci harus mengandung setidaknya satu huruf");
      return;
    }

    let result = "";
    let keyIndex = 0;
    let contentToProcess = inputData.content;

    if (inputData.isFile && inputData.fileType === "binary") {
      // For binary files, use key bytes cyclically
      for (let char of contentToProcess) {
        const charCode = char.charCodeAt(0);
        const keyChar = key.charCodeAt(keyIndex % key.length) - 65;
        const encrypted = (charCode + keyChar) % 256;
        result += String.fromCharCode(encrypted);
        keyIndex++;
      }
    } else {
      // Text processing
      const cleanTextValue = cleanText(contentToProcess, preserveNonAlpha);
      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const p = char.charCodeAt(0) - 65;
          const k = key.charCodeAt(keyIndex % key.length) - 65;
          const c = (p + k) % 26;
          result += String.fromCharCode(c + 65);
          keyIndex++;
        } else if (preserveNonAlpha) {
          result += char;
        }
      }
    }

    const resultTextarea = document.getElementById("vigenere-result");
    resultTextarea.dataset.rawResult = result;

    // 2. Simpan metadata file
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = inputData.fileType;
    resultTextarea.dataset.originalFilename = inputData.filename || "";
    resultTextarea.dataset.isDecryption = "false"; // Tandai sebagai hasil enkripsi

    // 3. Panggil fungsi formatOutput untuk tampilan awal
    formatOutput('vigenere');

    addSuccessAnimation(resultTextarea);
  } catch (error) {
    showError("Terjadi kesalahan saat enkripsi: " + error.message);
  } finally {
    setButtonLoading(button, false);
  }
}

async function decryptVigenere() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("vigenere", "secondary");
  setButtonLoading(button, true);

  try {
    const inputData = await getInputContent("vigenere");
    let key = document.getElementById("vigenere-key").value.toUpperCase().replace(/[^A-Z]/g, "");
    const preserveNonAlpha = getPreserveCheckbox("vigenere")?.checked ?? false;

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }

    if (!key) {
      showError("Kunci harus mengandung setidaknya satu huruf");
      return;
    }

    let result = "";
    let keyIndex = 0;
    let contentToProcess = inputData.content;

    if (inputData.isFile && inputData.fileType === "binary") {
      // For binary files, use key bytes cyclically
      for (let char of contentToProcess) {
        const charCode = char.charCodeAt(0);
        const keyChar = key.charCodeAt(keyIndex % key.length) - 65;
        const decrypted = (charCode - keyChar + 256) % 256;
        result += String.fromCharCode(decrypted);
        keyIndex++;
      }
    } else {
      // Text processing
      const cleanTextValue = cleanText(contentToProcess, preserveNonAlpha);
      for (let char of cleanTextValue) {
        if (char >= "A" && char <= "Z") {
          const c = char.charCodeAt(0) - 65;
          const k = key.charCodeAt(keyIndex % key.length) - 65;
          const p = (c - k + 26) % 26;
          result += String.fromCharCode(p + 65);
          keyIndex++;
        } else if (preserveNonAlpha) {
          result += char;
        }
      }
    }

    const resultTextarea = document.getElementById("vigenere-result");
    resultTextarea.value = result;

    resultTextarea.dataset.rawResult = result; // Simpan hasil mentah juga
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = inputData.fileType;

    // Tandai sebagai hasil dekripsi dan simpan nama file asli
    if (inputData.isFile) {
      resultTextarea.dataset.originalFilename = inputData.filename;
      resultTextarea.dataset.isDecryption = "true";
    } else {
      resultTextarea.dataset.originalFilename = "";
      resultTextarea.dataset.isDecryption = "true"; // Tetap tandai sbg dekripsi
    }

    addSuccessAnimation(resultTextarea);
  } catch (error) {
    showError("Terjadi kesalahan saat dekripsi: " + error.message);
  } finally {
    setButtonLoading(button, false);
  }
}

// DIPERBAIKI: Hill Cipher dengan file support (hanya untuk text files)
async function encryptHill() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("hill", "primary");
  setButtonLoading(button, true);

  try {
    const inputData = await getInputContent("hill");
    const key1 = parseInt(document.getElementById("hill-key-1").value);
    const key2 = parseInt(document.getElementById("hill-key-2").value);
    const key3 = parseInt(document.getElementById("hill-key-3").value);
    const key4 = parseInt(document.getElementById("hill-key-4").value);

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }

    // Hill Cipher tidak mendukung binary files
    if (inputData.isFile && inputData.fileType === "binary") {
      showError("Hill Cipher hanya mendukung file teks, bukan file binary");
      return;
    }

    // Hill Cipher hanya memproses huruf, tidak ada opsi preserve
    const cleanTextValue = inputData.content.toUpperCase().replace(/[^A-Z]/g, "");

    if (!cleanTextValue) {
      showError("Teks harus mengandung huruf untuk Hill Cipher");
      return;
    }

    const keyMatrix = [[key1, key2], [key3, key4]];
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

    const resultTextarea = document.getElementById("hill-result");
    resultTextarea.dataset.rawResult = result;

    // 2. Simpan metadata file
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = inputData.fileType;
    resultTextarea.dataset.originalFilename = inputData.filename || "";
    resultTextarea.dataset.isDecryption = "false"; // Tandai sebagai hasil enkripsi

    // 3. Panggil fungsi formatOutput untuk tampilan awal
    formatOutput('hill');

    addSuccessAnimation(resultTextarea);
  } catch (error) {
    showError("Terjadi kesalahan saat enkripsi: " + error.message);
  } finally {
    setButtonLoading(button, false);
  }
}

async function decryptHill() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("hill", "secondary");
  setButtonLoading(button, true);

  try {
    const inputData = await getInputContent("hill");
    const key1 = parseInt(document.getElementById("hill-key-1").value);
    const key2 = parseInt(document.getElementById("hill-key-2").value);
    const key3 = parseInt(document.getElementById("hill-key-3").value);
    const key4 = parseInt(document.getElementById("hill-key-4").value);

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }

    // Hill Cipher tidak mendukung binary files
    if (inputData.isFile && inputData.fileType === "binary") {
      showError("Hill Cipher hanya mendukung file teks, bukan file binary");
      return;
    }

    const cleanTextValue = inputData.content.toUpperCase().replace(/[^A-Z]/g, "");

    if (!cleanTextValue) {
      showError("Teks harus mengandung huruf untuk Hill Cipher");
      return;
    }

    if (cleanTextValue.length % 2 !== 0) {
      showError("Panjang teks huruf harus genap untuk Hill Cipher");
      return;
    }

    const keyMatrix = [[key1, key2], [key3, key4]];
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

    const adjugate = [[key4, -key2], [-key3, key1]];
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

    const resultTextarea = document.getElementById("hill-result");
    resultTextarea.value = decryptedLetters;

    resultTextarea.dataset.rawResult = result; // Simpan hasil mentah juga
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = inputData.fileType;

    // Tandai sebagai hasil dekripsi dan simpan nama file asli
    if (inputData.isFile) {
      resultTextarea.dataset.originalFilename = inputData.filename;
      resultTextarea.dataset.isDecryption = "true";
    } else {
      resultTextarea.dataset.originalFilename = "";
      resultTextarea.dataset.isDecryption = "true"; // Tetap tandai sbg dekripsi
    }

    addSuccessAnimation(resultTextarea);
  } catch (error) {
    showError("Terjadi kesalahan saat dekripsi: " + error.message);
  } finally {
    setButtonLoading(button, false);
  }
}

// DIPERBAIKI: Permutation Cipher dengan file support (hanya untuk text files)
async function encryptPermutation() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("permutation", "primary");
  setButtonLoading(button, true);

  try {
    const inputData = await getInputContent("permutation");
    const keyStr = document.getElementById("permutation-key").value;

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }

    // Permutation Cipher tidak mendukung binary files
    if (inputData.isFile && inputData.fileType === "binary") {
      showError("Permutation Cipher hanya mendukung file teks, bukan file binary");
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

    const cleanTextValue = inputData.content.toUpperCase().replace(/[^A-Z]/g, "");

    if (!cleanTextValue) {
      showError("Teks harus mengandung huruf untuk Permutation Cipher");
      return;
    }

    let result = "";
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

    const resultTextarea = document.getElementById("permutation-result");
    resultTextarea.dataset.rawResult = result;

    // 2. Simpan metadata file
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = inputData.fileType;
    resultTextarea.dataset.originalFilename = inputData.filename || "";
    resultTextarea.dataset.isDecryption = "false"; // Tandai sebagai hasil enkripsi

    // 3. Panggil fungsi formatOutput untuk tampilan awal
    formatOutput('permutation');

    addSuccessAnimation(resultTextarea);
  } catch (error) {
    showError("Terjadi kesalahan saat enkripsi: " + error.message);
  } finally {
    setButtonLoading(button, false);
  }
}

async function decryptPermutation() {
  const button =
    (typeof event !== "undefined" && event && event.target) ||
    getButtonFor("permutation", "secondary");
  setButtonLoading(button, true);

  try {
    const inputData = await getInputContent("permutation");
    const keyStr = document.getElementById("permutation-key").value;

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }

    // Permutation Cipher tidak mendukung binary files
    if (inputData.isFile && inputData.fileType === "binary") {
      showError("Permutation Cipher hanya mendukung file teks, bukan file binary");
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

    const cleanTextValue = inputData.content.toUpperCase().replace(/[^A-Z]/g, "");

    if (!cleanTextValue) {
      showError("Teks harus mengandung huruf untuk Permutation Cipher");
      return;
    }

    if (cleanTextValue.length % n !== 0) {
      showError(`Panjang teks harus kelipatan dari ${n} (panjang kunci)`);
      return;
    }

    let result = "";
    for (let i = 0; i < cleanTextValue.length; i += n) {
      const block = cleanTextValue.substring(i, i + n);
      const decryptedBlock = new Array(n);

      for (let j = 0; j < n; j++) {
        const targetIndex = key[j] - 1;
        decryptedBlock[targetIndex] = block[j];
      }

      result += decryptedBlock.join("");
    }

    const resultTextarea = document.getElementById("permutation-result");
    resultTextarea.value = result;

    resultTextarea.dataset.rawResult = result; // Simpan hasil mentah juga
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = inputData.fileType;

    // Tandai sebagai hasil dekripsi dan simpan nama file asli
    if (inputData.isFile) {
      resultTextarea.dataset.originalFilename = inputData.filename;
      resultTextarea.dataset.isDecryption = "true";
    } else {
      resultTextarea.dataset.originalFilename = "";
      resultTextarea.dataset.isDecryption = "true"; // Tetap tandai sbg dekripsi
    }

    addSuccessAnimation(resultTextarea);
  } catch (error) {
    showError("Terjadi kesalahan saat dekripsi: " + error.message);
  } finally {
    setButtonLoading(button, false);
  }
}

// ------------------------- PLAYFAIR (5x5 grid, I=J) -------------------------
function buildPlayfairMatrix(keyword) {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // 25 huruf, tanpa J
  keyword = (keyword || "").toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
  let used = new Set();
  let seq = "";

  // add keyword letters first (unique, with J->I rule)
  for (let ch of keyword) {
    if (ch === "J") ch = "I";
    if (!used.has(ch) && alphabet.includes(ch)) {
      used.add(ch);
      seq += ch;
    }
  }
  // add remaining letters
  for (let ch of alphabet) {
    if (!used.has(ch)) {
      used.add(ch);
      seq += ch;
    }
  }

  // build 5x5 matrix
  const size = 5;
  const matrix = [];
  let idx = 0;
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push(seq[idx++] || "X");
    }
    matrix.push(row);
  }
  return { matrix, size };
}

function findPos(matrix, size, ch) {
  if (ch === "J") ch = "I"; // treat J as I
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === ch) return { r, c };
    }
  }
  return null;
}

function preparePlayfairPairs(text) {
  let cleaned = text.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
  let pairs = [];
  let i = 0;
  while (i < cleaned.length) {
    let a = cleaned[i];
    let b = cleaned[i + 1];
    if (!b) {
      pairs.push([a, "X"]);
      i += 1;
    } else if (a === b) {
      pairs.push([a, "X"]);
      i += 1;
    } else {
      pairs.push([a, b]);
      i += 2;
    }
  }
  return pairs;
}

function playfairProcess(text, keyword, encrypt = true, preserveNonAlpha = false) {
  const { matrix, size } = buildPlayfairMatrix(keyword);
  const pairs = preparePlayfairPairs(text);

  const resultLetters = [];
  for (const pair of pairs) {
    const [A, B] = pair;
    const posA = findPos(matrix, size, A);
    const posB = findPos(matrix, size, B);
    if (!posA || !posB) continue;

    if (posA.r === posB.r) {
      // same row
      if (encrypt) {
        resultLetters.push(matrix[posA.r][(posA.c + 1) % size]);
        resultLetters.push(matrix[posB.r][(posB.c + 1) % size]);
      } else {
        resultLetters.push(matrix[posA.r][(posA.c - 1 + size) % size]);
        resultLetters.push(matrix[posB.r][(posB.c - 1 + size) % size]);
      }
    } else if (posA.c === posB.c) {
      // same column
      if (encrypt) {
        resultLetters.push(matrix[(posA.r + 1) % size][posA.c]);
        resultLetters.push(matrix[(posB.r + 1) % size][posB.c]);
      } else {
        resultLetters.push(matrix[(posA.r - 1 + size) % size][posA.c]);
        resultLetters.push(matrix[(posB.r - 1 + size) % size][posB.c]);
      }
    } else {
      // rectangle swap
      resultLetters.push(matrix[posA.r][posB.c]);
      resultLetters.push(matrix[posB.r][posA.c]);
    }
  }

  if (preserveNonAlpha) {
    // reinsert non-letters
    const up = text.toUpperCase();
    let out = "";
    let letterIdx = 0;
    for (let i = 0; i < up.length; i++) {
      let ch = up[i];
      if (/[A-Z]/.test(ch)) {
        if (ch === "J") ch = "I";
        out += resultLetters[letterIdx++] || "";
      } else {
        out += ch;
      }
    }
    return out;
  } else {
    return resultLetters.join("");
  }
}

// Ganti fungsi encryptPlayfair yang lama dengan ini
async function encryptPlayfair() {
  const button = (typeof event !== "undefined" && event && event.target) || getButtonFor("playfair", "primary");
  setButtonLoading(button, true);
  try {
    const inputData = await getInputContent("playfair");
    const preserve = document.getElementById("playfair-preserve")?.checked ?? false;
    const key = document.getElementById("playfair-key").value || "";

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }
    if (inputData.isFile && inputData.fileType === "binary") {
      showError("Playfair hanya mendukung teks, bukan binary");
      return;
    }

    const result = playfairProcess(inputData.content, key, true, preserve);
    const resultTextarea = document.getElementById("playfair-result");

    // --- PERUBAHAN DI SINI ---
    resultTextarea.dataset.rawResult = result;
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = "text"; // Playfair selalu menghasilkan teks
    resultTextarea.dataset.originalFilename = inputData.filename || "";
    resultTextarea.dataset.isDecryption = "false";

    formatOutput('playfair');
    // --- AKHIR PERUBAHAN ---

    addSuccessAnimation(resultTextarea);
  } catch (err) {
    showError("Error Playfair: " + err.message);
  } finally {
    setButtonLoading(button, false);
  }
}

// Ganti fungsi decryptPlayfair yang lama dengan ini
async function decryptPlayfair() {
  const button = (typeof event !== "undefined" && event && event.target) || getButtonFor("playfair", "secondary");
  setButtonLoading(button, true);
  try {
    const inputData = await getInputContent("playfair");
    const preserve = document.getElementById("playfair-preserve")?.checked ?? false;
    const key = document.getElementById("playfair-key").value || "";

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }
    if (inputData.isFile && inputData.fileType === "binary") {
      showError("Playfair hanya mendukung teks, bukan binary");
      return;
    }

    const result = playfairProcess(inputData.content, key, false, preserve);
    const resultTextarea = document.getElementById("playfair-result");

    // --- PERUBAHAN DI SINI ---
    resultTextarea.value = result; // Hasil dekripsi tidak perlu diformat
    resultTextarea.dataset.rawResult = result;
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = "text";

    if (inputData.isFile) {
        resultTextarea.dataset.originalFilename = inputData.filename;
        resultTextarea.dataset.isDecryption = "true";
    } else {
        resultTextarea.dataset.originalFilename = "";
        resultTextarea.dataset.isDecryption = "true";
    }
    // --- AKHIR PERUBAHAN ---

    addSuccessAnimation(resultTextarea);
  } catch (err) {
    showError("Error Playfair: " + err.message);
  } finally {
    setButtonLoading(button, false);
  }
}

// ------------------------- ONE-TIME PAD (fixed: output letters-only) -------------------------
async function readOTPKeyLetters(fileInput) {
  if (!fileInput || fileInput.files.length === 0) return [];
  try {
    const fileData = await readFileContent(fileInput.files[0]); // util existing
    // hanya ambil huruf A-Z
    const letters = (fileData.content || "").toUpperCase().replace(/[^A-Z]/g, "").split("");
    return letters;
  } catch (err) {
    throw new Error("Gagal baca key file: " + err.message);
  }
}

// core: apply OTP on a string that is already only A-Z
function applyOTPOnLettersOnly(lettersOnlyText, keyLetters, encrypt = true) {
  const outArr = [];
  let keyIdx = 0;
  for (let i = 0; i < lettersOnlyText.length; i++) {
    const ch = lettersOnlyText[i];
    if (keyIdx >= keyLetters.length) {
      throw new Error("Kunci tidak cukup panjang untuk pesan (butuh lebih banyak huruf di file kunci)");
    }
    const p = ch.charCodeAt(0) - 65;
    const k = keyLetters[keyIdx].charCodeAt(0) - 65;
    const c = encrypt ? (p + k) % 26 : (p - k + 26) % 26;
    outArr.push(String.fromCharCode(c + 65));
    keyIdx++;
  }
  return outArr.join("");
}

// Ganti fungsi encryptOTP yang lama dengan ini
async function encryptOTP() {
  const button = (typeof event !== "undefined" && event && event.target) || getButtonFor("otp", "primary");
  setButtonLoading(button, true);
  try {
    const inputData = await getInputContent("otp");
    const keyFileInput = document.getElementById("otp-key-file");

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }
    if (!keyFileInput || keyFileInput.files.length === 0) {
      showError("Pilih file kunci (teks) terlebih dahulu");
      return;
    }

    const plaintext = inputData.content.replace(/[^a-zA-Z]/g, '');
    const keyData = await readFileContent(keyFileInput.files[0]);
    const key = keyData.content.toUpperCase().replace(/[^A-Z]/g, '');

    if (plaintext.length === 0) {
      throw new Error("Teks input tidak mengandung huruf untuk dienkripsi.");
    }
    if (key.length < plaintext.length) {
      throw new Error(`Kunci tidak cukup panjang. Dibutuhkan ${plaintext.length} huruf, tersedia ${key.length}.`);
    }

    let result = "";
    for (let i = 0; i < plaintext.length; i++) {
      const p_char = plaintext[i];
      const k_val = key.charCodeAt(i) - 65;
      const p_base = (p_char === p_char.toUpperCase()) ? 65 : 97;
      const p_val = p_char.charCodeAt(0) - p_base;
      const c_val = (p_val + k_val) % 26;
      result += String.fromCharCode(c_val + p_base);
    }

    const resultTextarea = document.getElementById("otp-result");

    // --- PERUBAHAN DI SINI ---
    resultTextarea.dataset.rawResult = result;
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = "text"; // OTP selalu menghasilkan teks
    resultTextarea.dataset.originalFilename = inputData.filename || "";
    resultTextarea.dataset.isDecryption = "false";

    formatOutput('otp');
    // --- AKHIR PERUBAHAN ---
    
    addSuccessAnimation(resultTextarea);

  } catch (err) {
    showError("Error Enkripsi: " + err.message);
  } finally {
    setButtonLoading(button, false);
  }
}

// Ganti fungsi decryptOTP yang lama dengan ini
async function decryptOTP() {
  const button = (typeof event !== "undefined" && event && event.target) || getButtonFor("otp", "secondary");
  setButtonLoading(button, true);
  try {
    const inputData = await getInputContent("otp");
    const keyFileInput = document.getElementById("otp-key-file");

    if (!inputData.content || (typeof inputData.content === "string" && !inputData.content.trim())) {
      showError("Masukkan teks atau pilih file terlebih dahulu");
      return;
    }
    if (!keyFileInput || keyFileInput.files.length === 0) {
      showError("Pilih file kunci (teks) terlebih dahulu");
      return;
    }

    const ciphertext = inputData.content.replace(/[^a-zA-Z]/g, '');
    const keyData = await readFileContent(keyFileInput.files[0]);
    const key = keyData.content.toUpperCase().replace(/[^A-Z]/g, '');

    if (ciphertext.length === 0) {
      throw new Error("Teks input tidak mengandung huruf untuk didekripsi.");
    }
    if (key.length < ciphertext.length) {
      throw new Error(`Kunci tidak cukup panjang. Dibutuhkan ${ciphertext.length} huruf, tersedia ${key.length}.`);
    }

    let result = "";
    for (let i = 0; i < ciphertext.length; i++) {
      const c_char = ciphertext[i];
      const k_val = key.charCodeAt(i) - 65;
      const c_base = (c_char === c_char.toUpperCase()) ? 65 : 97;
      const c_val = c_char.charCodeAt(0) - c_base;
      const p_val = (c_val - k_val + 26) % 26;
      result += String.fromCharCode(p_val + c_base);
    }

    const resultTextarea = document.getElementById("otp-result");

    // --- PERUBAHAN DI SINI ---
    resultTextarea.value = result; // Hasil dekripsi tidak perlu diformat
    resultTextarea.dataset.rawResult = result;
    resultTextarea.dataset.isFile = inputData.isFile.toString();
    resultTextarea.dataset.fileType = "text";

    if (inputData.isFile) {
        resultTextarea.dataset.originalFilename = inputData.filename;
        resultTextarea.dataset.isDecryption = "true";
    } else {
        resultTextarea.dataset.originalFilename = "";
        resultTextarea.dataset.isDecryption = "true";
    }
    // --- AKHIR PERUBAHAN ---

    addSuccessAnimation(resultTextarea);
    
  } catch (err) {
    showError("Error Dekripsi: " + err.message);
  } finally {
    setButtonLoading(button, false);
  }
}

// ------------------------- file input listeners for new inputs -------------------------
function setupExtraFileInputs() {
  const ids = [
    { file: "playfair-file", info: "playfair-file-info", text: "playfair-text" },
    { file: "otp-file", info: "otp-file-info", text: "otp-text" },
    { file: "otp-key-file", info: "otp-key-file-info", text: null }
  ];
  ids.forEach(x => {
    const el = document.getElementById(x.file);
    const info = document.getElementById(x.info);
    const textInput = x.text ? document.getElementById(x.text) : null;
    if (el && info) {
      el.addEventListener("change", function () {
        if (this.files.length > 0) {
          const f = this.files[0];
          const ft = getFileType(f.name);
          info.innerHTML = `<span>${f.name}</span> <span class="file-type-badge">${ft}</span> <span class="file-size">${formatFileSize(f.size)}</span>`;
          info.classList.add("has-file");
          if (textInput) {
            textInput.value = "";
            textInput.placeholder = "File selected. Text input disabled.";
            textInput.disabled = true;
          }
        } else {
          info.textContent = "No file selected";
          info.classList.remove("has-file");
          if (textInput) {
            textInput.disabled = false;
            textInput.placeholder = "Masukkan teks di sini...";
          }
        }
      });
    }
  });
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

  // Setup file input listeners
  setupFileInputListeners();
  setupExtraFileInputs();
});