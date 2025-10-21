document.addEventListener("DOMContentLoaded", function () {
  const duplicateBtn = document.getElementById("duplicate-btn");
  const original = document.getElementById("dupe");
  const container = document.getElementById("main");

  // Defensive: if required elements missing, stop (prevents errors if loaded on other pages)
  if (!original || !container) return;

  // Load saved duplicates from localStorage
  const savedData = JSON.parse(localStorage.getItem("duplicates") || "[]");
  savedData.forEach((fields) => {
    const clone = createClone(fields);
    container.appendChild(clone);
  });

  // Add new clone (guard duplicateBtn)
  if (duplicateBtn) {
    duplicateBtn.addEventListener("click", function () {
      const clone = createClone();
      container.appendChild(clone);
      saveDuplicates();
    });
  }

  // Function to create a clone and restore field values
  function createClone(fields = {}) {
    const clone = original.cloneNode(true);
    clone.style.display = "flex"; // show clone
    clone.id = ""; // remove duplicate ID

    const inputs = clone.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      const key = input.name || input.className || "";

      if (fields[key] !== undefined) {
        if (input.type === "checkbox") {
          input.checked = !!fields[key];
        } else {
          input.value = fields[key];
        }
      }

      // Save on input or change
      input.addEventListener("input", saveDuplicates);
      input.addEventListener("change", saveDuplicates);
    });

    // Remove clone functionality
    const removeCheck = clone.querySelector(".remove-check");
    if (removeCheck) {
      removeCheck.addEventListener("change", function () {
        // When marking 'Ferdig' (remove), record a delivery object so the same user can
        // be recorded multiple times. Keep legacy string entries supported.
        const userInput = clone.querySelector("input[name='user']");
        const dateInput = clone.querySelector("input[name='date']");
        const sd32 = !!clone.querySelector("input[name='sd32']") && clone.querySelector("input[name='sd32']").checked;
        const sd64 = !!clone.querySelector("input[name='sd64']") && clone.querySelector("input[name='sd64']").checked;
        const sd128 = !!clone.querySelector("input[name='sd128']") && clone.querySelector("input[name='sd128']").checked;

        const userId = userInput ? userInput.value.trim() : '';
        const dateVal = dateInput ? dateInput.value : '';

        try {
          const raw = localStorage.getItem("delivered") || "[]";
          let delivered = JSON.parse(raw);
          if (!Array.isArray(delivered)) delivered = [];

          // If storage contains simple strings (legacy), keep them and append objects.
          const record = {
            user: userId,
            date: dateVal,
            sd32: sd32,
            sd64: sd64,
            sd128: sd128,
            ts: Date.now()
          };

          delivered.push(record);
          localStorage.setItem("delivered", JSON.stringify(delivered));
        } catch (e) {
          // fallback: write a single-entry array of objects
          const record = [{ user: userId, date: dateVal, sd32, sd64, sd128, ts: Date.now() }];
          localStorage.setItem("delivered", JSON.stringify(record));
        }

        clone.remove();
        saveDuplicates();
      });
    }

    // Delivered checkbox functionality
    const deliveredCheck = clone.querySelector(".delivered-check");
    if (deliveredCheck) {
      deliveredCheck.addEventListener("change", function () {
        const userInput = clone.querySelector("input[name='user']");
        if (!userInput) return;
        const itemId = userInput.value.trim();
        if (!itemId) return;

        let delivered = JSON.parse(localStorage.getItem("delivered") || "[]");

        if (deliveredCheck.checked) {
          if (!delivered.includes(itemId)) delivered.push(itemId);
        } else {
          delivered = delivered.filter(id => id !== itemId);
        }

        localStorage.setItem("delivered", JSON.stringify(delivered));

        // Also update saved duplicates flag if present
        const existing = JSON.parse(localStorage.getItem("duplicates") || "[]");
        const idx = existing.findIndex(e => (e.user || "").trim() === itemId);
        if (idx !== -1) {
          existing[idx].delivered = deliveredCheck.checked;
          localStorage.setItem("duplicates", JSON.stringify(existing));
        }
      });

      // If clone was restored with delivered checked, ensure localStorage is synced
      const userInput = clone.querySelector("input[name='user']");
      if (deliveredCheck.checked && userInput) {
        const itemId = userInput.value.trim();
        if (itemId) {
          let delivered = JSON.parse(localStorage.getItem("delivered") || "[]");
          if (!delivered.includes(itemId)) {
            delivered.push(itemId);
            localStorage.setItem("delivered", JSON.stringify(delivered));
          }
        }
      }
    }

    return clone;
  }

  // Save all clones to localStorage
  function saveDuplicates() {
    const clones = Array.from(container.children).filter(el => el !== original);
    const data = clones.map((clone) => {
      const fields = {};
      const inputs = clone.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        const key = input.name || input.className || "";
        if (input.type === "checkbox") {
          fields[key] = input.checked;
        } else {
          fields[key] = input.value;
        }
      });
      return fields;
    });
    localStorage.setItem("duplicates", JSON.stringify(data));
  }
});
