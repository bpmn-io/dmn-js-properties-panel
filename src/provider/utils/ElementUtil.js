/**
 * Create a new element and (optionally) set its parent.
 */
export function createElement(type, properties, parent, dmnFactory) {
  const element = dmnFactory.create(type, properties);

  if (parent) {
    element.$parent = parent;
  }

  return element;
}