document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.querySelector(".todo-input");
  const todoList = document.querySelector(".todo-list");
  const itemsLeft = document.querySelector(".todo-footer span");
  const clearCompletedBtn = document.querySelector(
    ".todo-footer span:last-child"
  );
  const filterButtons = document.querySelectorAll(".filter-button");
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // Cargar todos guardados
  function loadTodos() {
    todoList.querySelectorAll(".todo-item").forEach((item) => item.remove());
    todos.forEach((todo) => {
      addTodoToDOM(todo.text, todo.completed);
    });
    updateItemsCount();
  }

  // Guardar todos en localStorage
  function saveTodos() {
    todos = Array.from(todoList.querySelectorAll(".todo-item")).map((item) => ({
      text: item.querySelector(".todo-text").textContent,
      completed: item
        .querySelector(".todo-checkbox")
        .classList.contains("checked"),
    }));
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  // Agregar nueva tarea
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && todoInput.value.trim() !== "") {
      addTodoToDOM(todoInput.value.trim(), false);
      todoInput.value = "";
      updateItemsCount();
      saveTodos();
    }
  });

  function addTodoToDOM(text, completed) {
    const todoItem = document.createElement("div");
    todoItem.className = "todo-item";
    todoItem.innerHTML = `
            <div class="todo-checkbox ${completed ? "checked" : ""}"></div>
            <span class="todo-text" style="${
              completed ? "text-decoration: line-through; color: #999;" : ""
            }">${text}</span>
            <span class="todo-delete">×</span>
        `;

    const footer = document.querySelector(".todo-footer");
    todoList.insertBefore(todoItem, footer);

    setupTodoItemEvents(todoItem);
  }

  // Configurar eventos para elementos existentes
  function setupTodoItemEvents(todoItem) {
    const checkbox = todoItem.querySelector(".todo-checkbox");
    const deleteBtn = todoItem.querySelector(".todo-delete");
    const todoText = todoItem.querySelector(".todo-text");

    // Toggle completado
    checkbox.addEventListener("click", () => {
      checkbox.classList.toggle("checked");
      todoText.style.textDecoration = checkbox.classList.contains("checked")
        ? "line-through"
        : "none";
      todoText.style.color = checkbox.classList.contains("checked")
        ? "#999"
        : "";
      updateItemsCount();
      saveTodos();
    });

    // Eliminar tarea
    deleteBtn.addEventListener("click", () => {
      todoItem.remove();
      updateItemsCount();
      saveTodos();
    });
  }

  // Actualizar contador de items
  function updateItemsCount() {
    const activeItems = document.querySelectorAll(
      ".todo-item:not(.hidden) .todo-checkbox:not(.checked)"
    ).length;
    itemsLeft.textContent = `${activeItems} item${
      activeItems !== 1 ? "s" : ""
    } left`;
  }

  // Limpiar completados
  clearCompletedBtn.addEventListener("click", () => {
    document.querySelectorAll(".todo-checkbox.checked").forEach((checkbox) => {
      checkbox.closest(".todo-item").remove();
    });
    updateItemsCount();
    saveTodos();
  });

  // Filtros
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Actualizar botón activo
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Aplicar filtro
      const filterType = button.textContent.toLowerCase();
      const todos = document.querySelectorAll(".todo-item");

      todos.forEach((todo) => {
        const isCompleted = todo
          .querySelector(".todo-checkbox")
          .classList.contains("checked");
        todo.style.display = getDisplayStyle(filterType, isCompleted);
      });

      updateItemsCount();
    });
  });

  function getDisplayStyle(filterType, isCompleted) {
    switch (filterType) {
      case "all":
        return "flex";
      case "active":
        return isCompleted ? "none" : "flex";
      case "completed":
        return isCompleted ? "flex" : "none";
      default:
        return "flex";
    }
  }

  loadTodos();
  });