const addTrack2Cart = (id, button) => {
  fetch("/cart/add", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tracks: [id],
    }),
    method: "POST",
  }).then((res) => {
    if (!res.ok) {
      console.log(res.body);
      alert("Error while adding to cart. Details are in console");
      return;
    }

    button.disabled = true;
    button.title = "Already in your cart";
    button.style.opacity = "0.5";
  });
};
