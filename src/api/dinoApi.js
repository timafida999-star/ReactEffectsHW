import { getItemsList, getItem, createItem, updateItem, deleteItem } from "./fakeApi.js";

export { getItemsList, getItem, updateItem, deleteItem };

export async function createDino(data) {
  const { name, description, ...otherFields } = data;
  const created = await createItem({ name, description });

  try {
    return await updateItem(created.id, otherFields);
  } catch (error) {
    const partialError = new Error(
      `${name} was created, but the details were not saved (${error.message}). Open it and press Edit to finish.`
    );
    partialError.createdId = created.id;
    throw partialError;
  }
}
