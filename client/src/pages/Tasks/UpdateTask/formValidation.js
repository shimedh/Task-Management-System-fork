// formValidation.js
export const validateForm = (title, description, assigned_to, due_date, priority, status) => {
  const errors = {};

  if (title.trim() === "") {
    errors.title = "Title is required";
  }

  if (description.trim() === "") {
    errors.description = "Description is required";
  }

  if (!assigned_to) {
    errors.assigned_to = "Assigned to is required";
  }

  if (due_date.trim() === "") {
    errors.due_date = "Due date is required";
  }

  if (!priority) {
    errors.priority = "Priority is required";
  }

  if (!status) {
    errors.status = "Progress is required";
  }

  return errors;
};
