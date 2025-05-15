const API_URL = "https://api.projet-azure.theed.fr"

const input = document.getElementById("todoInput")
const list = document.getElementById("todoList")
const addBtn = document.getElementById("addBtn")
const emptyState = document.getElementById("emptyState")

// Fonction pour mettre à jour l'état vide
const updateEmptyState = () => {
  if (list.children.length === 0) {
    emptyState.style.display = "flex"
  } else {
    emptyState.style.display = "none"
  }
}

// Fonction pour charger les todos depuis l'API
const loadTodos = async () => {
  try {
    const res = await fetch(API_URL)
    const todos = await res.json()
    list.innerHTML = ""

    // Ajouter chaque todo avec un délai pour l'animation
    todos.forEach((todo, index) => {
      setTimeout(() => {
        addTodoToDOM(todo)
      }, index * 50)
    })

    updateEmptyState()
  } catch (error) {
    console.error("Erreur lors du chargement des todos:", error)
    showNotification("Impossible de charger les tâches", true)
  }
}

// Fonction pour ajouter un todo au DOM
const addTodoToDOM = (todo) => {
  const li = document.createElement("li")
  li.classList.add("todo-item")

  const todoText = document.createElement("div")
  todoText.textContent = todo.text
  todoText.classList.add("todo-text")

  const deleteBtn = document.createElement("button")
  deleteBtn.classList.add("delete-btn")
  deleteBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `
  deleteBtn.setAttribute("aria-label", "Supprimer")
  deleteBtn.onclick = () => deleteTodo(todo._id, li)

  li.appendChild(todoText)
  li.appendChild(deleteBtn)
  list.appendChild(li)

  // Déclencher l'animation après un court délai
  setTimeout(() => {
    li.style.animation = "fade-in 0.3s ease forwards"
  }, 10)

  updateEmptyState()
}

// Fonction pour ajouter un nouveau todo
const addTodo = async () => {
  const text = input.value.trim()
  if (!text) return

  try {
    // Désactiver le bouton pendant l'ajout
    addBtn.disabled = true
    addBtn.style.opacity = "0.7"

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (response.ok) {
      const newTodo = await response.json()
      addTodoToDOM(newTodo)
      input.value = ""

      // Effet de focus sur l'input
      input.focus()
    } else {
      showNotification("Erreur lors de l'ajout de la tâche", true)
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du todo:", error)
    showNotification("Impossible d'ajouter la tâche", true)
  } finally {
    // Réactiver le bouton
    addBtn.disabled = false
    addBtn.style.opacity = "1"
  }
}

// Fonction pour supprimer un todo
const deleteTodo = async (id, element) => {
  try {
    // Ajouter l'animation de suppression
    element.classList.add("deleting")

    // Attendre que l'animation se termine avant de supprimer
    setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
        if (response.ok) {
          element.remove()
          updateEmptyState()
        } else {
          showNotification("Erreur lors de la suppression", true)
          element.classList.remove("deleting")
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        showNotification("Impossible de supprimer la tâche", true)
        element.classList.remove("deleting")
      }
    }, 300)
  } catch (error) {
    console.error("Erreur lors de la suppression du todo:", error)
    showNotification("Impossible de supprimer la tâche", true)
  }
}

// Fonction pour afficher une notification
const showNotification = (message, isError = false) => {
  // Vérifier si une notification existe déjà
  let notification = document.querySelector(".notification")

  // Si une notification existe, la supprimer
  if (notification) {
    notification.remove()
  }

  // Créer une nouvelle notification
  notification = document.createElement("div")
  notification.classList.add("notification")
  if (isError) {
    notification.classList.add("error")
  }
  notification.textContent = message

  // Ajouter la notification au DOM
  document.body.appendChild(notification)

  // Afficher la notification avec une animation
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Supprimer la notification après 3 secondes
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
}

// Ajouter un todo quand on clique sur le bouton
addBtn.addEventListener("click", addTodo)

// Ajouter un todo quand on appuie sur Entrée
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo()
  }
})

// Ajouter des effets visuels subtils
const addVisualEffects = () => {
  // Effet de hover sur la carte
  const card = document.querySelector(".glass-card")

  // Effet de focus sur l'input
  input.addEventListener("focus", () => {
    card.style.boxShadow =
      "0 12px 36px rgba(0, 0, 0, 0.12), 0 1px 1px var(--glass-highlight) inset, 0 -1px 1px var(--glass-shadow) inset"
  })

  input.addEventListener("blur", () => {
    card.style.boxShadow =
      "0 8px 32px var(--shadow), 0 1px 1px var(--glass-highlight) inset, 0 -1px 1px var(--glass-shadow) inset"
  })

  // Ajouter du style CSS pour les notifications
  const style = document.createElement("style")
  style.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(100%);
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      z-index: 1000;
      font-size: 14px;
      color: var(--text-primary);
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
    
    .notification.show {
      transform: translateX(-50%) translateY(0);
    }
    
    .notification.error {
      background: rgba(255, 59, 48, 0.9);
      color: white;
    }
  `
  document.head.appendChild(style)
}

// Charger les todos au chargement de la page
window.onload = () => {
  loadTodos()
  addVisualEffects()
}
