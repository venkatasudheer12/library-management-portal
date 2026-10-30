const BASE_URL = "http://localhost:3000";

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Backend is offline. Start the backend with npm run server.");
  }

  if (!response.ok) {
    let message = `Server error: ${response.status}`;
    try {
      const data = await response.json();
      if (data.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

function createAPI(resource) {
  const url = `${BASE_URL}/${resource}`;
  return {
    getAll: () => request(url),
    getById: (id) => request(`${url}/${id}`),
    add: (data) => request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`${url}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }),
    remove: (id) => request(`${url}/${id}`, { method: "DELETE" })
  };
}

export const booksAPI = createAPI("books");
export const membersAPI = createAPI("members");
export const transactionsAPI = createAPI("transactions");