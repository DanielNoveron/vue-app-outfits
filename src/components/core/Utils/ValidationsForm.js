export const validationsForm = {
  required: (fieldName = "Este campo") => [
    (value) => !!value || `${fieldName} es obligatorio.`,
  ],
  maxLength: (max, fieldName = "Este campo") => [
    (value) =>
      !value ||
      value.length <= max ||
      `${fieldName} debe tener máximo ${max} caracteres.`,
  ],
  pattern: (pattern, fieldName = "Este campo") => [
    (value) => pattern.test(value) || `${fieldName} tiene formato inválido.`,
  ],
  fileSize: (maxBytes, fieldName = "El archivo") => [
    (value) => {
      if (!value) return true;
      const file = value instanceof File ? value : value[0];
      return (
        file.size <= maxBytes ||
        `${fieldName} debe pesar máximo ${maxBytes / (1024 * 1024)} MB.`
      );
    },
  ],
  fileTypes: (types = [], fieldName = "El archivo") => [
    (value) => {
      if (!value) return true;
      const file = value instanceof File ? value : value[0];
      const extension = file.name.split(".").pop().toLowerCase();
      return (
        types.includes(extension) ||
        `${fieldName} debe ser de tipo: ${types.join(", ")}.`
      );
    },
  ],
};
