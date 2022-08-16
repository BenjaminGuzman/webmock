const initDB = async () => {
  const res = await fetch("/music", {
    method: "POST",
  });

  if (!res.ok)
    alert(
      `There was an error while trying to populate the database. Status code ${res.status}`,
    );

  location.reload();
};
