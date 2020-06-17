import Vue from 'vue';

export const setNormalizedValue = (entities: { [key: string]: any }, keys: string[], value: { uid: string }) => {
  Vue.set(entities, value.uid, value);
  keys.push(value.uid);
};

export const deleteNormalizedValue = (entities: { [key: string]: any }, keys: string[], uid: string) => {
  Vue.delete(entities, uid);
  Vue.delete(keys, keys.indexOf(uid));
};
