document.getElementById("encryptBtn").addEventListener("click", async () => {
  const text = document.getElementById("inputText").value;

  const res = await fetch("/api/crypto/shift/encrypt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, shift: 3 }),
  });

  const data = await res.json();
  document.getElementById("outputText").innerText = data.encrypted;
});
