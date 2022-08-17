const initDB = async (btn) => {
  btn.innerText = "Initializing...";
  btn.disabled = true;
  btn.style.opacity = "0.5";

  const res = await fetch("/populate", {
    method: "POST",
  });

  if (!res.ok) {
    if (res.status === 504)
      alert(
        "The server may still be busy populating the database. But you may now see some insertions",
      );
    else
      alert(
        `There was an error while trying to populate the database. Status code ${res.status}`,
      );
  }

  location.reload();
};
