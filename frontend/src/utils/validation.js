// Validação de Dados partilhados por Register, Checkout e Perfil
export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isPhone = (value) => /^\d{9}$/.test(value.replace(/\s+/g, ""));
// 911012345
export const isPostalCode = (value) => /^\d{4}-\d{3}$/.test(value);
//1000-100
