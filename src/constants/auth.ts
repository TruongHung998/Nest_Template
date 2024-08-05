export const jwtConstants = {
  secret:
    "DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.",
};
export const stringConst = {
  requireMessage: (field = "") => {
    return `Vui lòng nhập/điền ${field}`;
  },
  requireNumberMessage: (field = "") => {
    return `Vui lòng nhập/điền số - ${field}`;
  },
  requireDateMessage: (field = "") => {
    return `Vui lòng nhập/điền ngày - ${field}`;
  },
};
