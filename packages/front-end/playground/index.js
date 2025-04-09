const removeObjectProperty = (obj, key) => {
  delete obj[key];
  return obj;
};
const isPropertyShouldBeClean = (value) => {
  return (
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "string" && value.trim() === "") ||
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0)
  );
};

const cleanObject = (originObj, cleandedObj = {}) => {
  for (const key in originObj) {
    if (!isPropertyShouldBeClean(originObj[key])) {
      cleandedObj[key] = originObj[key];
    } else if (typeof originObj[key] === "object" && originObj[key] !== null) {
      cleanObject(originObj[key], (cleandedObj[key] = {}));
    }
  }
  return cleandedObj;
};
// // Example usage:
const original = {
  a: undefined,
  b: { c: undefined, d: [] },
  e: [5, 6],
  f: " ",
};
const cleanded = cleanObject(original);
console.log("cleanded", cleanded); // { a: 1, b: { c: 2, d: [3, 4] }, e: [5, 6] }
// const deepClone = (obj) => {
//   if (obj === null || typeof obj !== 'object') {
//     return obj;
//   }

//   if (Array.isArray(obj)) {
//     return obj.map(item => deepClone(item));
//   }

//   const clonedObj = {};
//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       clonedObj[key] = deepClone(obj[key]);
//     }
//   }
//   return clonedObj;
// };

// console.log('clonded', cloned); // { a: 1, b: { c: 2, d: [3, 4] }, e: [5, 6] }
// console.log(cloned === original); // false
// console.log(cloned.b === original.b); // false
// console.log(cloned.e === original.e); // false
